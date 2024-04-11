import { ConflictException, Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../repositories/schema/user.schema';
import { getEncryptValue } from '../utils/encrypt';
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

  createOne = async (data: OnlyData<IUser>, option?: QueryTransactionOption): Promise<IUser> => {
    const orgItem = await this.userRepository.readOne({ username: data.username });
    if (orgItem) {
      throw new ConflictException();
    }

    const password = await getEncryptValue(data.password);

    return this.userRepository.createOne({ ...data, password }, option);
  };
}
