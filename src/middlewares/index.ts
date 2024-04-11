import { INestApplication } from '@nestjs/common';
import express from 'express';
import { AllExceptionFilter } from '../filters/exception.filter';
import { environment } from '../config/environment';
import { ServerEnvEnum } from '../constant/enum';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { setRequestIp } from './header';
import { setApiDocument } from './swagger';
import _ from 'lodash';

/** 서버에 필요한 미들웨어 설정 */
export const setMiddleware = (app: INestApplication): void => {
  app.enableCors();
  app.use(setRequestIp);
  app.use(express.json({ limit: '20mb' }));

  app.useGlobalFilters(new AllExceptionFilter());

  if (environment.IS_LOCAL === false && environment.SERVER_ENV !== ServerEnvEnum.Local) {
    app.useGlobalInterceptors(new TimeoutInterceptor({ seconds: 10 }));
  }

  app.useGlobalInterceptors(new LoggingInterceptor());

  setApiDocument(app);
};
