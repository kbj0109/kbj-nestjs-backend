import { Inject } from '@nestjs/common';
import { DatabaseEnum, RedisEnum } from '../constant/enum';

/** 각 Database의 DataSource 가져오기 */
export const InjectDatasource = (type: DatabaseEnum): ReturnType<typeof Inject> => {
  return Inject(type);
};

/** 각 Redis의 연결 정보 가져오기 */
export const InjectRedis = (type: RedisEnum = RedisEnum.Main): ReturnType<typeof Inject> => {
  return Inject(type);
};
