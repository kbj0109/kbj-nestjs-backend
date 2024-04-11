import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserInput } from './user.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { IUser } from '../models/schema/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async CreateOne(@Body() body: CreateUserInput): Promise<Omit<IUser, 'password'>> {
    const item = await this.userService.createOne(body as any);

    const { password: _, ...others } = item;

    return others;
  }

  @Get(':id')
  async ReadOne(@Param('id') id: string): Promise<Omit<IUser, 'password'>> {
    const item = await this.userService.confirmOne({ id });

    const { password: _, ...others } = item;

    return others;
  }
}
