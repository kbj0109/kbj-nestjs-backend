import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDatasource } from '../decorators/dependency.decorator';
import { BaseRepository } from './index';
import { DatabaseEnum } from '../constant/enum.constant';
import { IMatching, MatchingSchema } from './schema/matching.schema';

@Injectable()
export class MatchingRepository extends BaseRepository<IMatching, MatchingSchema> {
  constructor(
    @InjectDatasource(DatabaseEnum.KBJ)
    private readonly dataSource: DataSource,
  ) {
    super(dataSource, MatchingSchema);
  }
}
