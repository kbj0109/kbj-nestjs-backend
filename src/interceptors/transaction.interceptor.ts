import { applyDecorators, CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { NotImplementedException } from '@nestjs/common/exceptions';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

import { InjectDatasource } from '../decorators/dependency.decorator';
import { DatabaseEnum } from '../constant/enum';

/** 특정 DB의 Transaction 을 각 클라이언트 요청 전후로 처리하게 Intercept  */
export function TransactionWrapper(databaseType: DatabaseEnum): ReturnType<typeof applyDecorators> {
  if (databaseType === DatabaseEnum.KBJ) return applyDecorators(UseInterceptors(KbjTransactionInterceptor));

  throw new NotImplementedException();
}

/** Transaction 처리를 Request Handling 직전/직후에 실행 */
class TransactionInterceptor implements NestInterceptor {
  constructor(
    private readonly dataSource: DataSource,
    private readonly databaseType: DatabaseEnum,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    /** Request 진입 전 Transaction 시작 */
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const request = context.switchToHttp().getRequest();
    const transactionKey = `${this.databaseType}_transaction`;
    request[transactionKey] = queryRunner;

    return next.handle().pipe(
      /** Transaction Commit */
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),

      /** Transaction Rollback */
      catchError(async (err) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw err;
      }),
    );
  }
}

/** Goodc DB 관련한 Transaction 처리 */
class KbjTransactionInterceptor extends TransactionInterceptor {
  constructor(@InjectDatasource(DatabaseEnum.KBJ) dataSource: DataSource) {
    super(dataSource, DatabaseEnum.KBJ);
  }
}
