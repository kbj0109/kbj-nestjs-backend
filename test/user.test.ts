import { setEnvironment } from '../src/config/environment.config';
setEnvironment({ NODE_ENV: NodeEnvEnum.Test });

import { loginForTest, setupTest } from '.';
import { NodeEnvEnum } from '../src/constant/enum.constant';
import { IUser } from '../src/repositories/schema/user.schema';
import { UserRepository } from '../src/repositories/user.repository';
import { OnlyData } from '../src/types';
import { createRandomString, waitSeconds } from '../src/utils';

const testing = setupTest();

describe('API /users 테스트', () => {
  let userRepository: UserRepository;
  let authorization: string;
  const data: OnlyData<IUser> = { username: 'test' + new Date().getTime(), password: 'test', name: 'test' };

  beforeAll(() => {
    userRepository = testing.appModule.get(UserRepository);
  });

  afterAll(async () => {
    await userRepository.delete({ username: data.username });
  });

  test('POST /users 사용자 생성', async () => {
    const response = await testing.request.post('/users').send(data);

    expect(response.status).toBe(201);
    expect(response.body).not.toHaveProperty('password');

    const item = await userRepository.confirmOne({ username: data.username });

    expect(item).not.toBeNull();
    expect(item.password).not.toEqual(data.password);

    const response2 = await testing.request.post('/users').send(data);
    expect(response2.status).toBe(409);

    const { accessToken } = await loginForTest(testing.request, data);
    authorization = `Bearer ${accessToken}`;
  });

  test('GET /users 사용자 목록', async () => {
    const response = await testing.request.get('/users');
    expect(response.status).toBe(200);

    const { totalCount, list } = response.body;

    const count = await userRepository.count();
    expect(totalCount).toBe(count);
    expect(Array.isArray(list)).toBe(true);
  });

  test('GET /users/:id 사용자 조회', async () => {
    const item = await userRepository.confirmOne({ username: data.username });
    const response = await testing.request.get(`/users/${item.id}`).set('Authorization', authorization);

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('password');

    const response2 = await testing.request.get(`/users/${item.id}`);
    expect(response2.status).toBe(401);
  });

  test('PUT /users/:id 사용자 수정', async () => {
    const newName = 'test' + createRandomString(3);
    const item = await userRepository.confirmOne({ username: data.username });

    const response = await testing.request
      .put(`/users/${item.id}`)
      .send({ name: newName })
      .set('Authorization', authorization);

    await waitSeconds(1);

    const newItem = await userRepository.confirmOne({ username: data.username });

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('password');
    expect(newItem.name).toBe(newName);

    const response2 = await testing.request.put(`/users/${item.id}`).send({ name: newName });
    expect(response2.status).toBe(401);
  });
});
