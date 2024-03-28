import { Module } from '@nestjs/common';
import { connectDatabase } from './config/database';
import { DatabaseEnum } from './constant/enum';
import { UserController } from './controllers/user.controller';
import { getModelList, getServiceList } from './config';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    //
    connectDatabase(DatabaseEnum.KBJ),

    ...getServiceList(),
    ...getModelList(),
  ],
})
export class AppModule {}
