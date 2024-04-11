import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';
import { InvalidTokenException } from '../constant/exception';

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
  expiresIn: typeof environment.ACCESS_TOKEN_EXPIRES_IN,
): string => {
  return jwt.sign(data, environment.JWT_SECRET_KEY, { algorithm: 'HS256', expiresIn });
};

/** JWT 토큰 해석 */
export const openJwtToken = (token: string, jwtSecretKey: string): { [key: string]: any; iat: number; exp: number } => {
  try {
    return <any>jwt.verify(token, jwtSecretKey, { algorithms: ['HS256'], ignoreExpiration: true });
  } catch (err) {
    throw new InvalidTokenException();
  }
};
