import { MiddlewareConsumer, Module, NestModule, OnModuleDestroy } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { DataSource } from 'typeorm';
import { getOtherList, getRepositoryList, getServiceList } from './config';
import { connectDatabase } from './config/database.config';
import { environment } from './config/environment.config';
import { connectRedis, RedisHelper } from './config/redis.config';
import { DatabaseEnum, RedisEnum } from './constant/enum.constant';
import { AppController } from './controllers/app.controller';
import { AuthController } from './controllers/auth.controller';
import { MatchingController } from './controllers/matching.controller';
import { MessageController } from './controllers/message.controller';
import { UserController } from './controllers/user.controller';
import { InjectDatasource, InjectRedis } from './decorators/dependency.decorator';
import { LoggingStaticMiddleware } from './middlewares/loggingStatic.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(environment.MAIN_FOLDER_PATH, '/src/assets'),
      serveRoot: '/assets',
    }),
  ],
  controllers: [AppController, UserController, AuthController, MessageController, MatchingController],
  providers: [
    connectDatabase(DatabaseEnum.KBJ),
    connectRedis(RedisEnum.Main),

    ...getServiceList(),
    ...getRepositoryList(),
    ...getOtherList(),
  ],
})
export class AppModule implements NestModule, OnModuleDestroy {
  constructor(
    @InjectDatasource(DatabaseEnum.KBJ) private readonly dataSource: DataSource,
    @InjectRedis(RedisEnum.Main) private readonly redisHelper: RedisHelper,
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingStaticMiddleware).forRoutes('/assets/*');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }

    await this.redisHelper.closeConnection();
  }
}
