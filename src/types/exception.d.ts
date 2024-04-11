export {};

/** 사용하는 Exception 타입 재정의  */
declare module '@nestjs/common' {
  class BadRequestException extends HttpException {
    name: string;
    message: string;
    stack?: string;
    response: { message: string; data?: { [key: string]: any } };
    getStatus(): number;
    constructor(option?: { message?: string; data?: { [key: string]: any } });
  }

  class NotFoundException extends HttpException {
    name: string;
    message: string;
    stack?: string;
    response: { message: string; data?: { [key: string]: any } };
    getStatus(): number;
    constructor(option?: { message?: string; data?: { [key: string]: any } });
  }

  class ConflictException extends HttpException {
    name: string;
    message: string;
    stack?: string;
    response: { message: string; data?: { [key: string]: any } };
    getStatus(): number;
    constructor(option?: { message?: string; data?: { [key: string]: any } });
  }

  class UnauthorizedException extends HttpException {
    name: string;
    message: string;
    stack?: string;
    response: { message: string; data?: { [key: string]: any } };
    getStatus(): number;
    constructor(option?: { message?: string; data?: { [key: string]: any } });
  }

  class ForbiddenException extends HttpException {
    name: string;
    message: string;
    stack?: string;
    response: { message: string; data?: { [key: string]: any } };
    getStatus(): number;
    constructor(option?: { message?: string; data?: { [key: string]: any } });
  }

  class InternalServerErrorException extends HttpException {
    name: string;
    message: string;
    stack?: string;
    response: { message: string; data?: { [key: string]: any } };
    getStatus(): number;
    constructor(option?: { message?: string; data?: { [key: string]: any } });
  }
}
