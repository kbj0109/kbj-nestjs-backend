import { environment, setEnvironment } from './config/environment';
setEnvironment();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { printDeveloperMessage } from './utils';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(environment.SERVER_PORT);

  printDeveloperMessage(`*** ${environment.SERVER_ENV} server launched with ${environment.NODE_ENV} .env`);
}
bootstrap();
