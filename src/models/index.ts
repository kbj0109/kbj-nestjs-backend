import { NotFoundException, Type } from '@nestjs/common';
import _ from 'lodash';
import {
  DataSource,
  FindOneOptions,
  FindOptionsWhere,
  FindOptionsWhereProperty,
  In,
  IsNull,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import {
  QuerySelectOption,
  QueryTransactionOption,
  QueryListOption,
  SomeToOptional,
  NotEmpty,
  OptionalToNullable,
  QueryOrderOption,
} from '../types';
import { setNullToIsNull } from '../utils/database';

// @ d.ts 파일에 있으면 모종의 이유로 타입 체크와 상속이 제대로 안되는 경우가 있어서 여기로 옮김
/** Condition 조건 중 undefined | string | number | boolean | Date 타입들에 TypeOrm 기존의 여러 조건을 허용 */
type PropertiesToFindOperator<T> = {
  [K in keyof T]: T[K] extends undefined | string | number | boolean | Date
    ? FindOptionsWhereProperty<Required<T>[K]> | T[K]
    : T[K];
};

export class BaseRepository<T extends ObjectLiteral, EntityAllJoined extends ObjectLiteral> {
  protected readonly repository: Repository<EntityAllJoined>;

  private readonly DeletedDateColumnExist: boolean = false; // DeleteDateColumn 존재 여부
  private readonly DeletedDateColumnPropertyPath?: string; // DeleteDateColumn 컬럼명

  constructor(dataSource: DataSource, entity: Type) {
    this.repository = dataSource.getRepository(entity);

    if (this.repository.metadata.deleteDateColumn) {
      this.DeletedDateColumnExist = true;
      this.DeletedDateColumnPropertyPath = this.repository.metadata.deleteDateColumn.propertyPath;
    }
  }

  /** 단일 등록 */
  createOne = async (
    data: SomeToOptional<T, 'id' | 'createdAt' | 'updatedAt'>,
    option?: QueryTransactionOption,
  ): Promise<T> => {
    const [item] = await this.createMany([data], option);
    return item;
  };

  /** 다중 등록 */
  createMany = async (
    dataList: SomeToOptional<T, 'id' | 'createdAt' | 'updatedAt'>[],
    option?: QueryTransactionOption,
  ): Promise<T[]> => {
    if (!dataList.length) return [];

    const { transaction } = option || {};

    if (transaction) {
      const itemList = transaction.manager.create(this.repository.target, dataList as T[]); // # 편의상 Type 비틀기
      await transaction.manager.insert(this.repository.target, itemList);
      return itemList;
    }

    const itemList = this.repository.create(dataList as any[]); // # 편의상 Type 비틀기
    await this.repository.insert(itemList);
    return itemList as any[]; // # 편의상 Type 비틀기
  };

  /** 단일 읽기 */
  readOne = <K extends keyof T>(
    condition: Partial<OptionalToNullable<PropertiesToFindOperator<T>>> = {},
    option?: QueryTransactionOption & QuerySelectOption<K> & QueryOrderOption<T> & Pick<FindOneOptions, 'withDeleted'>,
  ): Promise<Pick<T, K> | null> => {
    const { transaction, select, order, withDeleted } = option || {};

    const where = setNullToIsNull(condition) as FindOptionsWhere<T>;
    const allCondition = { where, select, order, withDeleted };

    if (transaction) {
      return transaction.manager.findOne(this.repository.target, allCondition);
    }

    return this.repository.findOne(allCondition as any) as any; // # 편의상 Type 비틀기
  };

  /** 다중 읽기 */
  readMany = <K extends keyof T>(
    condition: Partial<OptionalToNullable<PropertiesToFindOperator<T>>> = {},
    option?: QueryTransactionOption &
      QuerySelectOption<K> &
      QueryOrderOption<T> &
      Pick<FindOneOptions, 'withDeleted'> &
      QueryListOption,
  ): Promise<Pick<T, K>[]> => {
    const { transaction, skip, take, select, order, withDeleted } = option || {};

    const where = setNullToIsNull(condition) as FindOptionsWhere<T>;
    const allCondition = { where, skip, take, select, order, withDeleted };

    if (transaction) {
      return transaction.manager.find(this.repository.target, allCondition);
    }

    return this.repository.find(allCondition as any) as any; // # 편의상 Type 비틀기
  };

  /** ID 로 다중 읽기 */
  readManyByIds = <K extends keyof T>(
    idList: T['id'][],
    option?: QueryTransactionOption &
      QuerySelectOption<K> &
      QueryOrderOption<T> &
      Pick<FindOneOptions, 'withDeleted'> &
      QueryListOption,
  ): Promise<Pick<T, K>[]> => {
    if (!idList.length) return Promise.resolve([]);

    const { transaction, skip, take, select, order, withDeleted } = option || {};

    const where = { id: In(idList) } as FindOptionsWhere<any>;
    const allCondition = { where, skip, take, select, order, withDeleted };

    if (transaction) {
      return transaction.manager.find(this.repository.target, allCondition);
    }

    return this.repository.find(allCondition as any) as any; // # 편의상 Type 비틀기
  };

  /** 다중 수정 */
  update = async (
    condition: NotEmpty<OptionalToNullable<PropertiesToFindOperator<T>>>,
    data: Partial<OptionalToNullable<T>>,
    option?: QueryTransactionOption & Pick<FindOneOptions, 'withDeleted'>,
  ): Promise<number> => {
    if (_.isEmpty(condition) || _.isEmpty(data)) return 0;

    const { transaction, withDeleted } = option || {};

    const where = setNullToIsNull(condition) as FindOptionsWhere<EntityAllJoined>;
    if (this.DeletedDateColumnExist && withDeleted !== true) {
      (where[this.DeletedDateColumnPropertyPath!] as any) = IsNull();
    }

    if (transaction) {
      const { affected } = await transaction.manager.update(
        this.repository.target,
        where,
        data as Partial<EntityAllJoined>,
      );
      return affected || 0;
    }

    const { affected } = await this.repository.update(where, data as Partial<EntityAllJoined>);
    return affected || 0;
  };

  /** ID 로 다중 수정 */
  updateByIds = (
    idList: T['id'][],
    data: Partial<OptionalToNullable<T>>,
    option?: QueryTransactionOption & Pick<FindOneOptions, 'withDeleted'>,
  ): Promise<number> => {
    if (!idList.length || _.isEmpty(data)) return Promise.resolve(0);

    return this.update({ id: In(idList) } as any, data, option);
  };

  /** 다중 삭제 */
  delete = async (
    condition: NotEmpty<OptionalToNullable<PropertiesToFindOperator<T>>>,
    option?: QueryTransactionOption & Pick<FindOneOptions, 'withDeleted'>,
  ): Promise<number> => {
    if (_.isEmpty(condition)) return 0;

    const { transaction, withDeleted } = option || {};
    const where = setNullToIsNull(condition) as FindOptionsWhere<EntityAllJoined>;

    // DeleteDateColumn 이 설정되어 있는데, withDeleted 가 true 아니라면, softDelete
    if (this.DeletedDateColumnExist && withDeleted !== true) {
      if (transaction) {
        const { affected } = await transaction.manager.softDelete(this.repository.target, where);
        return affected || 0;
      }

      const { affected } = await this.repository.softDelete(where);
      return affected || 0;
    }

    if (transaction) {
      const { affected } = await transaction.manager.delete(this.repository.target, where);
      return affected || 0;
    }

    const { affected } = await this.repository.delete(where);
    return affected || 0;
  };

  /** ID 로 다중 삭제 */
  deleteByIds = (
    idList: T['id'][],
    option?: QueryTransactionOption & Pick<FindOneOptions, 'withDeleted'>,
  ): Promise<number> => {
    if (!idList.length) return Promise.resolve(0);

    return this.delete({ id: In(idList) } as any, option);
  };

  /** 숫자 카운팅 */
  count = (
    condition: Partial<OptionalToNullable<PropertiesToFindOperator<T>>> = {},
    option?: QueryTransactionOption & Pick<FindOneOptions, 'withDeleted'> & QueryListOption,
  ): Promise<number> => {
    const { transaction, skip, take, withDeleted } = option || {};

    const where = setNullToIsNull(condition);
    const allCondition = { where, skip, take, withDeleted };

    if (transaction) {
      return transaction.manager.count(this.repository.target, allCondition);
    }

    return this.repository.count(allCondition as any);
  };

  /** 조건에 해당하는 것 1개를 무조건 가져오기 */
  confirmOne = async <K extends keyof T>(
    condition: Partial<OptionalToNullable<PropertiesToFindOperator<T>>> = {},
    option?: QueryTransactionOption & QuerySelectOption<K> & QueryOrderOption<T> & Pick<FindOneOptions, 'withDeleted'>,
  ): Promise<Pick<T, K>> => {
    const item = await this.readOne(condition, option);
    if (!item) throw new NotFoundException({ message: `${this.repository.metadata.name} Not Found` });

    return item;
  };

  /** Upsert 1개 */
  upsertOne = async (
    condition: NotEmpty<OptionalToNullable<PropertiesToFindOperator<T>>>,
    data: SomeToOptional<T, 'id' | 'createdAt' | 'updatedAt'>,
    option?: QueryTransactionOption & Pick<FindOneOptions, 'withDeleted'>,
  ): Promise<T> => {
    const item = await this.readOne(condition, option);

    if (item) {
      await this.update({ id: item.id } as any, data as any, option);
      return this.confirmOne({ id: data.id || item.id } as any, option) as Promise<T>;
    }

    return this.createOne(data, option);
  };

  /** 다중 읽기 + 카운팅 (카운팅은 페이지네이션 설정 없이) */
  readManyAndTotalCount = async <K extends keyof T>(
    condition: Partial<OptionalToNullable<PropertiesToFindOperator<T>>> = {},
    option?: QueryTransactionOption &
      QuerySelectOption<K> &
      QueryOrderOption<T> &
      Pick<FindOneOptions, 'withDeleted'> &
      QueryListOption,
  ): Promise<{ list: Pick<T, K>[]; totalCount: number }> => {
    const { transaction, skip, take, select, order, withDeleted } = option || {};

    const where = setNullToIsNull(condition) as FindOptionsWhere<T>;
    const allCondition = { where, skip, take, select, order, withDeleted };

    if (transaction) {
      const [list, totalCount] = await Promise.all([
        transaction.manager.find(this.repository.target, allCondition),
        transaction.manager.count(this.repository.target, { where, withDeleted }),
      ]);

      return { list, totalCount };
    }

    const [list, totalCount] = await Promise.all([
      this.repository.find(allCondition as any) as any, // # 편의상 Type 비틀기
      this.repository.count({ where: where as any, withDeleted }),
    ]);

    return { list, totalCount };
  };
}
