import { MessageDTO } from '../repositories/schema/message.schema';
import { PickDataType } from '../utils/dto.util';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

export class MessageSendInput extends PickDataType(MessageDTO, ['toUserId', 'messageLevel', 'text']) {}

export class MessageOutput extends IntersectionType(MessageDTO, PartialType(PickType(MessageDTO, ['reason']))) {}

export class MessageUpdateInput extends PickDataType(MessageDTO, ['messageStatus', 'reason']) {}
