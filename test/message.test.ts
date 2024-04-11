import { setEnvironment } from '../src/config/environment.config';
setEnvironment({ NODE_ENV: NodeEnvEnum.Test });

import { setupTest, loginForTest, createUserForTest } from '.';
import { NodeEnvEnum } from '../src/constant/enum.constant';
import { UserRepository } from '../src/repositories/user.repository';
import { OnlyData } from '../src/types';
import { IUser } from '../src/repositories/schema/user.schema';
import { MessageSendInput, MessagesOutput } from '../src/controllers/message.controller.dto';
import { IMessage, MessageLevelEnum, MessageStatusEnum } from '../src/repositories/schema/message.schema';
import { MessageRepository } from '../src/repositories/Message.repository';

const testing = setupTest();

describe('API /messages 테스트', () => {
  let userRepository: UserRepository;
  let messageRepository: MessageRepository;
  let user1: IUser;
  let user2: IUser;
  let authorization1: string;
  let authorization2: string;
  let message1: IMessage;
  let message2: IMessage;

  beforeAll(async () => {
    const userData1: OnlyData<IUser> = { username: 'test1' + new Date().getTime(), password: 'test', name: 'test' };
    const userData2: OnlyData<IUser> = { username: 'test2' + new Date().getTime(), password: 'test', name: 'test' };

    userRepository = testing.appModule.get(UserRepository);
    messageRepository = testing.appModule.get(MessageRepository);

    user1 = await createUserForTest(testing.request, userData1);
    user2 = await createUserForTest(testing.request, userData2);
    authorization1 = await loginForTest(testing.request, userData1).then((result) => `Bearer ${result.accessToken}`);
    authorization2 = await loginForTest(testing.request, userData2).then((result) => `Bearer ${result.accessToken}`);
  });

  afterAll(async () => {
    await userRepository.delete({ username: user1.username });
    await userRepository.delete({ username: user2.username });
  });

  test('POST /messages/send 메세지 생성', async () => {
    const data: MessageSendInput = {
      toUserId: user2.id,
      messageLevel: MessageLevelEnum.normal,
      text: 'Hello World',
    };

    // 메세지 작성
    const response = await testing.request.post('/messages/send').send(data).set('Authorization', authorization1);
    expect(response.status).toBe(201);
    expect(response.body.messageStatus).toBe(MessageStatusEnum.activated);
    message1 = response.body;

    // 메세지 작성 - 로그인 안함
    const response2 = await testing.request.post('/messages/send').send(data);
    expect(response2.status).toBe(401);

    // 메세지 작성 - 같은 레벨로 메세지 작성
    const response3 = await testing.request.post('/messages/send').send(data).set('Authorization', authorization1);
    expect(response3.status).toBe(400);

    // 메세지 작성 - 더 높은 레벨로 메세지 작성
    const response4 = await testing.request
      .post('/messages/send')
      .send({ ...data, messageLevel: MessageLevelEnum.high })
      .set('Authorization', authorization1);
    expect(response4.status).toBe(201);
    message2 = response4.body;

    // 메세지 추가 작성 후 이전 메세지 비활성화
    const item = await messageRepository.confirmOne({ id: response.body.id });
    expect(item.messageStatus).toBe(MessageStatusEnum.deactivated);
  });

  test('PUT /messages/:id/status 메세지 승락/거절', async () => {
    // 비활성 메세지 상태 변경 실패
    const response = await testing.request
      .put(`/messages/${message1.id}/status`)
      .send({ messageStatus: MessageStatusEnum.rejected })
      .set('Authorization', authorization2);
    expect(response.status).not.toBe(200);

    // 활성 메세지 거절
    const response2 = await testing.request
      .put(`/messages/${message2.id}/status`)
      .send({ messageStatus: MessageStatusEnum.rejected })
      .set('Authorization', authorization2);

    expect(response2.status).toBe(200);
    const item = await messageRepository.confirmOne({ id: message2.id });
    expect(item.messageStatus).toBe(MessageStatusEnum.rejected);

    // 활성 메세지 승락
    {
      const data: MessageSendInput = { toUserId: user2.id, messageLevel: MessageLevelEnum.normal, text: 'Hello World' };
      const response3 = await testing.request.post('/messages/send').send(data).set('Authorization', authorization1);

      const response4 = await testing.request
        .put(`/messages/${response3.body.id}/status`)
        .send({ messageStatus: MessageStatusEnum.accepted })
        .set('Authorization', authorization2);
      expect(response4.status).toBe(200);

      const item = await messageRepository.confirmOne({ id: response3.body.id });
      expect(item.messageStatus).toBe(MessageStatusEnum.accepted);
    }

    // 승락 이후 다시 메세지 작성 불가
    {
      const data: MessageSendInput = { toUserId: user1.id, messageLevel: MessageLevelEnum.high, text: 'Hello World' };
      const response5 = await testing.request.post('/messages/send').send(data).set('Authorization', authorization2);
      expect(response5.status).toBe(400);
    }
  });

  test('GET /messages/sent 내가 보낸 메세지 목록', async () => {
    const response = await testing.request.get('/messages/sent').set('Authorization', authorization1);
    expect(response.status).toBe(200);

    const result = response.body as MessagesOutput;
    const list = await messageRepository.readMany({ fromUserId: user1.id });

    expect(result.list.length).toBe(list.length);
    expect(result.totalCount).toBe(list.length);

    result.list.forEach((item) => expect(item.fromUserId).toBe(user1.id));
  });

  test('GET /messages/received 내가 받은 메세지 목록', async () => {
    const response = await testing.request.get('/messages/received').set('Authorization', authorization2);
    expect(response.status).toBe(200);

    const result = response.body as MessagesOutput;
    const list = await messageRepository.readMany({ toUserId: user2.id });

    expect(result.list.length).toBe(list.length);
    expect(result.totalCount).toBe(list.length);

    result.list.forEach((item) => expect(item.toUserId).toBe(user2.id));
  });
});
