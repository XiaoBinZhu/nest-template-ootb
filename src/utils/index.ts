// 日志过滤敏感信息
export const cleanParams = (params: any) => {
    if (params?.password) params.password = '***';
    if (params?.token) params.token = '[HIDDEN]';
    return params;
}