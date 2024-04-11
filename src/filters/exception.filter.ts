import { ArgumentsHost, Catch, ExceptionFilter, HttpException, ValidationError } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { environment } from '../config/environment';
import { BadParameterException, possibleExceptionList } from '../constant/exception';
import { Request, Response } from 'express';
import { ServerEnvEnum } from '../constant/enum';

const defaultException = new InternalServerErrorException();

/** 유효성 검사에서 발생하는 Exception Handler */
export const badParamRequestExceptionHandler = (errors: ValidationError[]): BadParameterException => {
  const badParamList = errors.map((one) => one.property);

  /** 운영 환경 아니면 실패 이유 알려주기 */
  const hint =
    environment.SERVER_ENV !== ServerEnvEnum.Production
      ? errors.map((one) => one.constraints).flatMap((obj) => Object.values(obj || {}))
      : undefined;

  return new BadParameterException({ data: { badParamList, hint } });
};

/** REST API 요청 Exception Handler */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
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

    const httpException =
      possibleExceptionList.find((one) => one.getStatus() === exception.getStatus()) || defaultException;

    response.status(httpException.getStatus()).json({
      httpMethod: request.method,
      path: request.url,
      code: httpException.name,
      status: httpException.getStatus(),
      message: exception.message || httpException.message,
      stack: environment.SERVER_ENV !== ServerEnvEnum.Production ? httpException.stack : undefined,
    });
  }
}
