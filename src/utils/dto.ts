import { z } from 'nestjs-zod/z';
import { createZodDto, ZodDto } from 'nestjs-zod';
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

/* 받은 Type의 Key 값에 대한 유효성 검사를 필수로 선언 */
type ValidateObject<T> = Required<{ [K in keyof T]: z.ZodType<T[K]> }>;

/* 유효성 검사 설정 T 를 받아 DTO로 변환 */
export const getParamValidator = <T>(validator: ValidateObject<T>): ZodDto => {
  return createZodDto(z.object(validator));
};
