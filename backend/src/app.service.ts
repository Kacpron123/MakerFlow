import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly db: DatabaseService) {}
  
  getHello(): string {
    return 'Hello World!';
  }
  async getUsers() {
    const result = await this.db.query('SELECT user_id, username FROM users;');
    return result;
  }
}
