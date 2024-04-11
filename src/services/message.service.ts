import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { MessageRepository } from '../repositories/Message.repository';
import { IMessage, MessageStatusEnum } from '../repositories/schema/message.schema';
import { QueryTransactionOption } from '../types';
import { MatchingRepository } from '../repositories/matching.repository';

@Injectable()
export class MessageService extends BaseService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly matchingRepository: MatchingRepository,
  ) {
    super();
  }

  createOne = this.messageRepository.createOne;
  confirmOne = this.messageRepository.confirmOne;
  update = this.messageRepository.update;

  checkIfPossibleToSendMessage = async (
    condition: Pick<IMessage, 'messageLevel' | 'toUserId' | 'fromUserId'>,
  ): Promise<boolean> => {
    const { toUserId, fromUserId, messageLevel } = condition;

    // 이미 매칭된 경우에는 메세지를 보낼 수 없음
    const [matching1, matching2] = await Promise.all([
      this.matchingRepository.readOne({ matchingUserId: toUserId, userId: fromUserId }),
      this.matchingRepository.readOne({ userId: toUserId, matchingUserId: fromUserId }),
    ]);
    if (matching1 || matching2) {
      return false;
    }

    // 새로운 메세지를 보내려면 더 높은 레벨의 메세지만 가능
    const item = await this.messageRepository.readOne(
      { toUserId, fromUserId, messageStatus: MessageStatusEnum.activated },
      { order: { id: 'DESC' } },
    );

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

    const isPossible = await this.checkIfPossibleToSendMessage({ toUserId, fromUserId, messageLevel });

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
      await Promise.all([
        this.matchingRepository.createOne({ messageId: id, userId: fromUserId, matchingUserId: toUserId }, option),
        this.matchingRepository.createOne({ messageId: id, userId: toUserId, matchingUserId: fromUserId }, option),
      ]);
    }
  };
}
