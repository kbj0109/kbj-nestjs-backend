import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ExpiredTokenException } from '../constant/exception.constant';
import { UserService } from '../services/user.service';
import ms from 'ms';

/** 로그인 상태 확인 */
@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): true {
    const request = context.switchToHttp().getRequest() as Request;

    const allowEmptyToken = this.reflector.get<boolean>('allowEmptyToken', context.getHandler());

    if (allowEmptyToken && !request.loginUser) return true;
    if (request.loginUser) return true;

    throw new UnauthorizedException({ message: 'Login Required' });
  }
}

/** JWT 토큰의 만료 시간을 확인 */
@Injectable()
export class ExpiredTokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): true {
    const request = context.switchToHttp().getRequest() as Request;

    const allowEmptyToken = this.reflector.get<boolean>('allowEmptyToken', context.getHandler());
    const allowExpiredToken = this.reflector.get<boolean>('allowExpiredToken', context.getHandler());
    const expiresIn = this.reflector.get<string>('expiresIn', context.getHandler());

    // 빈 토큰 허용이면서 비로그인 상태에서는 통과
    if (allowEmptyToken && !request.loginUser) return true;

    if (!request.loginUser) {
      return true;
    }

    const { iat } = request.loginUser as LoginUserType;
    const isTokenExpired = iat * 1000 + ms(expiresIn) < new Date().getTime();

    if (isTokenExpired === false || allowExpiredToken) return true;

    throw new ExpiredTokenException();
  }
}

/** 토큰에 담긴 사용자|장치의 실제 유무를 확인 */
@Injectable()
export class ConfirmExistenceGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<true> {
    const request = context.switchToHttp().getRequest() as Request;

    const allowEmptyToken = this.reflector.get<boolean>('allowEmptyToken', context.getHandler());

    // 빈 토큰 허용이면서 비로그인 상태에서는 통과
    if (allowEmptyToken && !request.loginUser) return true;

    const { userId } = request.loginUser as LoginUserType;

    const user = await this.userService.readOne({ id: userId }, { select: ['id', 'username'] });
    if (!user) {
      throw new UnauthorizedException({ message: 'User Not Found' });
    }

    return true;
  }
}
