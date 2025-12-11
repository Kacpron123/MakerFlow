import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private usersService: UsersService) {
    super();
  }

   serializeUser(user: any, done: (err: Error | null, id: number) => void): void {
    done(null, user.id); // Zapisujemy tylko ID do sesji
  }

  async deserializeUser(payload: number, done: (err: Error | null, user: any) => void): Promise<void> {
    const user = await this.usersService.findOne(payload); // Użycie findOne po ID
    done(null, user);
  }
}