import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { SKIP_PUBLIC_TOKEN_GUARD } from '@decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    /**
     * @name: 该守护用于验证token
     * @description: 每个守护必须实现该方法，返回一个布尔值，是否允许当前请求。https://nest.nodejs.cn/guards
     */
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // 校验是否是公共路由
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            SKIP_PUBLIC_TOKEN_GUARD,
            [context.getHandler(), context.getClass()],
        );
        // 公共路由直接跳过
        if (isPublic) return true;
        // 校验token
        return super.canActivate(context);
    }

    /**
     * @name: super.canActivate(context)验完成后调用
     * @description: 验完成后调用
     * @param {*} error 这是 Passport 策略执行过程中发生的任何潜在错误。如果在验证过程中没有错误发生，这个值通常是 null
     * @param {*} user 这是 Passport 策略验证成功后返回的用户对象。如果验证失败，这个值可能是 false 或 null，具体取决于你使用的 Passport 策略
     * @param {*} info 如果验证失败，info通常是一个error对象
     */
    handleRequest(error, user, info) {
        if (info || error)
            throw new UnauthorizedException('token校验失败，token已经过期');
        if (!user) throw new NotFoundException('用户不存在');
        return user;
    }
}
