import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { environment } from './environment';
import { getEnvironmentByAddress, printDeveloperMessage } from '../utils';
import { RedisEnum } from '../constant/enum';
import { sendSlackMessage } from './slack';

export const connectRedis = (type: RedisEnum = RedisEnum.Main): Provider => {
  return {
    provide: type,
    useValue: new RedisHelper({ host: environment.REDIS_HOST, port: environment.REDIS_PORT, connectionName: type }),
  };
};

export class RedisHelper {
  private redis: Redis;

  constructor(option: { host: string; port: number; connectionName: string }) {
    const redisEnvironment = getEnvironmentByAddress(environment.REDIS_HOST);

    const redisConnection = new Redis({
      ...option,
      retryStrategy(): number {
        printDeveloperMessage(`!!! Redis connection Failed and Retry at ${redisEnvironment}`, 0);
        return 3000;
      },
    }).on('connect', () => {
      printDeveloperMessage(`*** Redis ${option.connectionName} Connected at ${redisEnvironment}`);
    });

    this.redis = redisConnection;
  }

  /**
   * Redis 값을 꺼낸 후 Prase 해도 Date 는 String 으로 나오기에,
   * 2020-04-17T09:24:25.000Z 에 해당하는 값은 Date로 변환해서 리턴
   */
  private dateReviver(key: string, value: any): typeof value {
    if (typeof value === 'string') {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      if (isoDateRegex.test(value)) {
        return new Date(value);
      }
    }
    return value;
  }

  /** Redis에 저장된 값 호출 */
  public async get(key: string): Promise<any | null> {
    try {
      const stringfiedObj = await this.redis.get(key);
      if (!stringfiedObj) return null;

      try {
        const parsedObj = JSON.parse(stringfiedObj, this.dateReviver) as any | null;
        return parsedObj;
      } catch (err) {
        return stringfiedObj;
      }
    } catch (err) {
      sendSlackMessage('Notification', {
        title: 'Redis Read Error',
        text: JSON.stringify(err),
        titleColor: 'warning',
      });
      return null;
    }
  }

  /**
   * @param expireTime 초 단위 - 기본값 1시간
   * @returns 성공 여부
   */
  public async set(key: string, value: any, expireTime = 3600): Promise<boolean> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', expireTime);
      return true;
    } catch (err) {
      sendSlackMessage('Notification', {
        title: 'Redis Save Error',
        text: JSON.stringify(err),
        titleColor: 'warning',
      });
      return false;
    }
  }

  /**
   * @param keyList 삭제할 키 리스트
   * 캐싱된 특정 값들을 삭제 - 동시에 여러개 삭제 가능
   */
  public async delete(...keyList: string[]): Promise<boolean> {
    try {
      await this.redis.del(...keyList);
      return true;
    } catch (err) {
      sendSlackMessage('Notification', {
        title: 'Redis Delete Error',
        text: JSON.stringify(err),
        titleColor: 'warning',
      });
      return false;
    }
  }

  /** 캐싱된 모든 데이터 리셋 */
  public async reset(): Promise<boolean> {
    try {
      await this.redis.flushall();
      return true;
    } catch (err) {
      sendSlackMessage('Notification', {
        title: 'Redis Reset Error',
        text: JSON.stringify(err),
        titleColor: 'warning',
      });
      return false;
    }
  }
}
