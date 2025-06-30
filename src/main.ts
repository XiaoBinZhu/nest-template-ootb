import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import validationOptions from '@/components/validation/validation.server';
import { ResponseSuccess, ResponseFail } from '@/components/response/response.service';
import redoc from 'redoc-express'; // ✅ 正确导入方式
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  // 全局数据校验
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  // 响应格式拦截器
  app.useGlobalInterceptors(app.get(ResponseSuccess));
  // 异常过滤器
  app.useGlobalFilters(app.get(ResponseFail));
  // 全局前缀
  app.setGlobalPrefix('api');
  // 配置Swagger
  const options = new DocumentBuilder()
    .setTitle('API项目') // 文档标题
    .setDescription('接口文档') // 文档描述
    .setVersion('1.0.0') // 版本号
    .addTag('Nestjs Swagger')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      schema: {
        example: 'en',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  // 导出 swagger.json
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  // 原 Swagger 页面
  SwaggerModule.setup('docs', app, document);
  // 添加 Redoc UI 页面
  app.use(
    '/redoc',
    redoc({
      title: 'Redoc 文档',
      specUrl: '/swagger-json',
      redocOptions: {
        theme: { colors: { primary: { main: '#1abc9c' } } },
      },
    }),
  );
  // 提供 swagger.json
  app.use('/swagger-json', (req, res) => res.json(document));
  await app.listen(configService.get('app').port);
}
void bootstrap();
