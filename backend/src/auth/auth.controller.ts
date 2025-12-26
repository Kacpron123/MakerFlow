import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Get('me')
  @UseGuards(AuthGuard('session-token'))
  async getmydata(@Request() req) {
    const userId = req.user.user_id;
    return await this.authService.getUserData(userId);
  }

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
  @UseGuards(AuthGuard('session-token'))
  async logout(@Request() req): Promise<{ message: string }> {
    const rawToken = req.headers.authorization.split(' ')[1];
    await this.authService.revokeToken(rawToken);

    return { message: 'Logout successful.' };
  }

  @Post('refresh')
  @UseGuards(AuthGuard('session-token'))
  async refresh(@Request() req) {
    const userId = req.user.user_id;

    const oldToken = req.headers.authorization.split(' ')[1];
    await this.authService.revokeToken(oldToken);

    const newTokenPayload = await this.authService.issueToken(req.user);

    return {
      message: 'Token refreshed successfully. Please use the new token to authenticate.',
      ...newTokenPayload
    };
  }


}