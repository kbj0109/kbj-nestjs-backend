import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { environment } from '../config/environment.config';
import { ServerEnvEnum } from '../constant/enum.constant';
import { checkOriginFromUrl } from '../utils/url.util';

/** Origin/Referer 검증 데코레이터 */
export function OriginRefererGuard(): any {
  return applyDecorators(UseGuards(OriginVerifyGuard));
}

/** Origin/Referer 헤더를 ALLOWED_ORIGINS 목록과 비교하여 검증 */
@Injectable()
class OriginVerifyGuard implements CanActivate {
  canActivate(context: ExecutionContext): true {
    if (environment.SERVER_ENV !== ServerEnvEnum.Production) return true;

    const request = context.switchToHttp().getRequest() as Request;
    const origin = request.headers['origin'] || request.headers['referer'];

    if (!origin) {
      throw new ForbiddenException();
    }

    const originString = Array.isArray(origin) ? origin[0] : origin;

    const { isValidUrl, originUrl } = checkOriginFromUrl(originString);
    if (!isValidUrl) {
      throw new ForbiddenException();
    }

    const isAllowed = environment.ALLOWED_ORIGINS.some((allowed) => originUrl === allowed);

    if (!isAllowed) {
      throw new ForbiddenException();
    }

    return true;
  }
}
