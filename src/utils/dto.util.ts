import { Type } from '@nestjs/common';
import { OmitType, PickType } from '@nestjs/swagger';
import _ from 'lodash';
import { ZodBoolean, ZodEnum, ZodError, ZodNumber, ZodOptional, ZodString, z } from 'zod';
import { OrderValueList } from '../constant/dto.constant';
import { BadParameterException } from '../constant/exception.constant';
import { OrderValueType } from '../types';

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

/* DTO로 받은 Type의 Key 값에 대한 유효성 검사를 Optional 여부 구분하여 필수로 구현 */
type ValidateObject<T> = Required<{
  [K in keyof T]: undefined extends T[K]
    ? z.ZodOptional<z.ZodType<Exclude<T[K], undefined>>> | z.ZodDefault<z.ZodTypeAny> | z.ZodEffects<z.ZodTypeAny>
    : z.ZodType<T[K]>;
}>;

/* 유효성 검사 */
export const validateParameter = <T>(data: T, validator: ValidateObject<T>): T => {
  if (!data) data = {} as any;

  try {
    const result = _.omitBy(z.object(validator).parse(data), _.isUndefined);

    return result as T;
  } catch (exception: any) {
    const { errors } = exception as ZodError;

    const badParamList = _.flatten(errors.map((one) => one.path)) as string[];
    const hint = errors.map((one) => `${one.path[0]} - ${one.message}`);

    throw new BadParameterException({ data: { badParamList, hint } });
  }
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
export function validateValueToInt(config?: ValidateValueToInt_Option & { optional?: false }): ZodNumber;
export function validateValueToInt(config: ValidateValueToInt_Option & { optional?: true }): ZodOptional<ZodNumber>;
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

type ValidateValueToBoolean_Option = { optional?: boolean; defaultValue?: boolean };

/* 유효성 검사 - 값이 Boolean 인지 + Boolean 변환   */
export function validateValueToBoolean(config: ValidateValueToBoolean_Option & { optional: false }): ZodBoolean;
export function validateValueToBoolean(
  config: ValidateValueToBoolean_Option & { optional: true },
): ZodOptional<ZodBoolean>;
export function validateValueToBoolean(
  config: ValidateValueToBoolean_Option = { optional: false },
): ZodBoolean | ZodOptional<ZodBoolean> {
  const { optional = false, defaultValue } = config;

  let zodBoolean: any = z.boolean();

  let zodString: any = z
    .string()
    .transform((val) => (val.trim() === '' ? undefined : val))
    .refine((v) => v === 'true' || v === 'false' || v === undefined);

  if (optional) {
    zodString = zodString.optional();
    zodBoolean = zodBoolean.optional();
  }

  if (defaultValue !== undefined) {
    if (defaultValue === true) {
      zodString = zodString.default('true');
      zodBoolean = zodBoolean.default(true);
    }
    if (defaultValue === false) {
      zodString = zodString.default('false');
      zodBoolean = zodBoolean.default(false);
    }
  }

  const schema = z.union([zodBoolean, zodString]).transform((value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;

    if (typeof value === 'boolean' || value === undefined) return value;
  });

  return schema as any;
}

type ValidateValueToOrderValueType_Option = { optional?: boolean; defaultValue?: OrderValueType };

export function validateValueToOrderValueType(
  config?: ValidateValueToOrderValueType_Option & { optional?: false },
): ZodEnum<[OrderValueType, ...OrderValueType[]]>;
export function validateValueToOrderValueType(
  config: ValidateValueToOrderValueType_Option & { optional?: true },
): ZodOptional<ZodEnum<[OrderValueType, ...OrderValueType[]]>>;
export function validateValueToOrderValueType(
  config: ValidateValueToOrderValueType_Option = { optional: false },
): ZodEnum<[OrderValueType, ...OrderValueType[]]> | ZodOptional<ZodEnum<[OrderValueType, ...OrderValueType[]]>> {
  const { optional = false, defaultValue } = config;

  let schema: any = z.enum(OrderValueList as [string, ...string[]]);

  if (optional) {
    schema = schema.optional();
  }

  if (defaultValue !== undefined) {
    schema = schema.default(defaultValue);
  }

  return schema as any;
}
