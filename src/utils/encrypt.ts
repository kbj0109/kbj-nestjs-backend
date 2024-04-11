import bcrypt from 'bcrypt';

/** 암호화 */
export const getEncryptValue = (value: string): Promise<string> => {
  return bcrypt.hash(value, 12);
};

/** 암호화 비교 */
export const compareEncryptValue = (value: string, encryptValue: string): Promise<boolean> => {
  return bcrypt.compare(value, encryptValue);
};
