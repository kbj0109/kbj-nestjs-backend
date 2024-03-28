import { Module } from '@nestjs/common';
import { connectDatabase } from './config/database';
import { DatabaseEnum, RedisEnum } from './constant/enum';
import { UserController } from './controllers/user.controller';
import { getModelList, getServiceList } from './config';
import { connectRedis } from './config/redis';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    //
    connectDatabase(DatabaseEnum.KBJ),
    connectRedis(RedisEnum.Main),

    ...getServiceList(),
    ...getModelList(),
  ],
})
export class AppModule {}
