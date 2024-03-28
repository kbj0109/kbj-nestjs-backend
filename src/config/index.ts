import { INestApplication, Type, ValidationPipe } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { HttpExceptionFilter, badParamRequestExceptionHandler } from '../filters/exception.filter';

export const getControllerList = (): Type[] => {
  return [UserController];
};

export const getServiceList = (): Type[] => {
  return [UserService];
};

export const getModelList = (): Type[] => {
  return [UserModel];
};

/** 서버에 필요한 미들웨어 설정 */
export const setMiddleware = (app: INestApplication): void => {
  app.useGlobalPipes(new ValidationPipe({ exceptionFactory: badParamRequestExceptionHandler }));
  app.useGlobalFilters(new HttpExceptionFilter());
};
