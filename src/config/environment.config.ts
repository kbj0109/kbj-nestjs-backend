import * as dotenv from 'dotenv';
import ms from 'ms';
dotenv.config();

import chalk from 'chalk';
import path from 'path';
import { NodeEnvEnum, ServerEnvEnum } from '../constant/enum.constant';

export const environment = {
  IS_TEST: false,
  IS_LOCAL: false,

  NODE_ENV: NodeEnvEnum.Development, // test | development | production
  SERVER_ENV: 'local' as ServerEnvEnum, // local | staging | production

  SERVER_PROTOCOL: 'http',
  SERVER_HOST: '127.0.0.1',
  SERVER_PORT: 3001, // 실행되는 서버의 Port

  MAIN_FOLDER_PATH: '', // # 실제 Root 폴더 Path - ex) /Users/goodoc/goodoc-api-clinic/src

  DB_SYNC_CHECK: false,
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

  REDIS_HOST: '',
  REDIS_PORT: 6379,

  SLACK_OAUTH_TOKEN: '',
  SLACK_NOTIFICATION_CHANNEL: '',

  JWT_SECRET_KEY: '',
  ACCESS_TOKEN_EXPIRES_IN: '30Minutes' as ms.StringValue,
  REFRESH_TOKEN_EXPIRES_IN: '30Days' as ms.StringValue,

  AWS_ACCESS_KEY: '',
  AWS_SECRET_KEY: '',

  ALLOWED_ORIGINS: [] as string[],
};

export const setEnvironment = (definedEnv?: Partial<typeof environment>): typeof environment => {
  environment.IS_TEST = process.env.NODE_ENV === NodeEnvEnum.Test;
  environment.IS_LOCAL = process.env.NODE_ENV === NodeEnvEnum.Development;

  environment.NODE_ENV = (process.env.NODE_ENV || NodeEnvEnum.Development) as NodeEnvEnum;
  environment.SERVER_ENV = (process.env.SERVER_ENV || ServerEnvEnum.Local) as ServerEnvEnum;

  environment.SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || 'http';
  environment.SERVER_HOST = process.env.SERVER_HOST || '127.0.0.1';
  environment.SERVER_PORT = Number(process.env.SERVER_PORT);

  environment.MAIN_FOLDER_PATH = path.join(__dirname, '../../');

  environment.DB_SYNC_CHECK = process.env.DB_SYNC_CHECK === 'true';
  environment.DB_FULL_QUERY_LOG = process.env.DB_FULL_QUERY_LOG === 'true';
  environment.DB_WRITER_HOST = process.env.DB_WRITER_HOST || '';
  environment.DB_WRITER_PORT = Number(process.env.DB_WRITER_PORT);
  environment.DB_WRITER_USERNAME = process.env.DB_WRITER_USERNAME || '';
  environment.DB_WRITER_PASSWORD = process.env.DB_WRITER_PASSWORD || '';
  environment.DB_READER_HOST = process.env.DB_READER_HOST || '';
  environment.DB_READER_PORT = Number(process.env.DB_READER_PORT);
  environment.DB_READER_USERNAME = process.env.DB_READER_USERNAME || '';
  environment.DB_READER_PASSWORD = process.env.DB_READER_PASSWORD || '';
  environment.DB_DATABASE = process.env.DB_DATABASE || '';

  environment.REDIS_HOST = process.env.REDIS_HOST || '';
  environment.REDIS_PORT = Number(process.env.REDIS_PORT) || 0;

  environment.SLACK_OAUTH_TOKEN = process.env.SLACK_OAUTH_TOKEN || '';
  environment.SLACK_NOTIFICATION_CHANNEL = process.env.SLACK_NOTIFICATION_CHANNEL || '';

  environment.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';
  environment.ACCESS_TOKEN_EXPIRES_IN = (process.env.ACCESS_TOKEN_EXPIRES_IN || '30Minutes') as ms.StringValue;
  environment.REFRESH_TOKEN_EXPIRES_IN = (process.env.REFRESH_TOKEN_EXPIRES_IN || '30Days') as ms.StringValue;

  environment.AWS_ACCESS_KEY = process.env.AWS_DEV_ACCESS_KEY || '';
  environment.AWS_SECRET_KEY = process.env.AWS_DEV_SECRET_KEY || '';

  environment.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

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
