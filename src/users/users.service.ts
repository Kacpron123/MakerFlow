import { Injectable, Body} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '@database/database.service';


@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async create(username: string, password: string): Promise<any> {
    const salt = await bcrypt.genSalt(10); // generate salt
    const passwordHash = await bcrypt.hash(password, salt); // Hashing password

    try {
      const query = `
        INSERT INTO users (username, password_hash) 
        VALUES ($1, $2) 
        RETURNING user_id, username
      `;
      const result = await this.databaseService.query(query, [username, passwordHash]);
      return result[0];
    } catch (error) {
      console.error('Error creating user in database:', error);
      throw new Error('Could not create user.');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(username: string): Promise<any | undefined>;
  async findOne(id: number): Promise<any | undefined>;

  async findOne(identifier: string | number): Promise<any | undefined> {
    
    const isNumber = typeof identifier === 'number';
    
    const column = isNumber ? 'user_id' : 'username';
    const query = `
      SELECT 
        user_id, 
        username, 
        password_hash
      FROM 
        users
      WHERE 
        ${column} = $1
    `;
    
    try {
      const result = await this.databaseService.query(query, [identifier]);
      return result.length ? result[0] : null;
      
    } catch (error) {
      console.error('Error fetching user from database:', error);
      return null;
    }
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const query = `DELETE FROM users WHERE user_id = $1`
    await this.databaseService.query(query, [id]);
  }
    /**
   * Generate a unique session token and save it to the 'tokens' table.
   * @param userId User ID
   * @param expiresInSeconds Token expiration time in seconds
   * @returns Newly generated token (string)
   */
  async generateSessionToken(userId: number, expiresInSeconds: number = 3600): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    const query = `
      INSERT INTO tokens (user_id, token, expires_at) 
      VALUES ($1, $2, $3) 
      RETURNING token
    `;
    
    await this.databaseService.query(query, [userId, token, expiresAt]);
    return token;
  }
  /**
   * Verifies the validity of a token and returns the user ID.
   * @param token Session token
   * @returns User ID or null
   */
  async validateSessionToken(token: string): Promise<number | null> {
      const query = `
        SELECT user_id 
        FROM tokens 
        WHERE token = $1 AND expires_at > NOW()
      `;
      const result = await this.databaseService.query(query, [token]);
      
      return result.length ? result[0].user_id : null;
  }
  async removeSessionToken(token: string): Promise<void> {
    const query = `DELETE FROM tokens WHERE token = $1`;
    await this.databaseService.query(query, [token]);
  }
}
