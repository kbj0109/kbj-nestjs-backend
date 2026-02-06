import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ListOutput } from '../constant/dto.constant';
import { DatabaseEnum } from '../constant/enum.constant';
import { InjectDatasource } from '../decorators/dependency.decorator';
import { QueryListOption } from '../types';
import { getPaginationInfo } from '../utils/database.util';
import { BaseRepository } from './index';
import { IMatching, MatchingSchema } from './schema/matching.schema';
import { IUser } from './schema/user.schema';

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
  ): Promise<{ list: (IMatching & Pick<MatchingSchema, 'matchingUser' | 'message'>)[] } & ListOutput> => {
    const { skip, take } = option || {};

    const [list, totalCount] = await this.repository.findAndCount({
      where: { userId },
      relations: ['matchingUser', 'message'],
      skip,
      take,
    });

    const paginationInfo = getPaginationInfo({ totalCount, currentCount: list.length, skip, take });

    return {
      ...paginationInfo,
      list: list as (IMatching & Pick<MatchingSchema, 'matchingUser' | 'message'>)[],
    };
  };
}
