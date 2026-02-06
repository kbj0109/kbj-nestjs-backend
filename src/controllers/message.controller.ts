import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryRunner } from 'typeorm';
import { z } from 'zod';
import { IdInput, ListInput } from '../constant/dto.constant';
import { DatabaseEnum } from '../constant/enum.constant';
import { LoginUser, Transaction } from '../decorators/parameter.decorator';
import { UserAuthGuard } from '../guards/user.auth.guard.';
import { TransactionWrapper } from '../interceptors/transaction.interceptor';
import { MessageDTO, MessageLevelEnum, MessageStatusEnum } from '../repositories/schema/message.schema';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import { validateParameter, validateStringIsNumeric, validateValueToInt } from '../utils/dto.util';
import { MessageListOutput, MessageOutput, MessageSendInput, MessageUpdateInput } from './message.controller.dto';

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
    @LoginUser() loginUser: LoginUserType,
    @Transaction(DatabaseEnum.KBJ) transaction: QueryRunner,
  ): Promise<MessageOutput> {
    validateParameter(body, {
      toUserId: validateStringIsNumeric(),
      messageLevel: z.number().max(MessageLevelEnum.high),
      text: z.string(),
    });

    await this.userService.confirmOne({ id: body.toUserId });

    const item = await this.messageService.sendMessageAfterCheck(
      { ...body, fromUserId: loginUser.userId },
      { transaction },
    );

    return new MessageDTO(item);
  }

  @ApiOperation({ summary: '메세지 승락/거절' })
  @ApiResponse({ status: 200, type: MessageOutput })
  @UserAuthGuard()
  @TransactionWrapper(DatabaseEnum.KBJ)
  @Put(':id/status')
  async updateStatus(
    @Param() param: IdInput,
    @Body() body: MessageUpdateInput,
    @LoginUser() loginUser: LoginUserType,
    @Transaction(DatabaseEnum.KBJ) transaction: QueryRunner,
  ): Promise<void> {
    validateParameter(param, { id: validateStringIsNumeric() });
    validateParameter(body, {
      messageStatus: z.enum([MessageStatusEnum.accepted, MessageStatusEnum.rejected]),
      reason: z.string().optional(),
    });

    const { id, fromUserId, toUserId } = await this.messageService.confirmOne({
      id: param.id,
      messageStatus: MessageStatusEnum.activated,
      toUserId: loginUser.userId,
    });

    await this.messageService.updateStatus({ id, fromUserId, toUserId }, body, { transaction });

    return;
  }

  @ApiOperation({ summary: '내가 보낸 메세지 목록' })
  @ApiResponse({ status: 200, type: MessageListOutput })
  @UserAuthGuard()
  @Get('sent')
  async readManySentMessages(
    @Query() query: ListInput,
    @LoginUser() loginUser: LoginUserType,
  ): Promise<MessageListOutput> {
    const { skip, take } = validateParameter(query, {
      skip: validateValueToInt({ defaultValue: 0, optional: true }),
      take: validateValueToInt({ defaultValue: 10, max: 100, optional: true }),
    });

    const result = await this.messageService.readManyAndTotalCount({ fromUserId: loginUser.userId }, { skip, take });

    return { ...result, list: result.list.map((item) => new MessageDTO(item)) };
  }

  @ApiOperation({ summary: '내가 받은 메세지 목록' })
  @ApiResponse({ status: 200, type: MessageListOutput })
  @UserAuthGuard()
  @Get('received')
  async readManyReceivedMessages(
    @Query() query: ListInput,
    @LoginUser() loginUser: LoginUserType,
  ): Promise<MessageListOutput> {
    const { skip, take } = validateParameter(query, {
      skip: validateValueToInt({ defaultValue: 0, optional: true }),
      take: validateValueToInt({ defaultValue: 10, max: 100, optional: true }),
    });

    const result = await this.messageService.readManyAndTotalCount({ toUserId: loginUser.userId }, { skip, take });

    return { ...result, list: result.list.map((item) => new MessageDTO(item)) };
  }
}
