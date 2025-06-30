import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const logDir = path.join(process.cwd(), 'logs');

export const createWinstonLogger = (level: string) => {
    return winston.createLogger({
        level,
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, context }) => {
                return `[${timestamp}] [${level}]${context ? ' [' + context + ']' : ''} ${message}`;
            }),
        ),
        transports: [
            new winston.transports.DailyRotateFile({
                level,
                dirname: `${logDir}/${level}`,
                filename: `%DATE%.log`,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: false,
                maxSize: '20m',
                maxFiles: '14d',
            }),
        ],
    });
};
