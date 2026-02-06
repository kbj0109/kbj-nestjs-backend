import { setEnvironment } from '../src/config/environment.config';
setEnvironment({ NODE_ENV: NodeEnvEnum.Test });

import { createUserForTest, loginForTest, setupTest } from '.';
import { NodeEnvEnum } from '../src/constant/enum.constant';
import { MatchingOutput } from '../src/controllers/matching.controller.dto';
import { MessageSendInput } from '../src/controllers/message.controller.dto';
import { MatchingRepository } from '../src/repositories/matching.repository';
import { IMessage, MessageLevelEnum, MessageStatusEnum } from '../src/repositories/schema/message.schema';
import { IUser } from '../src/repositories/schema/user.schema';
import { UserRepository } from '../src/repositories/user.repository';
import { OnlyData } from '../src/types';

const testing = setupTest();

describe('API /matching 테스트', () => {
  let userRepository: UserRepository;
  let matchingRepository: MatchingRepository;
  let user1: IUser;
  let user2: IUser;
  let authorization1: string;
  let authorization2: string;

  beforeAll(async () => {
    const userData1: OnlyData<IUser> = { username: 'test1' + new Date().getTime(), password: 'test', name: 'test' };
    const userData2: OnlyData<IUser> = { username: 'test2' + new Date().getTime(), password: 'test', name: 'test' };

    userRepository = testing.appModule.get(UserRepository);
    matchingRepository = testing.appModule.get(MatchingRepository);

    user1 = await createUserForTest(testing.request, userData1);
    user2 = await createUserForTest(testing.request, userData2);
    authorization1 = await loginForTest(testing.request, userData1).then((result) => `Bearer ${result.accessToken}`);
    authorization2 = await loginForTest(testing.request, userData2).then((result) => `Bearer ${result.accessToken}`);

    const data: MessageSendInput = { toUserId: user2.id, messageLevel: MessageLevelEnum.normal, text: 'Hello World' };
    const response = await testing.request.post('/messages/send').send(data).set('Authorization', authorization1);
    expect(response.status).toBe(201);
    const message = response.body as IMessage;

    const response2 = await testing.request
      .put(`/messages/${message.id}/status`)
      .send({ messageStatus: MessageStatusEnum.accepted })
      .set('Authorization', authorization2);
    expect(response2.status).toBe(200);
  });

  afterAll(async () => {
    await userRepository.delete({ username: user1.username });
    await userRepository.delete({ username: user2.username });
  });

  test('POST /matchings 매칭 목록', async () => {
    // 매칭 목록 + User + Message 릴레이션 추가 - User 1
    {
      const response = await testing.request.get('/matchings').set('Authorization', authorization1);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('list');
      expect(response.body).toHaveProperty('totalCount');

      const { list, totalCount } = await matchingRepository.readManyAndTotalCount({ userId: user1.id });
      expect(response.body.list).toHaveLength(list.length);
      expect(response.body.totalCount).toBe(totalCount);

      response.body.list.forEach((item: MatchingOutput) => {
        expect(item).toHaveProperty('matchingUser');
        expect(item).toHaveProperty('message');
        expect(item.matchingUser).not.toHaveProperty('password');
      });
    }

    // 매칭 목록 + User + Message 릴레이션 추가 - User 2
    {
      const response = await testing.request.get('/matchings').set('Authorization', authorization2);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('list');
      expect(response.body).toHaveProperty('totalCount');

      const { list, totalCount } = await matchingRepository.readManyAndTotalCount({ userId: user1.id });
      expect(response.body.list).toHaveLength(list.length);
      expect(response.body.totalCount).toBe(totalCount);

      response.body.list.forEach((item: MatchingOutput) => {
        expect(item).toHaveProperty('matchingUser');
        expect(item).toHaveProperty('message');
        expect(item.matchingUser).not.toHaveProperty('password');
      });
    }

    // 매칭 목록 - 로그인 안함
    {
      const response = await testing.request.get('/matchings');
      expect(response.status).toBe(401);
    }
  });
});
