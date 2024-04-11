import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not } from 'typeorm';
import { InjectDatasource } from '../decorators/dependency.decorator';
import { BaseRepository } from './index';
import { DatabaseEnum } from '../constant/enum.constant';
import { IMessage, MessageSchema } from './schema/message.schema';

@Injectable()
export class MessageRepository extends BaseRepository<IMessage, MessageSchema> {
  constructor(
    @InjectDatasource(DatabaseEnum.KBJ)
    private readonly dataSource: DataSource,
  ) {
    super(dataSource, MessageSchema);
  }

  /* 삭제된 사용자의 메세지는 Deactivate */
  getMessageListWithUsers = (): Promise<(IMessage & Pick<MessageSchema, 'sentUser' | 'receivedUser'>)[]> => {
    return this.repository.find({
      relations: ['sentUser', 'receivedUser'],
      select: ['id', 'text', 'messageStatus', 'sentUser', 'receivedUser'],
      order: { sentUser: { id: 'DESC' } },
      where: {
        sentUser: { deletedAt: Not(IsNull()) },
        receivedUser: { deletedAt: Not(IsNull()) },
      },
    }) as any;
  };
}
