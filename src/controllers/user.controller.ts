import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserInput, UsersOutput } from './user.dto';
import { GenderEnum, IUser, UserDTO } from '../repositories/schema/user.schema';
import { validateParameter } from '../utils/dto';
import { z } from 'zod';
import { DATE_REGEX } from '../constant/date';
import { ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { TransactionWrapper } from '../interceptors/transaction.interceptor';
import { DatabaseEnum } from '../constant/enum';
import { Transaction } from '../decorators/parameter.decorator';
import { QueryRunner } from 'typeorm';
import { IdInput, ListInput } from '../constant/dto';
import { NumericString_Regex } from '../constant/regex';

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

  @ApiResponse({ status: 201, type: OmitType(UserDTO, ['password']) })
  @Get(':id')
  async ReadOne(@Param() param: IdInput): Promise<Omit<IUser, 'password'>> {
    validateParameter(param, { id: z.string() });

    const item = await this.userService.confirmOne(param);

    return new UserDTO(item);
  }
}
