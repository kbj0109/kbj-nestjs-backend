import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDatasource } from '../decorators/dependency.decorator';
import { BaseRepository } from './index';
import { DatabaseEnum } from '../constant/enum.constant';
import { AuthSchema, IAuth } from './schema/auth.schema';

@Injectable()
export class AuthRepository extends BaseRepository<IAuth, AuthSchema> {
  constructor(
    @InjectDatasource(DatabaseEnum.KBJ)
    private readonly dataSource: DataSource,
  ) {
    super(dataSource, AuthSchema);
  }
}
