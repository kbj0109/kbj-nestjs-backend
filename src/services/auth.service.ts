import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { AuthRepository } from '../repositories/auth.repository';
import { IUser } from '../repositories/schema/user.schema';
import { UserRepository } from '../repositories/user.repository';
import { compareEncryptValue, createJwtToken } from '../utils/encrypt.util';
import { AuthTypeEnum, IAuth } from '../repositories/schema/auth.schema';
import { environment } from '../config/environment.config';
import ms from 'ms';
import dayjs from 'dayjs';
import { ExpiredTokenException, InvalidTokenException } from '../constant/exception.constant';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  confirmOne = this.authRepository.confirmOne;

  signIn = async (
    username: IUser['username'],
    password: IUser['password'],
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const user = await this.userRepository.confirmOne({ username });

    const isCorrect = await compareEncryptValue(password, user.password);
    if (!isCorrect) {
      throw new BadRequestException({ message: 'Login Failed' });
    }

    const refreshToken = createJwtToken({ userId: user.id }, environment.REFRESH_TOKEN_EXPIRES_IN);

    const refreshExpiredAt = dayjs().add(ms(environment.REFRESH_TOKEN_EXPIRES_IN), 'ms').toDate();

    const item = await this.authRepository.createOne({
      userId: user.id,
      type: AuthTypeEnum.REFRESH_TOKEN,
      expiredAt: refreshExpiredAt,
      data: { refreshToken },
    });

    const accessToken = createJwtToken(
      { userId: user.id, username: user.username, authId: item.id },
      environment.ACCESS_TOKEN_EXPIRES_IN,
    );

    return { accessToken, refreshToken };
  };

  renewAccessToken = async (
    condition: Pick<IAuth, 'id' | 'userId'>,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const item = await this.authRepository.confirmOne({ id: condition.id });

    if (item.data.refreshToken !== refreshToken) {
      throw new InvalidTokenException();
    }

    if (item.expiredAt < new Date()) {
      throw new ExpiredTokenException({ message: 'Refresh Token Expired' });
    }

    const { id: userId, username } = await this.userRepository.confirmOne({ id: condition.userId });

    // Refresh Token 유효기간이 1/3 이하로 남은 경우
    const isRenewRefreshToken =
      item.expiredAt <
      dayjs()
        .add(ms(environment.REFRESH_TOKEN_EXPIRES_IN) / 3, 'ms')
        .toDate();

    if (isRenewRefreshToken) {
      this.authRepository.deleteByIds([item.id]);

      const newRefreshToken = createJwtToken({ userId }, environment.REFRESH_TOKEN_EXPIRES_IN);

      const newItem = await this.authRepository.createOne({
        userId,
        type: AuthTypeEnum.REFRESH_TOKEN,
        expiredAt: dayjs().add(ms(environment.REFRESH_TOKEN_EXPIRES_IN), 'ms').toDate(),
        data: { refreshToken: newRefreshToken },
      });

      const accessToken = createJwtToken({ userId, username, authId: newItem.id }, environment.ACCESS_TOKEN_EXPIRES_IN);

      return { accessToken, refreshToken: newRefreshToken };
    }

    const accessToken = createJwtToken(
      { userId, username, authId: isRenewRefreshToken },
      environment.ACCESS_TOKEN_EXPIRES_IN,
    );

    return { accessToken, refreshToken };
  };
}
