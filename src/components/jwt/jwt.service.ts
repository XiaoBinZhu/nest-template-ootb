import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { RedisService } from '@/components/redis/redis.service';

@Injectable()
export class JwtService {
    constructor(private readonly jwtService: NestJwtService, private readonly redisService: RedisService) {
    }

    createToken(payload: any, time: number = 1 * 24 * 60 * 60): string {
        const dto = {
            username: payload.userName || payload.email || payload.phoneNumber,
            type: payload.type,
        };
        const token = `Bearer ${this.jwtService.sign(dto)}`
        this.redisService.set(dto.username, token, time);
        return token;
    }

    verifyToken(token: string) {
        if (!token) return null;
        try {
            return this.jwtService.verify(token.replace(/^Bearer\s/, ''));
        } catch (e) {
            return null;
        }
    }
}
