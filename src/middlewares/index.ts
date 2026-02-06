import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { environment } from '../config/environment.config';
import { ServerEnvEnum } from '../constant/enum.constant';
import { AllExceptionFilter } from '../filters/exception.filter';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';
import { setRequestIp } from './header.middleware';
import { setApiDocument } from './swagger.middleware';

/** 서버에 필요한 미들웨어 설정 */
export const setMiddleware = (app: INestApplication): void => {
  if (environment.SERVER_ENV !== ServerEnvEnum.Production) {
    app.enableCors({ origin: true, credentials: true });
  }

  app.use(setRequestIp);
  app.use(express.json({ limit: '20mb' }));
  app.use(cookieParser());
  app.use(helmet());

  app.useGlobalFilters(new AllExceptionFilter());

  if (environment.IS_LOCAL === false && environment.SERVER_ENV !== ServerEnvEnum.Local) {
    app.useGlobalInterceptors(new TimeoutInterceptor({ seconds: 10 }));
  }

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // DTO 처리

  app.enableShutdownHooks();

  setApiDocument(app);
};
