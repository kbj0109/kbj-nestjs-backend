import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { DatabaseEnum, RedisEnum } from '../src/constant/enum.constant';
import { AppModule } from '../src/app.module';
import { RedisHelper } from '../src/config/redis.config';
import TestAgent from 'supertest/lib/agent';
import supertest from 'supertest';

/* 테스트 준비 - CallByRefrence 법칙으로 request 전달 (Deconstruct request inside test) */
export const setupTest = (): { request: TestAgent } => {
  const obj: { request: TestAgent } = { request: null as any };

  let app: INestApplication;
  let dataSource: DataSource;
  let redisHelper: RedisHelper;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = appModule.createNestApplication();
    dataSource = appModule.get(DatabaseEnum.KBJ);
    redisHelper = appModule.get(RedisEnum.Main);
    obj.request = supertest(app.getHttpServer());

    await app.init();
  });

  afterAll(async () => {
    await Promise.all([
      app!.close(), // App 종료
      dataSource!.destroy(), // DB 연결 종료
      redisHelper!.closeConnectionOnTest(), // Redis 연결 종료
    ]);
  });

  return obj;
};
