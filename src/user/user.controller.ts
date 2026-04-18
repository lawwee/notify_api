import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto, UserResponseDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {};
  
  @Post('signup')
  async signup(@Body() body: CreateUserDto): Promise<
    { accessToken: string, user: UserResponseDto }
  > {
    return this.userService.signup(body);
  };

  @Post('login')
  async login(@Body() body: LoginDto): Promise<
    { accessToken: string, user: UserResponseDto }
  > {
    return this.userService.login(body);
  };
};
