import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@app/users/users.module';
import { SessionTokenStrategy } from './session-token.strategy';
import { LocalStrategy } from './local.strategy';
import { DatabaseModule } from '@app/database/database.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    DatabaseModule
  ],
  providers: [
    AuthService, 
    SessionTokenStrategy,
    LocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
