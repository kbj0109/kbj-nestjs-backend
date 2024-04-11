import { getDatabaseConfig } from './database';
import { DataSource } from 'typeorm';
import _ from 'lodash';
import chalk from 'chalk';
import { environment } from './environment';
import { createRandomNumericString, printDeveloperMessage } from '../utils';
import { InternalServerErrorException } from '@nestjs/common';
import dayjs from 'dayjs';
import { DatabaseEnum } from '../constant/enum';

// @ DB의 실제 상태와 코드 상태를 비교하여 알람을 띄우는 기능을 위한 코드들

type ColumnInfo = {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string;
  Extra: string;
};

type AlarmSetting = {
  tableAlarmNotExistInCode?: boolean;
  tableAlarmNotExistInReal?: boolean;
  columnAlarmNotExistInCode?: boolean;
  columnAlarmNotExistInReal?: boolean;
};

const chalkOrange = chalk.hex('#E3CB7E');
const chalkPurple = chalk.hex('#33FFEC');

/** 모든 DB의 실제 상태와 코드 상태를 비교  */
export const checkAllDatabaseSync = async (checkDbSync: boolean): Promise<void> => {
  if (!environment.IS_LOCAL) return;
  if (environment.IS_TEST) return;
  if (!checkDbSync) return;

  await checkDatabaseSync(DatabaseEnum.KBJ);

  const message = `*** All DB Sync Check is Completed at ${environment.SERVER_ENV} with ${environment.NODE_ENV} .env`;
  printDeveloperMessage(message);
};

/** 실제 사용 DB와 코드상의 DB 상태를 비교 */
const checkDatabaseSync = async (type: DatabaseEnum, option?: AlarmSetting): Promise<void> => {
  const dbConfig = { ...getDatabaseConfig(type), logging: false };
  const tempDatabaseName = type + `_only_temp_for_${environment.NODE_ENV}_${createRandomNumericString(5)}`;

  // 1. 임시 DB 를 위한 config를 생성
  const newDbConfig = ((): ReturnType<typeof getDatabaseConfig> => {
    const item = _.cloneDeep(dbConfig) as any;
    item.replication.master.database = tempDatabaseName;
    item.replication.slaves[0].database = tempDatabaseName;
    item.synchronize = true;

    // 테스트는 Local DB만 사용
    item.replication.master.host = environment.DB_WRITER_HOST;
    item.replication.master.port = environment.DB_WRITER_PORT;
    item.replication.master.username = environment.DB_WRITER_USERNAME;
    item.replication.master.password = environment.DB_WRITER_PASSWORD;
    item.replication.slaves[0].host = environment.DB_READER_HOST;
    item.replication.slaves[0].port = environment.DB_READER_PORT;
    item.replication.slaves[0].username = environment.DB_READER_USERNAME;
    item.replication.slaves[0].password = environment.DB_READER_PASSWORD;

    return item;
  })();

  let localDataSource: DataSource | null = null; // Local에 임시 DB를 생성하는 커넥션
  let orgDataSource: DataSource | null = null; // 비교하려는 DB
  let tempDataSource: DataSource | null = null; // 임시 DB

  try {
    // 테스트에 사용할 Local DB에 임시 DB 생성
    localDataSource = await new DataSource({ ...getDatabaseConfig(DatabaseEnum.KBJ), logging: false }).initialize();
    await dropDatabase(localDataSource, tempDatabaseName);
    await createDatabase(localDataSource, tempDatabaseName);

    // 1. 기존 DB를 연결해서 임시 DB를 생성 후 연결
    orgDataSource = await new DataSource(dbConfig).initialize();
    tempDataSource = await new DataSource(newDbConfig).initialize();

    // 2. 실제 DB의 테이블 목록과 임시 DB의 테이블 목록을 비교한다
    const shareTableList = await compareTablesInTwoDatabase(orgDataSource, tempDataSource, option);

    for (const tableName of shareTableList) {
      // 3. 컬럼 유무 비교
      await compareColumnsInTwoTable(orgDataSource, tempDataSource, tableName, option);
    }
  } catch (err) {
    console.log(err);
    printDeveloperMessage(
      `!!! Exception on Checking ${type} DB SYNC at ${environment.SERVER_ENV} with ${environment.NODE_ENV} .env`,
    );
  }

  // 5. 임시 DB를 삭제한다
  if (localDataSource) {
    await dropDatabase(localDataSource, tempDatabaseName);
    await deleteAllTempDatabases(localDataSource); // 생성되다가 정리되지 않은 임시 DB가 있을 수 있으므로 모두 삭제
    await localDataSource.destroy();
  }
  await tempDataSource?.destroy();
  await orgDataSource?.destroy();
};

/** DB 생성 */
const createDatabase = async (dataSource: DataSource, databaseName: string): Promise<void> => {
  const queryRunner = await dataSource.createQueryRunner();
  await queryRunner.createDatabase(databaseName);
  await queryRunner.release();
};

/** 임시 DB 삭제 */
const dropDatabase = async (dataSource: DataSource, databaseName: string): Promise<void> => {
  if (!databaseName.includes('temp')) {
    throw new InternalServerErrorException({ message: 'Only Temp Database Can Be Deleted' });
  }
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.dropDatabase(databaseName, true);
  await queryRunner.release();
};

/** 특정 DB의 테이블 목록 가져오기 */
const getTableListFromDB = (dataSource: DataSource): Promise<string[]> => {
  return dataSource.query('SHOW TABLES').then((list) => {
    return list.map((one: any) => Object.values(one)[0]);
  });
};

/** 특정 DB 테이블의 컬럼 목록 가져오기 */
const getColumnListFromTable = async (dataSource: DataSource, tableName: string): Promise<ColumnInfo[]> => {
  const columnList = (await dataSource.query(`SHOW COLUMNS FROM ${tableName}`)) as ColumnInfo[];
  return columnList;
};

/** 2개 DB의 테이블 유무를 비교 후 알람 + 같은 테이블 리턴 */
const compareTablesInTwoDatabase = async (
  orgDataSource: DataSource,
  tempDataSource: DataSource,
  option?: Pick<AlarmSetting, 'tableAlarmNotExistInCode' | 'tableAlarmNotExistInReal'>,
): Promise<string[]> => {
  const dbName = orgDataSource.driver.database;
  const { tableAlarmNotExistInCode = true, tableAlarmNotExistInReal = true } = option || {};

  const orgTableNameList = (await getTableListFromDB(orgDataSource)).filter((one) => one !== 'migrations');
  const tempTableNameList = await getTableListFromDB(tempDataSource);

  const shareTableList = _.intersection(orgTableNameList, tempTableNameList);

  const existAtRealNotCode = orgTableNameList.filter((one) => !shareTableList.includes(one));
  if (tableAlarmNotExistInCode && existAtRealNotCode.length > 0) {
    console.log(chalkOrange(`!!! ${dbName} - 실제 있는데 코드에 없는 테이블`));
    console.log(existAtRealNotCode);
    console.log();
  }

  const existAtCodeNotReal = tempTableNameList.filter((one) => !shareTableList.includes(one));
  if (tableAlarmNotExistInReal && existAtCodeNotReal.length > 0) {
    console.log(chalkPurple(`!!! ${dbName} - 실제 없는데 코드에 있는 테이블`));
    console.log(existAtCodeNotReal);
    console.log();
  }

  return shareTableList;
};

/** 2개 테이블의 컬럼 유무를 비교 후 알람 */
const compareColumnsInTwoTable = async (
  orgDataSource: DataSource,
  tempDataSource: DataSource,
  tableName: string,
  option?: Pick<AlarmSetting, 'columnAlarmNotExistInCode' | 'columnAlarmNotExistInReal'>,
): Promise<void> => {
  const { columnAlarmNotExistInCode = true, columnAlarmNotExistInReal = true } = option || {};
  const dbName = orgDataSource.driver.database;

  const orgColumnList = await getColumnListFromTable(orgDataSource, tableName);
  const tempColumnList = await getColumnListFromTable(tempDataSource, tableName);

  const shareColumnNameList = _.intersectionBy(orgColumnList, tempColumnList, 'Field').map((one) => one.Field);

  // 1. 컬럼 유무 비교
  {
    const orgColumnNameList = orgColumnList.map((one) => one.Field);
    const tempColumnNameList = tempColumnList.map((one) => one.Field);

    const existAtRealNotCode = orgColumnNameList.filter((one) => !shareColumnNameList.includes(one));
    const existAtCodeNotReal = tempColumnNameList.filter((one) => !shareColumnNameList.includes(one));

    if (existAtRealNotCode.length > 0 && columnAlarmNotExistInCode) {
      const message = chalkOrange(`!!! ${dbName}.${tableName} 실제 있는데 코드에 없는 컬럼 - `);
      console.log(message, existAtRealNotCode);
    }
    if (existAtCodeNotReal.length > 0 && columnAlarmNotExistInReal) {
      const message = chalkPurple(`!!! ${dbName}.${tableName} 실제 없는데 코드에 있는 컬럼 - `);
      console.log(message, existAtCodeNotReal);
    }
  }

  // 2. 공통 컬럼 비교
  {
    const orgColumnInfoList = orgColumnList.filter((one) => shareColumnNameList.includes(one.Field));
    const tempColumnInfoList = tempColumnList.filter((one) => shareColumnNameList.includes(one.Field));

    shareColumnNameList.forEach((columnName) => {
      const orgColumnInfo = orgColumnInfoList.find((one) => one.Field === columnName)!;
      const tempColumnInfo = tempColumnInfoList.find((one) => one.Field === columnName)!;

      const isEqual = _.isEqual(orgColumnInfo, tempColumnInfo);
      if (isEqual) {
        return;
      }

      const message = chalkOrange(`!!! ${dbName}.${tableName}.${columnName} 컬럼 - `);
      const difference: string[] = [];
      Object.keys(orgColumnInfo).forEach((key) => {
        const orgColumnValue = orgColumnInfo[key as keyof ColumnInfo];
        const tempColumnValue = tempColumnInfo[key as keyof ColumnInfo];

        // # 인덱싱 차이는 무시
        if (key === 'Key' && orgColumnValue === 'MUL' && tempColumnValue === '') return;

        if (orgColumnValue !== tempColumnValue) {
          difference.push(`${key}: 실제는 '${orgColumnValue}' / 코드는 '${tempColumnValue}' `);
        }
      });

      if (difference.length > 0) {
        console.log(message, difference);
      }
    });
  }
};

/** 이전 Temp DB 들을 찾아서 제거 */
const deleteAllTempDatabases = async (dataSource: DataSource): Promise<void> => {
  // 1. 현재 존재하는 모든 Temp DB 가져오기
  const query = `
    SELECT TABLE_SCHEMA AS databaseName, MAX(create_time) AS createdAt
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA LIKE '%only_temp%'
    GROUP BY databaseName
    ORDER BY createdAt ASC
  `;
  const list = (await dataSource.query(query)) as { databaseName: string; createdAt: Date }[];

  // 2. 10시간 이상된 Temp DB 삭제
  for (const item of list) {
    const { databaseName, createdAt } = item;

    const isTempDatabase = databaseName.includes('only_temp');
    const isOldTempDatabase = new Date(createdAt) < dayjs(new Date()).subtract(3, 'hour').toDate();

    if (isTempDatabase && isOldTempDatabase) {
      await dropDatabase(dataSource, databaseName);
    }
  }
};
