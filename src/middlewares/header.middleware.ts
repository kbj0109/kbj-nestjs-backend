import { NextFunction, Request, Response } from 'express';
import { getClientIp } from '@supercharge/request-ip';

/** 요청자 IP 를 Header에 기록 */
export function setRequestIp(req: Request, res: Response, next: NextFunction): void {
  req.headers['ip'] = getClientIp(req);
  return next();
}
