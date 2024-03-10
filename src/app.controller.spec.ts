import { setEnvironment } from './config/environment';
setEnvironment();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';

describe('AppController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  test('/ (GET)', () => {
    console.log(process.env.SERVER_ENV);
    console.log(process.env.SERVER_PORT);
    console.log(process.env.STAGING_KBJ_NESTJS_BACKEND1_SERVER_ENV);
    console.log(process.env.STAGING_KBJ_NESTJS_BACKEND1_SERVER_PORT);

    console.log(111, process.env.STAGING_KBJ_NESTJS_BACKEND);

    const SERVER_ENV =
      process.env.SERVER_ENV ||
      process.env.STAGING_KBJ_NESTJS_BACKEND_SERVER_ENV;
    const SERVER_PORT =
      process.env.SERVER_PORT ||
      process.env.STAGING_KBJ_NESTJS_BACKEND_SERVER_PORT;

    expect(!!SERVER_PORT || !!SERVER_ENV).toBe(true);

    expect(100).toBe(100);
  });
});
