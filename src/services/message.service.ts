import { Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { MessageRepository } from '../repositories/Message.repository';

@Injectable()
export class MessageService extends BaseService {
  constructor(private readonly messageRepository: MessageRepository) {
    super();
  }

  confirmOne = this.messageRepository.confirmOne;
}
