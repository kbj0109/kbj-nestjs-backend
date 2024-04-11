import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserInput, UserOutput } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async CreateOne(@Body() body: CreateUserInput): Promise<UserOutput> {
    const item = await this.userService.createOne(body);

    return item;
  }

  @Get(':id')
  async ReadOne(@Param('id') id: string): Promise<UserOutput> {
    const item = await this.userService.confirmOne({ id });

    return item;
  }
}
