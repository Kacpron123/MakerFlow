import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly db: DatabaseService) {}
  
  getHello(): string {
    return 'Hello World!';
  }
  async getUsers() {
    // Logika dostępu do danych należy do serwisu
    const result = await this.db.query('SELECT user_id, name, mail FROM users;');
    return result;
  }
}
