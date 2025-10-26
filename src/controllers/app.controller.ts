import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailService } from '../services/email.service';

@ApiTags('/')
@Controller('/')
export class AppController {
  constructor(private readonly emailService: EmailService) {}

  @Get('/health')
  healthCheck(): { message: string } {
    return { message: 'OK' };
  }

  @Get('/test')
  async test(): Promise<{ message: string }> {
    const result = await this.emailService.enqueueWelcomeEmail('1');

    console.log(777, result);

    return { message: 'OK' };
  }
}
