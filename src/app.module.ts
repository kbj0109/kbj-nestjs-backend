import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { connectDatabase } from './config/database.config';
import { DatabaseEnum, RedisEnum } from './constant/enum.constant';
import { UserController } from './controllers/user.controller';
import { getOtherList, getRepositoryList, getServiceList } from './config';
import { connectRedis } from './config/redis.config';
import { AuthController } from './controllers/auth.controller';
import { MessageController } from './controllers/message.controller';
import { MatchingController } from './controllers/matching.controller';
import { LoggingStaticMiddleware } from './middlewares/loggingStatic.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingStaticMiddleware).forRoutes('/public/*');
  }
}
