import { setEnvironment } from '../src/config/environment.config';
setEnvironment({ NODE_ENV: NodeEnvEnum.Test });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { DatabaseEnum, NodeEnvEnum, RedisEnum } from '../src/constant/enum.constant';
import { RedisHelper } from '../src/config/redis.config';

let app: INestApplication;
let dataSource: DataSource;
let redisHelper: RedisHelper;

describe('AppController', () => {
  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = appModule.createNestApplication();
    dataSource = appModule.get(DatabaseEnum.KBJ);
    redisHelper = appModule.get(RedisEnum.Main);

    await app.init();
  });

  afterAll(async () => {
    await Promise.all([
      //
      app.close(),
      redisHelper.closeConnectionOnTest(),
      dataSource.destroy(),
    ]);
  });

  test('/ (GET)', async () => {
    const SERVER_PORT = Number(process.env.SERVER_PORT);
    expect(SERVER_PORT).toBe(3001);
  });
});
