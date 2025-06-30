import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongodbService } from './mongodb.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // 💡 MongoDB 动态配置放这里
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                const user = config.get<string>('MONGO_USER');
                const pass = config.get<string>('MONGO_PASS');
                const host = config.get<string>('MONGO_HOST');
                const port = config.get<string>('MONGO_PORT');
                const db = config.get<string>('MONGO_DB');

                const uri = `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`;

                return {
                    uri,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                };
            },
        }),
    ],
    controllers: [],
    providers: [MongodbService],
    exports: [MongodbService], // ✅ 让其他模块（如 user.module）使用
})
export class MongodbModule { }
