// mail.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { waitSeconds } from '../utils';

@Processor('mail')
export class EmailProcessor extends WorkerHost {
  // 동시성은 queue 옵션이나 Worker 옵션으로 조절 가능
  async process(job: Job) {
    switch (job.name) {
      case 'welcome-email':
        // 실제 발송 로직
        // await this.mailer.sendWelcome(job.data.userId)
        await waitSeconds(3);
        console.log(11111111);
        // console.log(777, job);
        console.log(888, job.data);
        return { ok: true };
      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    // 로깅/트래킹
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    // 실패 핸들링 (예: DLQ로 라우팅)
  }
}
