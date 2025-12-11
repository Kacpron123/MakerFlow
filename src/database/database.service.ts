import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  async onModuleInit() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    });
    await this.pool.connect();
    console.log('✅ Connected to PostgreSQL');

    const initFile = join(__dirname, '../../init.sql');
    if (existsSync(initFile)) {
      try {
        const initSql = readFileSync(initFile, 'utf8');
        await this.pool.query(initSql);
        console.log('Database initialized');
      } catch (err) {
        console.error('Error initializing database:', err);
      }
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query(sql: string, params?: any[]) {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }
}
