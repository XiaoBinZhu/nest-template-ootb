import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@R/user/user.module';
import { JwtWrapperModule } from '@/components/jwt/jwt.module';
import { JwtStrategy } from '@/components/jwt/jwt.strategy';
import { JwtAuthGuard } from '@/components/jwt/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { WeixinModule } from './router/weixin/weixin.module';
import { RedisModule } from '@/components/redis/redis.module';
import { LoggerModule } from '@/components/logger/logger.module';
import { ResponseSuccess, ResponseFail } from '@/components/response/response.service';
import { MongodbModule } from '@/components/sql/mongodb/mongodb.module';
// 配置文件
import globalConfg from '@/components/config/index';
// 加载环境变量
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
      load: [
        ...Object.values(globalConfg)
      ],
    }),
    // 注册Jwt
    JwtWrapperModule,
    // redis 模块
    RedisModule,
    // 日志模块
    LoggerModule,
    //数据库
    MongodbModule,
    //下面都是API模块
    UserModule,
    WeixinModule,
  ],
  controllers: [],
  providers: [
    // 全局注入Jwt策略
    JwtStrategy,
    // 全局注册jwt验证守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ResponseSuccess,
    ResponseFail
  ],
  exports: [], // 给其他模块用
})
export class AppModule { }
