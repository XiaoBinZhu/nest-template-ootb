import { SetMetadata } from '@nestjs/common';


export const SKIP_RS_INTERCEPTOR: string = 'skip_response_success_interceptor';
export const SKIP_PUBLIC_TOKEN_GUARD: string = 'skip_public_token_guard';


/**
 * @name 跳过全局成功响应格式拦截器
 * @description 通过Metadata添加自定义的元数据、Reflector检索和解析元数据
 */
export const SkipResponseSuccessInterceptor = () =>
    SetMetadata(SKIP_RS_INTERCEPTOR, true);

/**
 * @name 跳过全局Jwt守护
 */
export const Public = () =>
    SetMetadata(SKIP_PUBLIC_TOKEN_GUARD, true);