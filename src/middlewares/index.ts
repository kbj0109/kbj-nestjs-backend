import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import express from 'express';
import { AllExceptionFilter } from '../filters/exception.filter';
import { environment } from '../config/environment.config';
import { ServerEnvEnum } from '../constant/enum.constant';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { setRequestIp } from './header.middleware';
import { setApiDocument } from './swagger.middleware';
import _ from 'lodash';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

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
