import { INestApplication } from '@nestjs/common';
import { environment } from '../config/environment.config';
import { printDeveloperMessage } from '../utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NodeEnvEnum } from '../constant/enum.constant';
import chalk from 'chalk';

export const setApiDocument = (app: INestApplication): void => {
  if (environment.IS_LOCAL || environment.NODE_ENV !== NodeEnvEnum.Production) {
    const title = `${environment.SERVER_ENV.toUpperCase()} API 문서 - (${environment.NODE_ENV})`;

    const options = new DocumentBuilder().setTitle(title).addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`/swagger`, app, document);

    const serverUrl = `${environment.SERVER_PROTOCOL}://${environment.SERVER_HOST}:${environment.SERVER_PORT}`;
    const swaggerAddress = `${serverUrl}/swagger`;
    printDeveloperMessage(`*** Swagger API Document: ${chalk.yellow(swaggerAddress)}`);
  }
};
