import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserCreateInput, UserOutput, UserUpdateInput, UsersOutput } from './user.dto';
import { GenderEnum, IUser, UserDTO } from '../repositories/schema/user.schema';
import { validateParameter } from '../utils/dto.util';
import { z } from 'zod';
import { DATE_REGEX } from '../constant/date.constant';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionWrapper } from '../interceptors/transaction.interceptor';
import { DatabaseEnum } from '../constant/enum.constant';
import { CurrentUser, Transaction } from '../decorators/parameter.decorator';
import { QueryRunner } from 'typeorm';
import { IdInput, ListInput } from '../constant/dto.constant';
import { NumericString_Regex } from '../constant/regex.constant';
import { MainAuthGuard } from '../guards/sign-in.guard.';
import { Request } from 'express';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 201, type: UserOutput })
  @TransactionWrapper(DatabaseEnum.KBJ)
  @Post()
  async CreateOne(
    @Body() body: UserCreateInput,
    @Transaction(DatabaseEnum.KBJ) transaction: QueryRunner,
  ): Promise<UserOutput> {
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

  @ApiResponse({ status: 200, type: UsersOutput })
  @Get()
  async ReadMany(@Query() query: ListInput): Promise<{ totalCount: number; list: Omit<IUser, 'password'>[] }> {
    const { skip, take } = validateParameter(query, {
      skip: z.string().regex(NumericString_Regex).transform(Number).optional(),
      take: z.string().regex(NumericString_Regex).transform(Number).optional(),
    });

    const { totalCount, list } = await this.userService.readManyAndTotalCount(
      {},
      { skip: skip as number, take: take as number },
    );

    return { totalCount, list: list.map((item) => new UserDTO(item)) };
  }

  @ApiResponse({ status: 200, type: UserOutput })
  @Get(':id')
  async ReadOne(@Param() param: IdInput): Promise<Omit<IUser, 'password'>> {
    validateParameter(param, { id: z.string() });

    const item = await this.userService.confirmOne(param);

    return new UserDTO(item);
  }

  @ApiResponse({ status: 200, type: UserOutput })
  @ApiBearerAuth()
  @MainAuthGuard()
  @TransactionWrapper(DatabaseEnum.KBJ)
  @Put(':id')
  async UpdateOne(
    @Param() param: IdInput,
    @Body() body: UserUpdateInput,
    @CurrentUser() user: Request['user'],
    @Transaction(DatabaseEnum.KBJ) transaction: QueryRunner,
  ): Promise<Omit<IUser, 'password'>> {
    validateParameter(param, { id: z.literal(user!.userId) });

    validateParameter(body, {
      password: z.string().optional(),
      name: z.string().optional(),
      birth: z.string().regex(DATE_REGEX).optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      gender: z.enum([GenderEnum.Male, GenderEnum.Female]).optional(),
    });

    const item = await this.userService.confirmOne({ id: param.id });

    const newItem = await this.userService.updateUser(item.id, body, { transaction });

    return new UserDTO(newItem);
  }
}
