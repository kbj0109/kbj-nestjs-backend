import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';

/** 암호화 */
export const getEncryptValue = (value: string): Promise<string> => {
  return bcrypt.hash(value, 12);
};

/** 암호화 비교 */
export const compareEncryptValue = (value: string, encryptValue: string): Promise<boolean> => {
  return bcrypt.compare(value, encryptValue);
};

/** JWT 토큰 생성 */
export const createJwtToken = (
  data: { [key: string]: any },
  jwtSecretKey: string,
  expiresIn: typeof environment.ACCESS_TOKEN_EXPIRES_IN,
): string => {
  return jwt.sign(data, jwtSecretKey, { algorithm: 'HS256', expiresIn });
};
