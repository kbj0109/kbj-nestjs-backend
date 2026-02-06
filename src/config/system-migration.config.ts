import { DataSource } from 'typeorm';
import { DatabaseEnum } from '../constant/enum.constant';
import { getDatabaseConfig } from './database.config';
import { setEnvironment } from './environment.config';

setEnvironment();

const databaseType = process.env.MIGRATION_PATH as DatabaseEnum;
const info = getDatabaseConfig(databaseType);

export default new DataSource({ ...info, logging: true });
