import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserInput } from './user.dto';
import { GenderEnum, IUser } from '../models/schema/user.schema';
import { validateParameter } from '../utils/dto';
import { z } from 'zod';
import { DATE_REGEX } from '../constant/date';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async CreateOne(@Body() body: CreateUserInput): Promise<Omit<IUser, 'password'>> {
    validateParameter(body, {
      username: z.string(),
      password: z.string(),
      name: z.string(),
      birth: z.string().regex(DATE_REGEX).optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      gender: z.enum([GenderEnum.Male, GenderEnum.Female]).optional(),
    });

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

  @Get()
  ReadMany(): any[] {
    return [];
  }
}
