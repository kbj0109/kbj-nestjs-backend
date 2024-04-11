import { UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

/** Bad Parameter Exception */
export class BadParameterException extends HttpException {
  constructor(option: {
    message?: string;
    data: {
      badParamList: string[]; // 잘못된 인자값
      hint?: string[]; // 잘못된 인자값에 대한 힌트
      [key: string]: any;
    };
  }) {
    const { message, data } = option || {};
    super({ message: message || 'Bad Parameter', data }, 400);
  }
}

/** Invalid Token Exception */
export class InvalidTokenException extends HttpException {
  constructor(option?: { message?: string; data?: { [key: string]: any } }) {
    const { message, data } = option || {};
    super({ message: message || 'Invalid Token', data }, 401);
  }
}

/** Expired Token Exception */
export class ExpiredTokenException extends HttpException {
  constructor(option?: { message?: string; data?: { [key: string]: any } }) {
    const { message, data } = option || {};
    super({ message: message || 'Expired Token', data }, 401);
  }
}

/** 서버에서 허용하는 발생 가능한 Exception */
export const possibleExceptionList = [
  new BadRequestException(),
  new NotFoundException(),
  new ConflictException(),
  new UnauthorizedException(),
  new ForbiddenException(),
  new InvalidTokenException(),
  new ExpiredTokenException(),
  new BadParameterException({ data: { badParamList: [] } }),
];
