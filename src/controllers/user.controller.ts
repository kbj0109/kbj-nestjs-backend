import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserCreateInput, UserOutput, UserUpdateInput, UserListOutput } from './user.controller.dto';
import { GenderEnum, IUser, UserDTO } from '../repositories/schema/user.schema';
import { validateParameter, validateStringIsNumeric, validateValueToInt } from '../utils/dto.util';
import { z } from 'zod';
import { DATE_REGEX } from '../constant/date.constant';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionWrapper } from '../interceptors/transaction.interceptor';
import { DatabaseEnum } from '../constant/enum.constant';
import { LoginUser, Transaction } from '../decorators/parameter.decorator';
import { QueryRunner } from 'typeorm';
import { IdInput, ListInput } from '../constant/dto.constant';
import { UserAuthGuard } from '../guards/user.auth.guard.';

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
    delete (item as any).password;

    return new UserDTO(item);
  }

  @ApiResponse({ status: 200, type: UserListOutput })
  @Get()
  async ReadMany(@Query() query: ListInput): Promise<{ totalCount: number; list: Omit<IUser, 'password'>[] }> {
    const { skip, take } = validateParameter(query, {
      skip: validateValueToInt({ defaultValue: 0, optional: true }),
      take: validateValueToInt({ defaultValue: 10, max: 100, optional: true }),
    });

    const result = await this.userService.readManyAndTotalCount({}, { skip, take });

    return { ...result, list: result.list.map((item) => new UserDTO(item)) };
  }

  @ApiResponse({ status: 200, type: UserOutput })
  @ApiBearerAuth()
  @UserAuthGuard()
  @Get(':id')
  async ReadOne(@Param() param: IdInput): Promise<Omit<IUser, 'password'>> {
    validateParameter(param, { id: validateStringIsNumeric() });

    const item = await this.userService.confirmOne(param);
    delete (item as any).password;

    return new UserDTO(item);
  }

  @ApiResponse({ status: 200, type: UserOutput })
  @ApiBearerAuth()
  @UserAuthGuard()
  @TransactionWrapper(DatabaseEnum.KBJ)
  @Put(':id')
  async UpdateOne(
    @Param() param: IdInput,
    @Body() body: UserUpdateInput,
    @LoginUser() loginUser: LoginUserType,
    @Transaction(DatabaseEnum.KBJ) transaction: QueryRunner,
  ): Promise<Omit<IUser, 'password'>> {
    validateParameter(param, { id: z.literal(loginUser!.userId) });

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
    delete (newItem as any).password;

    return new UserDTO(newItem);
  }
}
