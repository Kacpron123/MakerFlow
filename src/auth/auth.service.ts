import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DatabaseService } from '@database/database.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) {}

  /**
   * Issues a new session token for the given user.
   * @param user User data
   * @returns A promise that resolves to an object containing the session token
   */
  async issueToken(user: any): Promise<{ token: string }> {
    const token = await this.usersService.generateSessionToken(user.user_id, 3600); // 1 hour
    return { token };
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

    // 1. Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new ConflictException('Użytkownik o tej nazwie już istnieje.');
    }

    // 2. Utworzenie użytkownika (funkcja create w UsersService hashuje hasło)
    const newUser = await this.usersService.create(username, password);

    return this.issueToken(newUser);
  }
  async revokeToken(token: string): Promise<void> {
    await this.usersService.removeSessionToken(token);
  }
}
