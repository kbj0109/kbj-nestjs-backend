import * as dotenv from 'dotenv';
dotenv.config();

export const setEnvironment = () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
};
