import { Inject } from '@nestjs/common';
import { DatabaseEnum, RedisEnum } from '../constant/enum';

/** 각 Database의 DataSource 가져오기 */
export const InjectDatasource = (type: DatabaseEnum): ReturnType<typeof Inject> => {
  return Inject(type);
};
