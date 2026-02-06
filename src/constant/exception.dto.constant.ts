import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  BadParameterException,
  ExpiredTokenException,
  InvalidTokenException,
  possibleExceptionList as exceptionList,
} from './exception.constant';

const badRequestException: BadRequestException = exceptionList.find((one) => one instanceof BadRequestException)!;
const notFoundException: NotFoundException = exceptionList.find((one) => one instanceof NotFoundException)!;
const conflictException: ConflictException = exceptionList.find((one) => one instanceof ConflictException)!;
const unauthorizedException: UnauthorizedException = exceptionList.find((one) => one instanceof UnauthorizedException)!;
const forbiddenException: ForbiddenException = exceptionList.find((one) => one instanceof ForbiddenException)!;
const invalidTokenException: InvalidTokenException = exceptionList.find((one) => one instanceof InvalidTokenException)!;
const expiredTokenException: ExpiredTokenException = exceptionList.find((one) => one instanceof ExpiredTokenException)!;
const badParameterException: BadParameterException = exceptionList.find((one) => one instanceof BadParameterException)!;

const internalServerErrorException: InternalServerErrorException = new InternalServerErrorException();

// @ ExceptionResponseDTO 선언 확인
{
  const checkList = [
    badRequestException,
    notFoundException,
    conflictException,
    unauthorizedException,
    forbiddenException,
    invalidTokenException,
    expiredTokenException,
    badParameterException,
  ];
  if (checkList.some((one) => !one) || checkList.length !== exceptionList.length) {
    throw new Error('Exception not found');
  }
}

/* Exception Response Output Interface */
export interface IExceptionResponseOutput {
  httpMethod: string;
  path: string;
  code: string;
  status: number;
  message: string;
  data?: Record<string, any>;
  stack?: string;
}

export class BadRequestExceptionDTO implements IExceptionResponseOutput {
  static status = badRequestException.getStatus();

  @ApiProperty({ type: String, description: 'HttpMethod', default: 'GET' })
  httpMethod: string;

  @ApiProperty({ type: String, description: 'Api Path', default: '/health' })
  path: string;

  @ApiProperty({ type: String, readOnly: true, enum: [badRequestException.name] })
  code: string;

  @ApiProperty({ type: Number, readOnly: true, enum: [badRequestException.getStatus()] })
  status: number;

  @ApiProperty({ type: String, description: 'Exception Message', default: badRequestException.message })
  message: string;

  @ApiProperty({
    type: Object,
    description: 'Additional Data',
    nullable: true,
    required: false,
    additionalProperties: true,
    default: { sample1: 'Sample Error Data 1', sample2: 'Sample Error Data 2' },
  })
  data?: Record<string, any>;

  @ApiProperty({ type: String, description: 'Error Stack (Not in Production)', nullable: true, required: false })
  stack?: string;
}

export class NotFoundExceptionDTO implements IExceptionResponseOutput {
  static status = notFoundException.getStatus();

  @ApiProperty({ type: String, description: 'HttpMethod', default: 'GET' })
  httpMethod: string;

  @ApiProperty({ type: String, description: 'Api Path', default: '/health' })
  path: string;

  @ApiProperty({ type: String, readOnly: true, enum: [notFoundException.name] })
  code: string;

  @ApiProperty({ type: Number, readOnly: true, enum: [notFoundException.getStatus()] })
  status: number;

  @ApiProperty({ type: String, description: 'Exception Message', default: notFoundException.message })
  message: string;

  @ApiProperty({
    type: Object,
    description: 'Additional Data',
    nullable: true,
    required: false,
    additionalProperties: true,
  })
  data?: Record<string, any>;

  @ApiProperty({ type: String, description: 'Error Stack (Not in Production)', nullable: true, required: false })
  stack?: string;
}

export class ConflictExceptionDTO implements IExceptionResponseOutput {
  static status = conflictException.getStatus();

  @ApiProperty({ type: String, description: 'HttpMethod', default: 'GET' })
  httpMethod: string;

  @ApiProperty({ type: String, description: 'Api Path', default: '/health' })
  path: string;

  @ApiProperty({ type: String, readOnly: true, enum: [conflictException.name] })
  code: string;

  @ApiProperty({ type: Number, readOnly: true, enum: [conflictException.getStatus()] })
  status: number;

  @ApiProperty({ type: String, description: 'Exception Message', default: conflictException.message })
  message: string;

  @ApiProperty({
    type: Object,
    description: 'Additional Data',
    nullable: true,
    required: false,
    additionalProperties: true,
  })
  data?: Record<string, any>;

  @ApiProperty({ type: String, description: 'Error Stack (Not in Production)', nullable: true, required: false })
  stack?: string;
}

export class UnauthorizedExceptionDTO implements IExceptionResponseOutput {
  static status = unauthorizedException.getStatus();

  @ApiProperty({ type: String, description: 'HttpMethod', default: 'GET' })
  httpMethod: string;

  @ApiProperty({ type: String, description: 'Api Path', default: '/health' })
  path: string;

  @ApiProperty({ type: String, readOnly: true, enum: [unauthorizedException.name] })
  code: string;

  @ApiProperty({ type: Number, readOnly: true, enum: [unauthorizedException.getStatus()] })
  status: number;

  @ApiProperty({ type: String, description: 'Exception Message', default: unauthorizedException.message })
  message: string;

  @ApiProperty({
    type: Object,
    description: 'Additional Data',
    nullable: true,
    required: false,
    additionalProperties: true,
  })
  data?: Record<string, any>;

  @ApiProperty({ type: String, description: 'Error Stack (Not in Production)', nullable: true, required: false })
  stack?: string;
}

export class ForbiddenExceptionDTO implements IExceptionResponseOutput {
  static status = forbiddenException.getStatus();

  @ApiProperty({ type: String, description: 'HttpMethod', default: 'GET' })
  httpMethod: string;

  @ApiProperty({ type: String, description: 'Api Path', default: '/health' })
  path: string;

  @ApiProperty({ type: String, readOnly: true, enum: [forbiddenException.name] })
  code: string;

  @ApiProperty({ type: Number, readOnly: true, enum: [forbiddenException.getStatus()] })
  status: number;

  @ApiProperty({ type: String, description: 'Exception Message', default: forbiddenException.message })
  message: string;

  @ApiProperty({
    type: Object,
    description: 'Additional Data',
    nullable: true,
    required: false,
    additionalProperties: true,
  })
  data?: Record<string, any>;

  @ApiProperty({ type: String, description: 'Error Stack (Not in Production)', nullable: true, required: false })
  stack?: string;
}

export class InvalidTokenExceptionDTO implements IExceptionResponseOutput {
  static status = invalidTokenException.getStatus();

  @ApiProperty({ type: String, description: 'HttpMethod', default: 'GET' })
  httpMethod: string;

  @ApiProperty({ type: String, description: 'Api Path', default: '/health' })
  path: string;

  @ApiProperty({ type: String, readOnly: true, enum: [invalidTokenException.name] })
  code: string;

  @ApiProperty({ type: Number, readOnly: true, enum: [invalidTokenException.getStatus()] })
  status: number;

  @ApiProperty({ type: String, description: 'Exception Message', default: invalidTokenException.message })
  message: string;

  @ApiProperty({
    type: Object,
    description: 'Additional Data',
    nullable: true,
    required: false,
    additionalProperties: true,
  })
  data?: Record<string, any>;

  @ApiProperty({ type: String, description: 'Error Stack (Not in Production)', nullable: true, required: false })
  stack?: string;
}

export class ExpiredTokenExceptionDTO implements IExceptionResponseOutput {
  static status = expiredTokenException.getStatus();

  @ApiProperty({ type: String, description: 'HttpMethod', default: 'GET' })
  httpMethod: string;

  @ApiProperty({ type: String, description: 'Api Path', default: '/health' })
  path: string;

  @ApiProperty({ type: String, readOnly: true, enum: [expiredTokenException.name] })
  code: string;

  @ApiProperty({ type: Number, readOnly: true, enum: [expiredTokenException.getStatus()] })
  status: number;

  @ApiProperty({ type: String, description: 'Exception Message', default: expiredTokenException.message })
  message: string;

  @ApiProperty({
    type: Object,
    description: 'Additional Data',
    nullable: true,
    required: false,
    additionalProperties: true,
  })
  data?: Record<string, any>;

  @ApiProperty({ type: String, description: 'Error Stack (Not in Production)', nullable: true, required: false })
  stack?: string;
}

class BadParameterExceptionData {
  @ApiProperty({ type: [String], description: 'Bad Parameter List', default: ['id'] })
  badParamList: string[];

  @ApiProperty({ type: [String], default: ['id는 숫자여야 합니다'], nullable: true, required: false })
  hint?: string[];
}

export class BadParameterExceptionDTO implements IExceptionResponseOutput {
  static status = badParameterException.getStatus();

  @ApiProperty({ type: String, description: 'HttpMethod', default: 'GET' })
  httpMethod: string;

  @ApiProperty({ type: String, description: 'Api Path', default: '/health' })
  path: string;

  @ApiProperty({ type: String, readOnly: true, enum: [badParameterException.name] })
  code: string;

  @ApiProperty({ type: Number, readOnly: true, enum: [badParameterException.getStatus()] })
  status: number;

  @ApiProperty({ type: String, description: 'Exception Message', default: badParameterException.message })
  message: string;

  @ApiProperty({ type: BadParameterExceptionData })
  data: Record<string, any>;

  @ApiProperty({ type: String, description: 'Error Stack (Not in Production)', nullable: true, required: false })
  stack?: string;
}

export class InternalServerErrorExceptionDTO implements IExceptionResponseOutput {
  static status = internalServerErrorException.getStatus();

  @ApiProperty({ type: String, description: 'HttpMethod', default: 'GET' })
  httpMethod: string;

  @ApiProperty({ type: String, description: 'Api Path', default: '/health' })
  path: string;

  @ApiProperty({ type: String, readOnly: true, enum: [internalServerErrorException.name] })
  code: string;

  @ApiProperty({ type: Number, readOnly: true, enum: [internalServerErrorException.getStatus()] })
  status: number;

  @ApiProperty({ type: String, description: 'Exception Message', default: internalServerErrorException.message })
  message: string;

  @ApiProperty({
    type: Object,
    description: 'Additional Data',
    nullable: true,
    required: false,
    additionalProperties: true,
  })
  data?: Record<string, any>;

  @ApiProperty({ type: String, description: 'Error Stack (Not in Production)', nullable: true, required: false })
  stack?: string;
}
