import { ConflictException, Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { UserModel } from '../models/user.model';
import { IUser } from '../models/schema/user.schema';
import { getEncryptValue } from '../utils/encrypt';
import { OnlyData } from '../types';

@Injectable()
export class UserService extends BaseService {
  constructor(private readonly userRepository: UserModel) {
    super();
  }

  readOne = this.userRepository.readOne;
  confirmOne = this.userRepository.confirmOne;

  createOne = async (data: OnlyData<IUser>): Promise<IUser> => {
    const orgItem = await this.userRepository.readOne({ username: data.username });
    if (orgItem) {
      throw new ConflictException();
    }

    const password = await getEncryptValue(data.password);

    return this.userRepository.createOne({ ...data, password });
  };
}
