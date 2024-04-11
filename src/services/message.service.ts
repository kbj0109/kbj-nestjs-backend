import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { MessageRepository } from '../repositories/Message.repository';
import { IMessage, MessageStatusEnum } from '../repositories/schema/message.schema';
import { QueryTransactionOption } from '../types';

@Injectable()
export class MessageService extends BaseService {
  constructor(private readonly messageRepository: MessageRepository) {
    super();
  }

  createOne = this.messageRepository.createOne;
  confirmOne = this.messageRepository.confirmOne;
  update = this.messageRepository.update;

  checkMessageIsPossibleToSend = async (
    condition: Pick<IMessage, 'messageLevel' | 'toUserId' | 'fromUserId'>,
  ): Promise<boolean> => {
    const { toUserId, fromUserId, messageLevel } = condition;

    // @ 이미 연결된 사람은 불가능 하게 추후 설정

    const item = await this.messageRepository.readOne(
      { toUserId, fromUserId, messageStatus: MessageStatusEnum.accepted },
      { order: { id: 'DESC' } },
    );

    // 새로운 메세지를 보내려면 더 높은 레벨의 메세지만 가능
    if (!item || item.messageLevel < messageLevel) {
      return true;
    }

    return false;
  };

  sendMessageAfterCheck = async (
    condition: Pick<IMessage, 'toUserId' | 'fromUserId' | 'messageLevel' | 'text'>,
    option: QueryTransactionOption,
  ): Promise<IMessage> => {
    const { toUserId, fromUserId, text, messageLevel } = condition;

    const isPossible = await this.checkMessageIsPossibleToSend({ toUserId, fromUserId, messageLevel });

    if (!isPossible) {
      throw new BadRequestException();
    }

    await this.messageRepository.update(
      { toUserId, fromUserId, messageStatus: MessageStatusEnum.activated },
      { messageStatus: MessageStatusEnum.deactivated },
      option,
    );

    const item = await this.messageRepository.createOne(
      { toUserId, fromUserId, text, messageStatus: MessageStatusEnum.activated, messageLevel },
      option,
    );

    return item;
  };

  updateStatus = async (
    condition: Pick<IMessage, 'id' | 'fromUserId' | 'toUserId'>,
    data: Pick<IMessage, 'messageStatus' | 'reason'>,
    option: QueryTransactionOption,
  ): Promise<void> => {
    const { id, fromUserId, toUserId } = condition;
    const { messageStatus, reason } = data;

    await this.messageRepository.update({ id }, { messageStatus, reason }, option);

    if (messageStatus === MessageStatusEnum.accepted) {
      // @ 연결 매칭 생성하기
    }
  };
}
