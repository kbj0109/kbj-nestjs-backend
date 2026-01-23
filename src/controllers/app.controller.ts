import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { possibleExceptionList } from '../constant/exception.constant';
import {
  BadParameterExceptionDTO,
  BadRequestExceptionDTO,
  ConflictExceptionDTO,
  ExpiredTokenExceptionDTO,
  ForbiddenExceptionDTO,
  InternalServerErrorExceptionDTO,
  InvalidTokenExceptionDTO,
  NotFoundExceptionDTO,
  UnauthorizedExceptionDTO,
} from '../constant/exception.dto.constant';

@ApiTags('/app - 기본')
@Controller('/')
@ApiExtraModels(
  BadRequestExceptionDTO,
  BadParameterExceptionDTO,
  UnauthorizedExceptionDTO,
  InvalidTokenExceptionDTO,
  ExpiredTokenExceptionDTO,
  ForbiddenExceptionDTO,
  NotFoundExceptionDTO,
  ConflictExceptionDTO,
  InternalServerErrorExceptionDTO,
)
export class AppController implements OnModuleInit {
  InitializedTime: Date;

  onModuleInit(): void {
    this.InitializedTime = new Date();
  }

  @ApiOperation({ summary: 'App 헬스 체크' })
  @Get('/health')
  healthCheck(): string {
    const formatted = dayjs(this.InitializedTime || new Date()).format('YYYY-MM-DD HH:mm:ss');

    return `OK - (${formatted}) - Server Started`;
  }

  @ApiOperation({ summary: '샘플 Exception 발생 (랜덤)' })
  @ApiResponse({
    status: 400,
    description: 'BadRequestException / BadParameterException',
    content: {
      'application/json': {
        schema: {
          oneOf: [{ $ref: getSchemaPath(BadRequestExceptionDTO) }, { $ref: getSchemaPath(BadParameterExceptionDTO) }],
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'UnauthorizedException / InvalidTokenException / ExpiredTokenException',
    content: {
      'application/json': {
        schema: {
          oneOf: [
            { $ref: getSchemaPath(UnauthorizedExceptionDTO) },
            { $ref: getSchemaPath(InvalidTokenExceptionDTO) },
            { $ref: getSchemaPath(ExpiredTokenExceptionDTO) },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: ForbiddenExceptionDTO.status, type: ForbiddenExceptionDTO })
  @ApiResponse({ status: NotFoundExceptionDTO.status, type: NotFoundExceptionDTO })
  @ApiResponse({ status: ConflictExceptionDTO.status, type: ConflictExceptionDTO })
  @ApiResponse({ status: InternalServerErrorExceptionDTO.status, type: InternalServerErrorExceptionDTO })
  @Get('/exceptions')
  getSampleException(): never {
    const exception = possibleExceptionList[Math.floor(Math.random() * possibleExceptionList.length)];

    throw exception;
  }
}
