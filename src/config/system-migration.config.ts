import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database.config';
import { setEnvironment } from './environment.config';
import { DatabaseEnum } from '../constant/enum.constant';

setEnvironment();

const databaseType = process.env.MIGRATION_PATH as DatabaseEnum;
const info = getDatabaseConfig(databaseType);

export default new DataSource({ ...info, logging: true });
