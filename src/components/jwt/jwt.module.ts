// src/components/jwt/jwt.module.ts
import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { RedisModule } from '@/components/redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule, // 必须引入，才能在 registerAsync 里注入 ConfigService
        NestJwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get('JWT_SECRET') || 'default-secret',
                }
            },
        }),
        RedisModule,
    ],
    providers: [JwtService],
    exports: [JwtService],
})
export class JwtWrapperModule { }