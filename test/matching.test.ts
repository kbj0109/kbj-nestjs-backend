import { environment, setEnvironment } from '../src/config/environment.config';
setEnvironment({ NODE_ENV: NodeEnvEnum.Test });

import { createUserForTest, setupTest } from '.';
import { NodeEnvEnum } from '../src/constant/enum.constant';
import { UserRepository } from '../src/repositories/user.repository';
import { OnlyData } from '../src/types';
import { IUser } from '../src/repositories/schema/user.schema';
import { openJwtToken } from '../src/utils/encrypt.util';

const testing = setupTest();

describe('API /matchings 테스트', () => {
  let userRepository: UserRepository;
  const userData: OnlyData<IUser> = { username: 'test' + new Date().getTime(), password: 'test', name: 'test' };
  let user: IUser;

  beforeAll(async () => {
    userRepository = testing.appModule.get(UserRepository);

    user = await createUserForTest(testing.request, userData);
  });

  afterAll(async () => {
    await userRepository.delete({ username: userData.username });
  });

  test('POST /matchings/login 로그인', async () => {
    const { username, password } = userData;
    const response = await testing.request.post('/auths/login').send({ username, password });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');

    const { accessToken } = response.body;
    const loginData = openJwtToken(accessToken, environment.JWT_SECRET_KEY) as LoginUserType;

    expect(loginData.username).toBe(username);
    expect(loginData.userId).toBe(user.id);

    const response2 = await testing.request.post('/auths/login').send({ username, password: 'wrong' });
    expect(response2.status).toBe(400);
  });

  test('POST /auths/renew 로그인 토큰 갱신', async () => {
    const { username, password } = userData;
    const response = await testing.request.post('/auths/login').send({ username, password });
    const { accessToken, refreshToken } = response.body;

    {
      const response = await testing.request
        .post('/auths/renew')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.accessToken).not.toBe(accessToken);
    }

    {
      const response = await testing.request
        .post('/auths/renew')
        .set('Authorization', `Bearer ${'wrong token'}`)
        .send({ refreshToken });

      expect(response.status).toBe(401);
    }

    {
      const response = await testing.request
        .post('/auths/renew')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken: 'wrong token' });
      expect(response.status).toBe(401);
    }
  });
});
