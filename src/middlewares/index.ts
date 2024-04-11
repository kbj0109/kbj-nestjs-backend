import { INestApplication, ValidationPipe } from '@nestjs/common';
import express from 'express';
import { HttpExceptionFilter, badParamRequestExceptionHandler } from '../filters/exception.filter';
import { environment } from '../config/environment';
import { ServerEnvEnum } from '../constant/enum';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { setRequestIp } from './header';

/** 서버에 필요한 미들웨어 설정 */
export const setMiddleware = (app: INestApplication): void => {
  app.enableCors();
  app.use(setRequestIp);
  app.use(express.json({ limit: '20mb' }));
  app.useGlobalPipes(new ValidationPipe({ exceptionFactory: badParamRequestExceptionHandler }));
  app.useGlobalFilters(new HttpExceptionFilter());

  if (environment.IS_LOCAL === false && environment.SERVER_ENV !== ServerEnvEnum.Local) {
    app.useGlobalInterceptors(new TimeoutInterceptor({ seconds: 10 }));
  }

  app.useGlobalInterceptors(new LoggingInterceptor());
};
