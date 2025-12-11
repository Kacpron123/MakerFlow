import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Logger } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local')) 
  @Post('login')
  async login(@Request() req) {
    const tokenPayload = await this.authService.issueToken(req.user);
    return { 
      message: 'Login successful', 
      ...tokenPayload
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('session-token')) // Wymaga aktywnego tokena do wylogowania
  async logout(@Request() req): Promise<{ message: string }> {
    // 1. Token jest pobierany z nagłówka żądania (poprzez Guard)
    // 2. Musisz dostać się do surowego tokena przekazanego przez klienta
    
    // Zakładamy, że Guard ('session-token') ma dostęp do surowego tokena:
    const rawToken = req.headers.authorization.split(' ')[1]; // Pobiera token z nagłówka 'Bearer XYZ'
    Logger.log(rawToken);
    // 3. Usuń token z bazy danych
    await this.authService.revokeToken(rawToken); 

    return { message: 'Wylogowanie pomyślne.' };
  }
}