// 全局响应拦截
import {
    Injectable,
    NestInterceptor,
    CallHandler,
    Catch,
    ExceptionFilter,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { SKIP_RS_INTERCEPTOR } from '@decorators';
// 引入日志服务
import { LoggerService } from '@/components/logger/logger.service';
import { cleanParams } from '@/utils/index';
interface Data<T> {
    data: T;
}

/** @name 通过拦截器统一响应格式 **/
@Injectable()
export class ResponseSuccess<T = any> implements NestInterceptor {
    constructor(private readonly reflector: Reflector, private readonly logger: LoggerService,) { }
    intercept(context, next: CallHandler): Observable<Data<T>> {
        const http = context.switchToHttp();
        const req: Request = http.getRequest();
        // 获取Metadata自定义元数据
        const skipInterceptor = this.reflector.get<boolean>(
            SKIP_RS_INTERCEPTOR,
            context.getHandler(),
        );
        if (skipInterceptor) {
            // 特殊的请求直接跳过拦截器
            return next.handle();
        }
        return next.handle().pipe(
            map((response) => {
                const { code, data, message } = response;
                const method = req.method;
                const url = req.originalUrl || req.url;
                const params = {
                    query: req.query,
                    body: req.body,
                };
                this.logger.log(
                    `Success: ${method} ${url}\nParams: ${JSON.stringify(cleanParams(params))}`,
                    'ResponseSuccess',
                );
                // 在具体业务中也可以自行定制code
                if (response.code) {
                    return {
                        data,
                        code,
                        message,
                        success: true,
                    };
                } else {
                    return {
                        data: message ? data : response,
                        code: 200,
                        message: message || 'success',
                        success: true,
                    };
                }
            }),
        );
    }
}

@Catch()
export class ResponseFail implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) { }
    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const res = exception.getResponse();

            // 如果是字符串类型错误
            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object' && res && (res as any).message) {
                // 如果是 { message: string | string[] }
                const msg = (res as any).message;
                message = Array.isArray(msg) ? msg.join('; ') : msg;
                // ✅ 提取错误字段（如果有）
                if ((res as any).errors) {
                    errors = (res as any).errors;
                }
            } else {
                message = exception.message || message;
            }
        } else if (exception && typeof exception === 'object') {
            message = exception.message || message;
        }
        // ✅ 打日志
        const method = request.method;
        const url = request.originalUrl || request.url;
        const params = {
            query: request.query,
            body: request.body,
            headers: request.headers,
        };
        this.logger.error(
            `Request: ${method} ${url}\nParams: ${JSON.stringify(cleanParams(params))}\nMessage: ${message}`,
            exception.stack,
            'GlobalException',
        );
        response.status(status).json({
            code: status,
            message,
            success: false,
            path: request.url,
            timestamp: new Date().getTime(),
            ...(errors ? { errors } : {}),
        });
    }
}