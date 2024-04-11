import { DataSource } from 'typeorm';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectDatasource } from '../decorators/dependency.decorator';
import { environment } from '../config/environment';
import { DatabaseEnum } from '../constant/enum';
import { UserService } from '../services/user.service';
import { IUser } from '../models/schema/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async ReadOne(): Promise<IUser> {
    const item = await this.userService.confirmOne();

    return item;
  }
}
