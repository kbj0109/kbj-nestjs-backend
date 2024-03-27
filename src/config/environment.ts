import * as dotenv from 'dotenv';
dotenv.config();

import { NodeEnvEnum, ServerEnvEnum } from '../constant/enum';
import path from 'path';
import chalk from 'chalk';

export const environment = {
  IS_TEST: false,
  IS_LOCAL: false,

  NODE_ENV: NodeEnvEnum.Development, // test | development | production
  SERVER_ENV: 'local' as ServerEnvEnum, // local | staging | production
  SERVER_PORT: 3001, // 실행되는 서버의 Port

  MAIN_FOLDER_PATH: '', // # 실제 Root 폴더 Path - ex) /Users/goodoc/goodoc-api-clinic/src

  DB_FULL_QUERY_LOG: false, // DB 쿼리 전체 로그 여부
  DB_WRITER_HOST: '',
  DB_WRITER_PORT: 3306,
  DB_WRITER_USERNAME: '',
  DB_WRITER_PASSWORD: '',
  DB_READER_HOST: '',
  DB_READER_PORT: 3306,
  DB_READER_USERNAME: '',
  DB_READER_PASSWORD: '',
  DB_DATABASE: '',

  AWS_ACCESS_KEY: '',
  AWS_SECRET_KEY: '',
};

export const setEnvironment = (definedEnv?: Partial<typeof environment>): typeof environment => {
  environment.IS_TEST = process.env.NODE_ENV === NodeEnvEnum.Test;
  environment.IS_LOCAL = process.env.NODE_ENV === NodeEnvEnum.Development;

  environment.NODE_ENV = (process.env.NODE_ENV || NodeEnvEnum.Development) as NodeEnvEnum;
  environment.SERVER_ENV = (process.env.SERVER_ENV || ServerEnvEnum.Local) as ServerEnvEnum;
  environment.SERVER_PORT = Number(process.env.SERVER_PORT);

  environment.MAIN_FOLDER_PATH = path.join(__dirname, '../../');

  environment.DB_FULL_QUERY_LOG = process.env.DB_FULL_QUERY_LOG === 'true';
  environment.DB_WRITER_HOST = process.env.DB_WRITER_HOST as string;
  environment.DB_WRITER_PORT = Number(process.env.DB_WRITER_PORT);
  environment.DB_WRITER_USERNAME = process.env.DB_WRITER_USERNAME as string;
  environment.DB_WRITER_PASSWORD = process.env.DB_WRITER_PASSWORD as string;
  environment.DB_READER_HOST = process.env.DB_READER_HOST as string;
  environment.DB_READER_PORT = Number(process.env.DB_READER_PORT);
  environment.DB_READER_USERNAME = process.env.DB_READER_USERNAME as string;
  environment.DB_READER_PASSWORD = process.env.DB_READER_PASSWORD as string;
  environment.DB_DATABASE = process.env.DB_DATABASE as string;

  environment.AWS_ACCESS_KEY = process.env.AWS_DEV_ACCESS_KEY as string;
  environment.AWS_SECRET_KEY = process.env.AWS_DEV_SECRET_KEY as string;

  // @ 일부로 전달된 값은 env 값은 고정
  Object.entries(definedEnv || {}).forEach(([key, value]) => {
    (environment as any)[key] = value;
  });

  Object.entries(environment).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      console.log(`** Environment - ${chalk.yellow(key)} is not set up`);
    }
  });

  return Object.freeze(environment);
};
