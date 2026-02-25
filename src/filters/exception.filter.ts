import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import chalk from 'chalk';
import { Request, Response } from 'express';
import { environment } from '../config/environment.config';
import { ServerEnvEnum } from '../constant/enum.constant';
import { BadParameterException, ExpiredTokenException, possibleExceptionList } from '../constant/exception.constant';
import { IExceptionResponseOutput } from '../constant/exception.dto.constant';

const defaultException = new InternalServerErrorException();
const notFoundException = new NotFoundException();

/** REST API 요청 Exception Handler */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log();

    /** 존재하지 않는 API 에 대한 404 Exception 처리 */
    if ((exception.message || '').startsWith('Cannot') && exception.status === 404) {
      console.log(exception.name, exception.message); // # 존재하지 않는 API 에 대한 404 Exception 로그
    } else if (exception instanceof ExpiredTokenException) {
      console.log(request.path, exception.message);
    } else {
      console.log(chalk.red(`============== ${request.method} ${request.path} ==============`));
      console.log(exception); // 일반 로그
    }

    console.log();

    /** 유효성 검사 - BadParameterException 처리 */
    if (exception instanceof BadParameterException) {
      response.status(exception.getStatus()).json({
        httpMethod: request.method,
        path: request.url,
        code: exception.name,
        status: exception.getStatus(),
        message: exception.message,
        data: (exception.getResponse() as { data: object }).data || {},
        // stack: environment.SERVER_ENV !== ServerEnvEnum.Production ? exception.stack : undefined,
      });

      return;
    }

    /** 접근 하려는 파일이 없을 때 */
    if (exception.code === 'ENOENT' && exception.status === 404) {
      response.status(notFoundException.getStatus()).json({
        httpMethod: request.method,
        path: request.url,
        code: exception.code,
        status: notFoundException.getStatus(),
        message: (exception.message || 'Not Found').split(',')[0],
        stack: environment.SERVER_ENV !== ServerEnvEnum.Production ? exception.stack : undefined,
      });

      return;
    }

    /** Http Exception 이 아닌 에러 처리 */
    if (exception instanceof HttpException === false) {
      // 에러 데이터 정형화
      const exceptionResponse: IExceptionResponseOutput = {
        httpMethod: request.method,
        path: request.url,
        code: defaultException.name,
        status: defaultException.getStatus(),
        message: exception.message || defaultException.message,
        stack: environment.SERVER_ENV !== ServerEnvEnum.Production ? exception.stack : undefined,
      };

      response.status(defaultException.getStatus()).json(exceptionResponse);

      return;
    }

    const httpException = possibleExceptionList.find((one) => one.name === exception.name) || defaultException;

    // 에러 데이터 정형화
    const exceptionResponse: IExceptionResponseOutput = {
      httpMethod: request.method,
      path: request.url,
      code: httpException.name,
      status: httpException.getStatus(),
      message: exception.message || httpException.message,
      data: (exception.getResponse() as { data: object }).data || {},
      stack: environment.SERVER_ENV !== ServerEnvEnum.Production ? httpException.stack : undefined,
    };

    response.status(httpException.getStatus()).json(exceptionResponse);
  }
}
