import * as dotenv from 'dotenv';
dotenv.config();

import { NodeEnvEnum, ServerEnvEnum } from '../constant/enum';

export const environment = {
  IS_TEST: false,
  IS_LOCAL: false,

  NODE_ENV: NodeEnvEnum.Development, // test | development | production
  SERVER_ENV: 'local' as ServerEnvEnum, // local | staging | production
  SERVER_PORT: 3001, // 실행되는 서버의 Port

  AWS_ACCESS_KEY: '',
  AWS_SECRET_KEY: '',
};

export const setEnvironment = (): typeof environment => {
  environment.IS_TEST = process.env.NODE_ENV === NodeEnvEnum.Test;
  environment.IS_LOCAL = process.env.NODE_ENV === NodeEnvEnum.Development;

  environment.NODE_ENV = (process.env.NODE_ENV || NodeEnvEnum.Development) as NodeEnvEnum;
  environment.SERVER_ENV = (process.env.SERVER_ENV || ServerEnvEnum.Local) as ServerEnvEnum;
  environment.SERVER_PORT = Number(process.env.SERVER_PORT);

  environment.AWS_ACCESS_KEY = process.env.AWS_DEV_ACCESS_KEY!;
  environment.AWS_SECRET_KEY = process.env.AWS_DEV_SECRET_KEY!;

  console.log('environment:', environment.NODE_ENV);

  return environment;
};
