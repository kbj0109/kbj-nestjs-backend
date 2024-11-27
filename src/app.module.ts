import { MiddlewareConsumer, Module, NestModule, OnModuleDestroy } from '@nestjs/common';
import { connectDatabase } from './config/database.config';
import { DatabaseEnum, RedisEnum } from './constant/enum.constant';
import { UserController } from './controllers/user.controller';
import { getOtherList, getRepositoryList, getServiceList } from './config';
import { connectRedis, RedisHelper } from './config/redis.config';
import { AuthController } from './controllers/auth.controller';
import { MessageController } from './controllers/message.controller';
import { MatchingController } from './controllers/matching.controller';
import { LoggingStaticMiddleware } from './middlewares/loggingStatic.middleware';
import { InjectDatasource, InjectRedis } from './decorators/dependency.decorator';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: path.join(__dirname, '../..', 'public'),
    //   serveRoot: '/public',
    // }),
  ],
  controllers: [UserController, AuthController, MessageController, MatchingController],
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
    consumer.apply(LoggingStaticMiddleware).forRoutes('/public/*');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }

    await this.redisHelper.closeConnection();
  }
}
