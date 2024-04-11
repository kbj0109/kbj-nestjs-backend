import { INestApplication } from '@nestjs/common';
import { environment } from '../config/environment';
import { printDeveloperMessage } from '../utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NodeEnvEnum } from '../constant/enum';
import { patchNestJsSwagger } from 'nestjs-zod';

export const setApiDocument = (app: INestApplication): void => {
  if (environment.IS_LOCAL || environment.NODE_ENV !== NodeEnvEnum.Production) {
    const title = `${environment.SERVER_ENV.toUpperCase()} API 문서 - (${environment.NODE_ENV})`;

    patchNestJsSwagger(); // Zod 유효성 검사 설정을 Swagger에 추가

    const options = new DocumentBuilder().setTitle(title).build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`/swagger`, app, document);

    printDeveloperMessage(`*** Swagger API Document: http://localhost:${environment.SERVER_PORT}/swagger`);
  }
};
