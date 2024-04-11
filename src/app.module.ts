import { Module } from '@nestjs/common';
import { connectDatabase } from './config/database';
import { DatabaseEnum, RedisEnum } from './constant/enum';
import { UserController } from './controllers/user.controller';
import { getOtherList, getRepositoryList, getServiceList } from './config';
import { connectRedis } from './config/redis';
import { AuthController } from './controllers/auth.controller';
import { MessageController } from './controllers/message.controller';

@Module({
  imports: [],
  controllers: [UserController, AuthController, MessageController],
  providers: [
    connectDatabase(DatabaseEnum.KBJ),
    connectRedis(RedisEnum.Main),

    ...getServiceList(),
    ...getRepositoryList(),
    ...getOtherList(),
  ],
})
export class AppModule {}
