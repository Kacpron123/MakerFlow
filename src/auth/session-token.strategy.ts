import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionTokenStrategy extends PassportStrategy(Strategy, 'session-token') {
  constructor(private usersService: UsersService) {
    super();
  }

  /**
   * Ta metoda jest wywoływana automatycznie przez Guard.
   * Passport wyciąga token z nagłówka "Authorization: Bearer <token>"
   * i przekazuje go tutaj jako argument 'token'.
   */
  async validate(token: string): Promise<any> {
    // 1. Sprawdzamy w bazie danych (tabela tokens), czy taki token istnieje i jest ważny
    const userId = await this.usersService.validateSessionToken(token);

    if (!userId) {
      // Jeśli token nie istnieje lub wygasł, wyrzucamy 401 Unauthorized
      throw new UnauthorizedException('Nieprawidłowy lub wygasły token sesji');
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Użytkownik nie istnieje');
    }

    // 3. To co zwrócimy, NestJS wstrzyknie do obiektu Request (req.user)
    const { password_hash, ...result } = user;
    return result;
  }
}