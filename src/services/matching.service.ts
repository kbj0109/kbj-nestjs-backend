import { Injectable } from '@nestjs/common';
import { BaseService } from '.';
import { MatchingRepository } from '../repositories/matching.repository';
import { IUser } from '../repositories/schema/user.schema';
import { QueryListOption } from '../types';

@Injectable()
export class MatchingService extends BaseService {
  constructor(private readonly matchingRepository: MatchingRepository) {
    super();
  }

  confirmOne = this.matchingRepository.confirmOne;
  readManyAndTotalCount = this.matchingRepository.readManyAndTotalCount;

  readManyAndTotalCountWithUser = (
    userId: IUser['id'],
    option?: QueryListOption,
  ): ReturnType<MatchingRepository['readManyAndTotalCountWithUser']> => {
    return this.matchingRepository.readManyAndTotalCountWithUser(userId, option);
  };
}
