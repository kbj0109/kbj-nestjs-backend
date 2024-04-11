import { setEnvironment } from '../src/config/environment.config';
setEnvironment({ NODE_ENV: NodeEnvEnum.Test });

import { setupTest } from '.';
import { NodeEnvEnum } from '../src/constant/enum.constant';

const testing = setupTest();

describe('API /users 테스트', () => {
  test('POST /users 사용자 생성', async () => {
    const response = await testing.request.post('/users').send({
      username: 'test',
      password: 'test',
      name: 'test',
    });

    expect(response.status).toBe(201);
  });

  test('GET /users 사용자 목록', async () => {
    const response = await testing.request.get('/users');
  });

  test('GET /users/:id 사용자 조회', async () => {
    const response = await testing.request.get('/users/1');
  });

  test('GET /users/:id 사용자 수정', async () => {
    const response = await testing.request.get('/users/1');
  });
});
