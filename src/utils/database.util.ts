import { FindOperator, IsNull } from 'typeorm';

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
