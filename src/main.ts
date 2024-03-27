import { environment, setEnvironment } from './config/environment';
setEnvironment();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(environment.SERVER_PORT);

  console.log(`Application is running on: http://localhost:${environment.SERVER_PORT}`);
}
bootstrap();
