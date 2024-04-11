import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap } from 'rxjs';
import chalk from 'chalk';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = new Date();

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest() as Request;

    // const apiAddress = request.protocol + '://' + request.get('host') + request.originalUrl; // ex) API 주소
    const requestType = context.getType();
    const httpMethod = request.method;

    return next.handle().pipe(
      tap(() => {
        const spentTime = new Date().getTime() - startTime.getTime();

        const response = httpContext.getResponse() as Response;

        let statusCode = response.statusCode.toString();
        if (statusCode.startsWith('2')) {
          statusCode = chalk.green(statusCode);
        }
        if (statusCode.startsWith('4')) {
          statusCode = chalk.yellow(statusCode);
        }
        if (statusCode.startsWith('5')) {
          statusCode = chalk.red(statusCode);
        }

        console.log(`[${requestType}]`, `${statusCode}`, `${httpMethod}`, `${request.originalUrl}`, spentTime, 'ms');
      }),

      catchError((err: any) => {
        const spentTime = new Date().getTime() - startTime.getTime();

        let statusCode = (err.status || 500).toString();
        if (statusCode.startsWith('2')) {
          statusCode = chalk.green(statusCode);
        }
        if (statusCode.startsWith('4')) {
          statusCode = chalk.yellow(statusCode);
        }
        if (statusCode.startsWith('5')) {
          statusCode = chalk.red(statusCode);
        }

        console.log(`[${requestType}]`, `${statusCode}`, `${httpMethod}`, `${request.originalUrl}`, spentTime, 'ms');

        throw err;
      }),
    );
  }
}
