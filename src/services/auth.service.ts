import { Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class AuthService extends BaseService {
  constructor(private readonly authRepository: AuthRepository) {
    super();
  }

  confirmOne = this.authRepository.confirmOne;
}
