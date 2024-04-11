import { ConflictException, Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../repositories/schema/user.schema';
import { getEncryptValue } from '../utils/encrypt.util';
import { OnlyData, QueryTransactionOption } from '../types';

@Injectable()
export class UserService extends BaseService {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  count = this.userRepository.count;
  readOne = this.userRepository.readOne;
  readMany = this.userRepository.readMany;
  readManyAndTotalCount = this.userRepository.readManyAndTotalCount;
  confirmOne = this.userRepository.confirmOne;

  updateUser = async (
    id: IUser['id'],
    data: Partial<OnlyData<IUser>>,
    option?: QueryTransactionOption,
  ): Promise<IUser> => {
    if (data.password) {
      data.password = await getEncryptValue(data.password);
    }

    await this.userRepository.update({ id }, data, option);

    return this.userRepository.confirmOne({ id }, option);
  };

  createOne = async (data: OnlyData<IUser>, option?: QueryTransactionOption): Promise<IUser> => {
    const orgItem = await this.userRepository.readOne({ username: data.username });
    if (orgItem) {
      throw new ConflictException();
    }

    const password = await getEncryptValue(data.password);

    return this.userRepository.createOne({ ...data, password }, option);
  };
}
