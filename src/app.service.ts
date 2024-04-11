import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(new Date(), 'hello world');
    return 'Hello World 4444 !';
  }
}
