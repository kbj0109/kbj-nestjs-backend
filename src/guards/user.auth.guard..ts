import { applyDecorators, ExecutionContext, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ApiBearerAuth, ApiExtension } from '@nestjs/swagger';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { environment } from '../config/environment.config';
import { InvalidTokenException } from '../constant/exception.constant';
import { ConfirmExistenceGuard, ExpiredTokenGuard, LoginGuard } from './auth.guard';

/** 토큰 인증 Guard - Option 으로 만료 확인 여부, 아이디 존재 유무를 확인 */
export function UserAuthGuard(option?: {
  allowEmptyToken?: boolean; // 비로그인 사용자 허용 여부
  allowExpiredToken?: boolean; // 만료 토큰 허용 여부
  checkUserExist?: boolean; // 토큰 내 User Id의 User 유무 확인 여부
}): any {
  const { allowEmptyToken = false, allowExpiredToken = false, checkUserExist = false } = option || {};

  const expiresIn = environment.ACCESS_TOKEN_EXPIRES_IN;

  return applyDecorators(
    SetMetadata('allowEmptyToken', allowEmptyToken),
    SetMetadata('allowExpiredToken', allowExpiredToken),
    SetMetadata('checkUserExist', checkUserExist),
    SetMetadata('expiresIn', expiresIn),
    ApiBearerAuth(),
    ApiExtension('x-requires-auth', true),
    UseGuards(
      JwtGuard, // 토큰 해석
      LoginGuard, // 로그인 여부 확인
      ExpiredTokenGuard, // 만료 토큰 허용 유무 확인
      ConfirmExistenceGuard, // Token 내 AuthId의 실제 유무 확인
    ),
  );
}

export class LoginJwtStrategy extends PassportStrategy(Strategy, 'LoginUserAuth') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: environment.JWT_SECRET_KEY,
    });
  }

  validate(payload: LoginUserType): LoginUserType {
    const { userId } = payload;

    if (!userId) {
      throw new InvalidTokenException();
    }

    return payload;
  }
}

class JwtGuard extends AuthGuard('LoginUserAuth') {
  constructor() {
    super({ property: 'loginUser' });
  }

  getRequest(context: ExecutionContext): Request {
    const request = context.switchToHttp().getRequest() as Request;
    return request;
  }

  handleRequest(err: any, payload: ReturnType<LoginJwtStrategy['validate']> | void): any {
    if (err) throw err;
    if (!payload) return; // 토큰이 없는 경우 통과

    return payload;
  }
}
