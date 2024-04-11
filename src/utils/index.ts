import chalk from 'chalk';
import { DateTimezone } from '../constant/date';
import { NodeEnvEnum, ServerEnvEnum } from '../constant/enum';

/** 글자에서 특정 텍스트를 다른 텍스트로 교체 */
export const replaceText = (value: string, from: string, to: string): string => {
  return (value || '').split(from).join(to);
};

/** 개발자용 알람 */
export const printDeveloperMessage = (message: string, delay = 300): void => {
  let newMessage = replaceText(message, ServerEnvEnum.Local, chalk.cyanBright(ServerEnvEnum.Local));
  newMessage = replaceText(newMessage, NodeEnvEnum.Development, chalk.green(NodeEnvEnum.Development));
  newMessage = replaceText(newMessage, ServerEnvEnum.Staging, chalk.hex('#ff8700')(ServerEnvEnum.Staging));
  newMessage = replaceText(newMessage, ServerEnvEnum.Production, chalk.redBright(ServerEnvEnum.Production));

  newMessage = replaceText(newMessage, DateTimezone.UTC, chalk.yellow(DateTimezone.UTC));
  newMessage = replaceText(newMessage, DateTimezone.KST, chalk.yellow(DateTimezone.KST));

  setTimeout(() => console.log(newMessage), delay);
};

/** 주소로 환경을 판별 */
export const getEnvironmentByAddress = (address: string): ServerEnvEnum => {
  const addr = address.toLowerCase();

  if (addr.includes('localhost') || addr.includes('127.0.0.1')) {
    return ServerEnvEnum.Local;
  }

  if (addr.includes(ServerEnvEnum.Staging.toLowerCase())) {
    return ServerEnvEnum.Staging;
  }

  return ServerEnvEnum.Production;
};
