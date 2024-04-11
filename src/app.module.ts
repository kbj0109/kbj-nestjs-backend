import { Module } from '@nestjs/common';
import { connectDatabase } from './config/database';
import { DatabaseEnum, RedisEnum } from './constant/enum';
import { UserController } from './controllers/user.controller';
import { getRepositoryList, getServiceList } from './config';
import { connectRedis } from './config/redis';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [],
  controllers: [UserController, AuthController],
  providers: [
    //
    connectDatabase(DatabaseEnum.KBJ),
    connectRedis(RedisEnum.Main),

    ...getServiceList(),
    ...getRepositoryList(),
  ],
})
export class AppModule {}
