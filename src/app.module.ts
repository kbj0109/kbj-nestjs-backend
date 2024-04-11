import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { connectDatabase } from './config/database';
import { DatabaseEnum } from './constant/enum';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    //
    connectDatabase(DatabaseEnum.KBJ),
    AppService,
  ],
})
export class AppModule {}
