import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {};
  
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return this.userService.signup(body);
  };
};
