import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDatasource } from '../decorators/dependency.decorator';
import { BaseRepository } from './index';
import { DatabaseEnum } from '../constant/enum.constant';
import { IMatching, MatchingSchema } from './schema/matching.schema';
import { IUser } from './schema/user.schema';
import { QueryListOption } from '../types';

@Injectable()
export class MatchingRepository extends BaseRepository<IMatching, MatchingSchema> {
  constructor(
    @InjectDatasource(DatabaseEnum.KBJ)
    private readonly dataSource: DataSource,
  ) {
    super(dataSource, MatchingSchema);
  }

  readManyAndTotalCountWithUserAndMessage = async (
    userId: IUser['id'],
    option?: QueryListOption,
  ): Promise<{ list: (IMatching & { matchingUser: IUser })[]; totalCount: number }> => {
    const { skip, take } = option || {};

    const [list, totalCount] = await this.repository.findAndCount({
      where: { userId },
      relations: ['matchingUser', 'message'],
      skip,
      take,
    });

    return {
      totalCount,
      list: list as (IMatching & { matchingUser: IUser })[],
    };
  };
}
