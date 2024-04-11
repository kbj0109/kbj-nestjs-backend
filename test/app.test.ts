import { setEnvironment } from '../src/config/environment';
setEnvironment();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

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
    console.log(111, process.env.STAGING_KBJ_NESTJS_BACKEND);
    console.log(222, JSON.stringify(process.env.STAGING_KBJ_NESTJS_BACKEND));

    const SERVER_PORT = Number(process.env.SERVER_PORT);

    expect(SERVER_PORT).toBe(3001);
  });

  test('/ (GET)', () => {
    const SERVER_ENV = process.env.SERVER_ENV || process.env.STAGING_KBJ_NESTJS_BACKEND_SERVER_ENV;
    const SERVER_PORT = process.env.SERVER_PORT || process.env.STAGING_KBJ_NESTJS_BACKEND_SERVER_PORT;

    console.log(3333, SERVER_ENV, SERVER_ENV);

    expect(!!SERVER_PORT || !!SERVER_ENV).toBe(true);
  });

  test('/ (GET)', () => {
    const SERVER_ENV = process.env.SERVER_ENV || process.env.STAGING_KBJ_NESTJS_BACKEND_SERVER_ENV;

    console.log(4444, SERVER_ENV);

    expect(SERVER_ENV).toBe('staging');
  });
});
