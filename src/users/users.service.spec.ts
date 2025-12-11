import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '@database/database.service';
import * as bcrypt from 'bcrypt';
