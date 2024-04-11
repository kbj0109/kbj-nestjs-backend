import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessageService } from '../services/message.service';

@ApiTags('messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
}
