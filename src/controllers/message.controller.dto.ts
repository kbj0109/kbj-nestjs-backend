import { ListOutput } from '../constant/dto.constant';
import { MessageDTO } from '../repositories/schema/message.schema';
import { PickDataType } from '../utils/dto.util';
import { ApiProperty, IntersectionType, PartialType, PickType } from '@nestjs/swagger';

export class MessageSendInput extends PickDataType(MessageDTO, ['toUserId', 'messageLevel', 'text']) {}

export class MessageOutput extends IntersectionType(
  MessageDTO,
  PartialType(PickType(MessageDTO, ['reason', 'deletedAt'])),
) {}

export class MessageUpdateInput extends IntersectionType(
  PickDataType(MessageDTO, ['messageStatus']),
  PartialType(PickDataType(MessageDTO, ['reason'])),
) {}

export class MessageListOutput extends ListOutput {
  @ApiProperty({ type: [MessageOutput] })
  list: MessageOutput[];
}
