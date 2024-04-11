import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database';
import { setEnvironment } from './environment';
import { DatabaseEnum } from '../constant/enum';

setEnvironment();

const databaseType = process.env.MIGRATION_PATH as DatabaseEnum;
const info = getDatabaseConfig(databaseType);

export default new DataSource({ ...info, logging: true });
