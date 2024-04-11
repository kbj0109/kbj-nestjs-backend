import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageService } from '../services/message.service';
import { TransactionWrapper } from '../interceptors/transaction.interceptor';
import { DatabaseEnum } from '../constant/enum.constant';
import { CurrentUser, Transaction } from '../decorators/parameter.decorator';
import { validateParameter, validateStringIsNumeric } from '../utils/dto.util';
import { z } from 'zod';
import { MessageDTO, MessageLevelEnum, MessageStatusEnum } from '../repositories/schema/message.schema';
import { MessageOutput, MessageSendInput, MessageUpdateInput } from './message.controller.dto';
import { UserAuthGuard } from '../guards/user.auth.guard.';
import { UserService } from '../services/user.service';
import { QueryRunner } from 'typeorm';
import { IdInput } from '../constant/dto.constant';

@ApiBearerAuth()
@ApiTags('messages')
@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: '메세지 작성',
    description: '연결되지 않은 사용자와, 이전 메세지보다 높은 레벨의 메세지만 작성 가능',
  })
  @ApiResponse({ status: 201, type: MessageOutput })
  @UserAuthGuard()
  @TransactionWrapper(DatabaseEnum.KBJ)
  @Post('send')
  async sendMessageToUser(
    @Body() body: MessageSendInput,
    @CurrentUser() user: JwtType,
    @Transaction(DatabaseEnum.KBJ) transaction: QueryRunner,
  ): Promise<MessageOutput> {
    validateParameter(body, {
      toUserId: validateStringIsNumeric(),
      messageLevel: z.number().max(MessageLevelEnum.high),
      text: z.string(),
    });

    await this.userService.confirmOne({ id: body.toUserId });

    const item = await this.messageService.sendMessageAfterCheck({ ...body, fromUserId: user.userId }, { transaction });

    return new MessageDTO(item);
  }

  @ApiOperation({ summary: '메세지 승락/거절' })
  @ApiResponse({ status: 200, type: MessageOutput })
  @TransactionWrapper(DatabaseEnum.KBJ)
  @Put(':id/status')
  async updateStatus(
    @Param() param: IdInput,
    @Body() body: MessageUpdateInput,
    @CurrentUser() user: JwtType,
    @Transaction(DatabaseEnum.KBJ) transaction: QueryRunner,
  ): Promise<void> {
    validateParameter(param, { id: validateStringIsNumeric() });
    validateParameter(body, {
      messageStatus: z.enum([MessageStatusEnum.accepted, MessageStatusEnum.rejected]),
      reason: z.string(),
    });

    const { id, fromUserId, toUserId } = await this.messageService.confirmOne({
      id: param.id,
      messageStatus: MessageStatusEnum.activated,
      toUserId: user.userId,
    });

    await this.messageService.updateStatus({ id, fromUserId, toUserId }, body, { transaction });

    return;
  }
}
