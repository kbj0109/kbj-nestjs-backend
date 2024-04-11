import { Type } from '@nestjs/common';
import { OmitType, PickType } from '@nestjs/swagger';

/* DTO - PickType 에서 자동으로 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' 제거 */
export function PickDataType<T, K extends keyof Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>(
  classRef: Type<T>,
  keys: readonly K[] = [],
): Type<Pick<Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>, K>> {
  const Type = OmitType(classRef, ['id', 'createdAt', 'updatedAt', 'deletedAt'] as any) as any;

  return PickType(Type, [...keys]);
}

/* DTO - OmitType 에서 자동으로 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' 제거 */
export function OmitDataType<T, K extends keyof Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>(
  classRef: Type<T>,
  keys: readonly K[] = [],
): Type<Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | K>> {
  return OmitType(classRef, [...keys, 'id', 'createdAt', 'updatedAt', 'deletedAt'] as any) as any;
}
