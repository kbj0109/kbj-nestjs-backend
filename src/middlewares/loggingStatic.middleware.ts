import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

@Injectable()
export class LoggingStaticMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = new Date();

    res.on('finish', () => {
      const spentTime = new Date().getTime() - startTime.getTime();

      let statusCode = res.statusCode.toString();
      if (statusCode.startsWith('2')) {
        statusCode = chalk.green(statusCode);
      }
      if (statusCode.startsWith('3')) {
        statusCode = chalk.cyanBright(statusCode);
      }
      if (statusCode.startsWith('4')) {
        statusCode = chalk.yellow(statusCode);
      }
      if (statusCode.startsWith('5')) {
        statusCode = chalk.red(statusCode);
      }

      console.log(`[static]`, `${statusCode}`, `${req.method}`, `${req.originalUrl}`, spentTime, 'ms');
    });

    next();
  }
}
