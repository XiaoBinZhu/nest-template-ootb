import { registerAs } from '@nestjs/config';
import validateConfig from '@/utils/validate-config';
import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export type redisConfig = {
    host: string;
    port: number;
    password: string
};

class EnvironmentVariablesValidator {
    @IsString()
    @IsOptional()
    host: string;

    @IsInt()
    @Min(0)
    @Max(99999)
    @IsOptional()
    port: number;

    @IsString()
    @IsOptional()
    password: string;

}

export default registerAs<redisConfig>('redis', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);
    return {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || '',
    };
});
