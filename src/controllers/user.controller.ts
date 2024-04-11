import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserInput } from './user.dto';
import { GenderEnum, IUser, UserDTO } from '../models/schema/user.schema';
import { validateParameter } from '../utils/dto';
import { z } from 'zod';
import { DATE_REGEX } from '../constant/date';
import { ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { TransactionWrapper } from '../interceptors/transaction.interceptor';
import { DatabaseEnum } from '../constant/enum';
import { Transaction } from '../decorators/parameter.decorator';
import { QueryRunner } from 'typeorm';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 201, type: OmitType(UserDTO, ['password']) })
  @TransactionWrapper(DatabaseEnum.KBJ)
  @Post()
  async CreateOne(
    @Body() body: CreateUserInput,
    @Transaction(DatabaseEnum.KBJ) transaction: QueryRunner,
  ): Promise<Omit<IUser, 'password'>> {
    validateParameter(body, {
      username: z.string(),
      password: z.string(),
      name: z.string(),
      birth: z.string().regex(DATE_REGEX).optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      gender: z.enum([GenderEnum.Male, GenderEnum.Female]).optional(),
    });

    const item = await this.userService.createOne(body, { transaction });

    return new UserDTO(item);
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
