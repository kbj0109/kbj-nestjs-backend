import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = new Date();

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest() as Request;
    const response = httpContext.getResponse() as Response;

    // const apiAddress = request.protocol + '://' + request.get('host') + request.originalUrl; // ex) API 주소
    const requestType = context.getType();

    return next.handle().pipe(
      tap(() => {
        const spentTime = new Date().getTime() - startTime.getTime();
        const httpMethod = request.method;

        console.log(
          `[${requestType}]`,
          `${httpMethod}`,
          `${request.originalUrl}`,
          response.statusCode,
          spentTime,
          'ms',
        );
      }),
    );
  }
}
