import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createWinstonLogger } from './logger.config';

const successLogger = createWinstonLogger('info');
const errorLogger = createWinstonLogger('error');

@Injectable()
export class LoggerService implements NestLoggerService {
    log(message: string, context?: string) {
        successLogger.info(message, { context });
    }

    error(message: string, trace?: string, context?: string) {
        errorLogger.error(`${message}\n${trace ?? ''}`, { context });
    }

    warn(message: string, context?: string) {
        errorLogger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        successLogger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        successLogger.verbose(message, { context });
    }
}