import { FindOperator, IsNull } from 'typeorm';
import { ListInput } from '../constant/dto.constant';

/** 쿼리 조건문 Null => IsNull() 변환 */
export function setNullToIsNull<T>(condition: { [key: string]: any }): any {
  return replaceObjectValueExceptFindOperator(condition, null, IsNull()) as any;
}

/** Object 내 특정 값을 다른 값으로 대체한다 * TypeOrm 기능 Object 제외  */
export function replaceObjectValueExceptFindOperator(
  obj: { [key: string]: any },
  orgValue: any,
  newValue: any,
): { [key: string]: any } {
  const newObj: typeof obj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // @ FindOperator는 교체 안함
      if (value instanceof FindOperator) {
        newObj[key] = value;
        continue;
      }

      if (typeof value === 'object' && value instanceof Date) {
        if (value === orgValue) {
          newObj[key] = newValue;
          continue;
        }
        newObj[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = replaceObjectValueExceptFindOperator(value, orgValue, newValue);
      } else if (value === orgValue) {
        newObj[key] = newValue;
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj;
}

/** 페이지네이션 정보 조회 */
export function getPaginationInfo(
  condition: ListInput & { totalCount: number; currentCount: number },
): ListInput & { totalCount: number; totalPageCount: number; hasNext: boolean } {
  if (!condition.take) condition.take = undefined;
  if (!condition.skip) condition.skip = undefined;

  const { totalCount, currentCount, skip = 0, take } = condition;

  const totalPageCount = ((): number => {
    if (!skip && !take) return 1;

    if (skip && !take) {
      if (totalCount > 0 && currentCount > 0) return 2;
      return 1;
    }

    if (!skip && take) return Math.ceil(totalCount / take);

    if (skip && take) return Math.ceil(totalCount / take);

    return 1;
  })();

  const hasNext = totalCount > skip + currentCount;

  return { totalPageCount, totalCount, hasNext, skip, take };
}
