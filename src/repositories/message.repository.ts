import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDatasource } from '../decorators/dependency.decorator';
import { BaseRepository } from './index';
import { DatabaseEnum } from '../constant/enum';
import { IMessage, MessageSchema } from './schema/message.schema';

@Injectable()
export class MessageRepository extends BaseRepository<IMessage, MessageSchema> {
  constructor(
    @InjectDatasource(DatabaseEnum.KBJ)
    private readonly dataSource: DataSource,
  ) {
    super(dataSource, MessageSchema);
  }
}
