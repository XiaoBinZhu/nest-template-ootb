// src/redis/redis.service.ts
import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import { Redis, type RedisKey } from 'ioredis';
@Injectable()
export class RedisService {
    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis, // 注入配置好的实例
    ) { }

    // 获取redis
    async get<T = any>(key: string): Promise<T | null> {
        try {
            const res = await this.redis.get(key);
            if (res === null) return null;

            try {
                return JSON.parse(res) as T;
            } catch {
                return res as T;
            }
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    // 设置redis - 支持多种数据类型和过期时间
    async set(key: string, value: any, seconds: number = 10000): Promise<'OK'> {
        try {
            const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);

            if (seconds > 0) {
                // 使用 setex 方法设置带过期时间的值
                return await this.redis.setex(key, Math.ceil(seconds), valueToStore);
            }

            return await this.redis.set(key, valueToStore);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    // 删除redis - 支持单个或多个键
    async delete(key: RedisKey | RedisKey[]): Promise<number> {
        try {
            const keys = Array.isArray(key) ? key : [key];
            return await this.redis.del(...keys);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    // 检查连接是否正常
    async checkConnection(): Promise<boolean> {
        try {
            await this.redis.ping();
            return true;
        } catch {
            return false;
        }
    }

    // 获取剩余过期时间（毫秒）
    async getTtl(key: string): Promise<number> {
        const ttlSeconds = await this.redis.ttl(key);
        return ttlSeconds > 0 ? ttlSeconds * 1000 : ttlSeconds;
    }

    // 发布消息
    async publish(channel: string, message: any): Promise<number> {
        const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
        return this.redis.publish(channel, messageToSend);
    }

    // 订阅频道（返回订阅实例）
    createSubscriber() {
        return this.redis.duplicate();
    }
}