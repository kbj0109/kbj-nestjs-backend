import { FindOptionsOrder } from 'typeorm';

export {};

/**
 * 모든 값이 제거 가능한 Omit 보다는 한정된, 존재하기로 명시된 값만 제거
 * type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
 * */
export type OmitExact<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** 일반적으로 직접 입력이 필요 없는 데이터 제외 */
export type OnlyData<T> = OmitExact<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

/** 최소 Object 내 속성값 하나는 빈값이 아니어야 한다 */
export type NotEmpty<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

/** 특정 속성들을 Optional 값으로 변경 */
export type SomeToOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Optional 값을 nullable 하게 변경 */
// type OptionalToNullable<T> = {
//   [K in keyof T]: undefined extends T[K] ? T[K] | null : T[K];
// };
export type OptionalToNullable<T> = {
  [K in keyof T]: undefined extends T[K] ? T[K] | null : T[K];
};

/** 기본 DB 쿼리 옵션 */
export type QueryTransactionOption = { transaction?: QueryRunner };
export type QueryListOption = { skip?: number; take?: number };
export type QuerySelectOption<T> = { select?: T[] };
export type QueryOrderOption<T> = { order?: FindOptionsOrder<T> };
