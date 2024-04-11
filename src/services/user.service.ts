import { Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { UserModel } from '../models/user.model';
import { CreateUserInput } from '../controllers/user.dto';
import { IUser } from '../models/schema/user.schema';
import { getEncryptValue } from '../utils/encrypt';

@Injectable()
export class UserService extends BaseService {
  constructor(private readonly userRepository: UserModel) {
    super();
  }

  readOne = this.userRepository.readOne;
  confirmOne = this.userRepository.confirmOne;

  createOne = async (data: CreateUserInput): Promise<IUser> => {
    const password = await getEncryptValue(data.password);

    return this.userRepository.createOne({ ...data, password });
  };
}
