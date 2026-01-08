import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService) {}
  
  async getClient() {
    return await this.pool.connect();
  }

  async onModuleInit() {
    //using variable from docker-compose
    //if not started via docker than .env variable are used
    const dbUrl = this.configService.get<string>('DATABASE_URL');

    this.pool = new Pool({
      connectionString: dbUrl,

      host: this.configService.get<string>('DB_HOST') || 'localhost',
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      port: Number(this.configService.get('DB_PORT')) || 5432,
    });
    if (dbUrl) {
      console.log(`🚀 Connecting via DATABASE_URL (Docker mode)`);
    } else {
      const host = this.configService.get('DB_HOST') || 'localhost';
      const port = this.configService.get('DB_PORT') || 5432;
      console.log(`💻 Connecting via Local Config: ${host}:${port} (Dev mode)`);
    }
    let connected = false;
    let retries = 5;
    while (!connected && retries > 0) {
      try {
        await this.pool.connect();
        connected = true;
        console.log('✅ Connected to PostgreSQL');
      } catch (err) {
        retries--;
        console.log(`❌ Connection failed, retrying... (${retries} attempts left)`);
        await new Promise(res => setTimeout(res, 2000));
      }
    }
    if (!connected) {
      console.log('❌ Unable to connect to PostgreSQL after 5 attempts. Stopping application.');
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query(sql: string, params?: any[]) {
    return (await this.pool.query(sql, params)).rows;
  }
}