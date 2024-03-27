import { NotImplementedException, Provider } from '@nestjs/common';
import path from 'path';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { DatabaseEnum } from '../constant/enum';
import { environment } from './environment';
import { getEnvironmentByAddress, printDeveloperMessage } from '../utils';
import { DateTimezone } from '../constant/date';

export const connectDatabase = (type: DatabaseEnum): Provider => {
  const dbConfig = getDatabaseConfig(type);
  const dbEnvironment = getEnvironmentByAddress(dbConfig.replication?.master.host || '');

  return {
    provide: type,
    useValue: new DataSource(dbConfig)
      .initialize()
      .then((dataSource) => {
        printDeveloperMessage(`*** Database ${dataSource.driver.database} Connected at ${dbEnvironment}`);
        return dataSource;
      })
      .catch((error) => {
        console.log(error);
        printDeveloperMessage(`!!! Database ${type} Not Connected at ${dbEnvironment}`, 0);
      }),
  };
};

export const getDatabaseConfig = (type: DatabaseEnum): MysqlConnectionOptions => {
  const entityPath = path.join(environment.MAIN_FOLDER_PATH, `./models/${type}/**/*.{js,ts}`);
  const migrations = path.join(environment.MAIN_FOLDER_PATH, `./models/migrations/${type}/**/*.{js,ts}`);

  const defaultConfig = {
    name: type,
    synchronize: false,
    entities: [entityPath],
    timezone: DateTimezone.KST,
    logging: environment.DB_FULL_QUERY_LOG,
    maxQueryExecutionTime: 3000, // slow query 기준 (기본 <= 5000ms) by john

    migrations: [migrations], // Migration 파일 경로
    migrationsRun: false, // Migration 자동 실행 여부
    migrationsTableName: 'migrations', // Migration 기록되는 테이블 이름
  };

  if (type === DatabaseEnum.KBJ) {
    return {
      ...defaultConfig,
      type: 'mysql',
      replication: {
        master: {
          host: environment.DB_WRITER_HOST,
          port: environment.DB_WRITER_PORT,
          database: environment.DB_DATABASE,
          username: environment.DB_WRITER_USERNAME,
          password: environment.DB_WRITER_PASSWORD,
        },
        slaves: [
          {
            host: environment.DB_READER_HOST || environment.DB_WRITER_HOST,
            port: environment.DB_READER_PORT || environment.DB_WRITER_PORT,
            database: environment.DB_DATABASE,
            username: environment.DB_READER_USERNAME || environment.DB_WRITER_USERNAME,
            password: environment.DB_READER_PASSWORD || environment.DB_WRITER_PASSWORD,
          },
        ],
        selector: 'RR',
      },
    };
  }

  throw new NotImplementedException();
};
