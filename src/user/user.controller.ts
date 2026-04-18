import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {};
  
  @Post('signup')
  async signup(@Body() body: { email: string, password: string }) {
    const { email, password } = body;
    return this.userService.signup(email, password);
  };
};
