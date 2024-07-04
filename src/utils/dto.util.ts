import { Type } from '@nestjs/common';
import { OmitType, PickType } from '@nestjs/swagger';
import { ZodNumber, ZodOptional, ZodString, z } from 'zod';

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
type ValidateObject<T> = Required<{
  [K in keyof T]: undefined extends T[K] ? z.ZodOptional<z.ZodType<T[K]>> : z.ZodType<T[K]>;
}>;

/* 유효성 검사 */
export const validateParameter = <T>(data: T, validator: ValidateObject<T>): T => {
  return z.object(validator).parse(data) as any;
};

/* 유효성 검사 - String 값이 Numeric 한지   */
export function validateStringIsNumeric(config: { optional: true }): ZodOptional<ZodString>;
export function validateStringIsNumeric(config?: { optional: false }): ZodString;
export function validateStringIsNumeric(config = { optional: false }): ZodString | ZodOptional<ZodString> {
  const { optional = false } = config;

  return optional
    ? (z.string().regex(/^\d+$/).optional() as ZodOptional<ZodString>)
    : (z.string().regex(/^\d+$/) as ZodString);
}

type ValidateValueToInt_Option = { optional?: boolean; defaultValue?: number; min?: number; max?: number };

/* 유효성 검사 - 값이 Int 인지 + Int 변환   */
export function validateValueToInt(config: ValidateValueToInt_Option & { optional?: true }): ZodOptional<ZodNumber>;
export function validateValueToInt(config?: ValidateValueToInt_Option & { optional?: false }): ZodNumber;
export function validateValueToInt(
  config: ValidateValueToInt_Option = { optional: false },
): ZodNumber | ZodOptional<ZodNumber> {
  const { optional = false, defaultValue, min, max } = config;

  let schema: any = z.coerce.number();

  if (min !== undefined) {
    schema = schema.min(min);
  }

  if (max !== undefined) {
    schema = schema.max(max);
  }

  if (optional) {
    schema = schema.optional();
  }

  if (defaultValue !== undefined) {
    schema = schema.default(defaultValue);
  }

  return schema;
}
