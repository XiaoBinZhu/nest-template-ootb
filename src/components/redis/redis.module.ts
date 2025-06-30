// src/redis/redis.module.ts
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_CLIENT } from './redis.constants';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        let { host, port, password } = configService.get('redis')
        return new Redis({
          host,
          port,
          password,
        });
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule { }
