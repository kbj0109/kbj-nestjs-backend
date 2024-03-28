import { Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserService extends BaseService {
  constructor(private readonly userRepository: UserModel) {
    super();
  }

  readOne = this.userRepository.readOne;
  confirmOne = this.userRepository.confirmOne;
}
