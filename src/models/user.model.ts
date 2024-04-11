import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDatasource } from '../decorators/dependency.decorator';
import { BaseRepository } from './index';
import { DatabaseEnum } from '../constant/enum';
import { IUser, UserSchema } from './schema/user.schema';

@Injectable()
export class UserModel extends BaseRepository<IUser, UserSchema> {
  constructor(
    @InjectDatasource(DatabaseEnum.KBJ)
    private readonly dataSource: DataSource,
  ) {
    super(dataSource, UserSchema);
  }
}
