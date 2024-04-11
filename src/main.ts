import { environment, setEnvironment } from './config/environment.config';
setEnvironment();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { printDeveloperMessage } from './utils';
import { checkAllDatabaseSync } from './config/system-database.config';
import { setMiddleware } from './middlewares';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  setMiddleware(app);

  await app.listen(environment.SERVER_PORT);

  printDeveloperMessage(`*** ${environment.SERVER_ENV} server launched with ${environment.NODE_ENV} .env`);

  checkAllDatabaseSync(environment.DB_SYNC_CHECK);
}
bootstrap();
