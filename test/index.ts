import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { DatabaseEnum, RedisEnum } from '../src/constant/enum.constant';
import { AppModule } from '../src/app.module';
import { RedisHelper } from '../src/config/redis.config';
import TestAgent from 'supertest/lib/agent';
import supertest from 'supertest';
import { IUser } from '../src/repositories/schema/user.schema';

/* 테스트 준비 - CallByRefrence 법칙으로 request 전달 (Deconstruct request inside test) */
export const setupTest = (): { request: TestAgent; appModule: TestingModule } => {
  const obj: { request: TestAgent; appModule: TestingModule } = { appModule: null, request: null } as any;

  let app: INestApplication;
  let dataSource: DataSource;
  let redisHelper: RedisHelper;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = appModule.createNestApplication();
    dataSource = appModule.get(DatabaseEnum.KBJ);
    redisHelper = appModule.get(RedisEnum.Main);
    obj.appModule = appModule;
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

/* Sample 로그인 */
export const signInForTest = async (request: TestAgent, data: Pick<IUser, 'username' | 'password'>) => {
  const response = await request.post('/auths/signin').send(data);
  const { accessToken, refreshToken } = response.body;

  return { accessToken, refreshToken };
};
