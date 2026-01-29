import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DatabaseService } from '@database/database.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService,
  ) {}

  /**
   * Issues a new session token for the given user.
   * @param user User data
   * @returns A promise that resolves to an object containing the session token
   */
  async issueToken(user: any): Promise<{ access_token: string }> {
    const access_token = await this.usersService.generateSessionToken(user.user_id, 3600); // 1 hour
    return { access_token };
  }

  /**
   * validateUser
   * @param username 
   * @param pass 
   * @returns 
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username); 
    
    if (user && (await this.usersService.comparePassword(pass, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const { username, password } = registerDto;

    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new ConflictException('A user with that username already exists.');
    }

    const newUser = await this.usersService.create(username, password);

    return this.issueToken(newUser);
  }
  async changePassword(userId: number, oldPass: string, newPass: string) {
    const userRes = await this.databaseService.query(
      'SELECT password_hash FROM users WHERE user_id = $1', 
      [userId]
    );
    const user = userRes[0];
    const isMatch = await bcrypt.compare(oldPass, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('The password is incorrect');
    }
    const hashedNewPass = await bcrypt.hash(newPass, 10);
    await this.databaseService.query(
      'UPDATE users SET password_hash = $1 WHERE user_id = $2',
      [hashedNewPass, userId]
    );

    return { message: 'Password updated successfully' };
  }

  async revokeToken(token: string): Promise<void> {
    await this.usersService.removeSessionToken(token);
  }

  async getUserData(userId: number){
    try {
      const query = `
        SELECT
          user_id AS "id",
          username
        FROM
          users
        WHERE
          user_id = $1
      `;
      const result = await this.databaseService.query(query, [userId]);
      return result[0];
    } catch (error) {
    console.error(`Failed to fetch user data: ${error.message}`);
    throw new InternalServerErrorException('Failed to fetch profile data.');
    }
  }
}
