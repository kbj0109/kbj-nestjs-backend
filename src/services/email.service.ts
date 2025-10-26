import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async enqueueWelcomeEmail(userId: string): Promise<any> {
    const result = await this.mailQueue.add(
      'welcome-email', // job name
      { userId, timestamp: Date.now() }, // payload
      {
        attempts: 5, // 재시도
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false, // 실패 보존(사후 분석/ DLQ 라우팅용)
        priority: 2, // 우선순위(낮을수록 높음)
        delay: 0, // 지연 실행
      },
    );

    return result;
  }
}
