import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '@/components/redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private configService: ConfigService, private RedisService: RedisService) {
        // 校验前端传递的token
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从 Authorization 头中获取
            ignoreExpiration: false, // 不忽略过期时间
            secretOrKey: process.env.JWT_SECRET || '1A2b3C4d5E6f7G8h9I0j',
        });
    }

    async validate(payload: any) {
        console.log(payload, 'token');
        const token = await this.RedisService.get(`${payload.username}`);
        if (!token) {
            throw new UnauthorizedException('token 已过期');
        }
        // token验证成功后, 会从token里面解析出用户信息, return的信息会被赋值到express的request对象上, 并且属性固定为user
        return payload;
    }
}
