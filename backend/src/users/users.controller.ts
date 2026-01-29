import { Controller, Get,Patch, UseGuards, Delete, Request, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Delete('me')
  @UseGuards(AuthGuard('session-token'))
  async deleteAccount(@Request() req){
    const userId = req.user.user_id;
    await this.usersService.remove(userId);
    return { message: 'Konto zostało pomyślnie usunięte.' };
  }
  
  @Patch('me')
  @UseGuards(AuthGuard('session-token'))
  async updateMe(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.user_id;
    return this.usersService.update(userId, updateUserDto);
  }
  @Patch('me/username')
  @UseGuards(AuthGuard('session-token'))
  async updateUsername(@Request() req, @Body() body: { username: string }) {
    const userId = req.user.user_id;
    return this.usersService.changeUsername(userId, body.username);
  }

  
  // TODO admin
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }


}
