import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseService } from './database/database.service';

import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // Ścieżka do folderu 'dist' Twojego Reacta
      // Zakładając, że masz strukturę: /frontend i /backend obok siebie
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'), 
      
      // Wykluczamy ścieżkę API, żeby Nest nie szukał tam plików Reacta
      exclude: ['/api/(.*)'], 
    }),
    ConfigModule.forRoot({isGlobal: true, }),
    AuthModule,
    UsersModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
