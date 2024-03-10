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

    expect(100).toBe(100);
  });
});
