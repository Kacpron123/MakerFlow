import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionTokenStrategy extends PassportStrategy(Strategy, 'session-token') {
  constructor(private usersService: UsersService) {
    super();
  }

  async validate(token: string): Promise<any> {
    const userId = await this.usersService.validateSessionToken(token);

    if (!userId) {
      throw new UnauthorizedException('Nieprawidłowy lub wygasły token sesji');
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Użytkownik nie istnieje');
    }

    const { password_hash, ...result } = user;
    return result;
  }
}