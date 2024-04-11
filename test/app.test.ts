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
    const SERVER_PORT = Number(process.env.SERVER_PORT);

    expect(SERVER_PORT).toBe(3001);
  });
});
