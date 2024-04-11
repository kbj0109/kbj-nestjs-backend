import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { environment } from '../config/environment.config';
import { BadParameterException, possibleExceptionList } from '../constant/exception.constant';
import { Request, Response } from 'express';
import { ServerEnvEnum } from '../constant/enum.constant';
import { ZodError } from 'zod';
import _ from 'lodash';

const defaultException = new InternalServerErrorException();

/** REST API 요청 Exception Handler */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const isNotFoundApiException = exception.message.startsWith('Cannot') && exception.status === 404;

    if (isNotFoundApiException) {
      console.log(exception.name, exception.message); // # 존재하지 않는 API 에 대한 404 Exception 로그
    } else {
      console.log(exception); // 일반 로그
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    /** 유효성 검사 - Zod Validation Exception 처리 */
    if (exception instanceof ZodError) {
      const errors = exception.errors;

      const badParamList = _.flatten(exception.errors.map((one) => one.path)) as string[];
      const hint = errors.map((one) => `${one.path[0]} - ${one.message}`);

      const badParameterException = new BadParameterException({ data: { badParamList, hint } });

      response.status(badParameterException.getStatus()).json({
        httpMethod: request.method,
        path: request.url,
        code: badParameterException.name,
        status: badParameterException.getStatus(),
        message: badParameterException.message,
        data: (badParameterException.getResponse() as { data: object }).data || {},
        // stack: environment.SERVER_ENV !== ServerEnvEnum.Production ? exception.stack : undefined,
      });

      return;
    }

    /** Http Exception 이 아닌 에러 처리 */
    if (exception instanceof HttpException === false) {
      response.status(defaultException.getStatus()).json({
        httpMethod: request.method,
        path: request.url,
        code: defaultException.name,
        status: defaultException.getStatus(),
        message: exception.message || defaultException.message,
        stack: environment.SERVER_ENV !== ServerEnvEnum.Production ? exception.stack : undefined,
      });

      return;
    }

    const httpException = possibleExceptionList.find((one) => one.name === exception.name) || defaultException;

    response.status(httpException.getStatus()).json({
      httpMethod: request.method,
      path: request.url,
      code: httpException.name,
      status: httpException.getStatus(),
      message: exception.message || httpException.message,
      data: (exception.getResponse() as { data: object }).data || {},
      stack: environment.SERVER_ENV !== ServerEnvEnum.Production ? httpException.stack : undefined,
    });
  }
}
