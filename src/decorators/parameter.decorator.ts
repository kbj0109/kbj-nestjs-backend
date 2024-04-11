import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DatabaseEnum } from '../constant/enum';

/** 특정 DB의 Transaction 가져오기 - TransactionWrapper 기반  */
export const Transaction = (databaseType: DatabaseEnum): ParameterDecorator =>
  createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const transactionKey = `${databaseType}_transaction`;
    return (request as any)[transactionKey];
  })();
