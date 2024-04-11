import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { AuthRepository } from '../repositories/auth.repository';
import { IUser } from '../repositories/schema/user.schema';
import { UserRepository } from '../repositories/user.repository';
import { compareEncryptValue, createJwtToken } from '../utils/encrypt';
import { AuthTypeEnum } from '../repositories/schema/auth.schema';
import { environment } from '../config/environment';
import ms from 'ms';
import dayjs from 'dayjs';

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

    const accessToken = createJwtToken(
      { userId: user.id, username: user.username },
      environment.JWT_SECRET_KEY,
      environment.ACCESS_TOKEN_EXPIRES_IN,
    );

    const refreshToken = createJwtToken(
      { userId: user.id },
      environment.JWT_SECRET_KEY,
      environment.REFRESH_TOKEN_EXPIRES_IN,
    );

    const refreshExpiredAt = dayjs().add(ms(environment.REFRESH_TOKEN_EXPIRES_IN), 'ms').toDate();

    await this.authRepository.createOne({
      userId: user.id,
      type: AuthTypeEnum.REFRESH_TOKEN,
      expiredAt: refreshExpiredAt,
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  };
}
