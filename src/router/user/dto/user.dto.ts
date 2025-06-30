import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsNotEmpty, MinLength, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class loginUserDto {
    @ApiPropertyOptional({ description: '用户名', example: 'XXXXX' })
    @IsString()
    @IsOptional()
    userName?: string;

    @ApiPropertyOptional({ description: '邮箱', example: 'test@example.com' })
    @IsString()
    @IsEmail({}, { message: '邮箱格式不正确' })
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ description: '密码', example: '123456' })
    @IsString()
    @IsOptional()
    password?: string;

    @ApiPropertyOptional({ description: '手机号', example: '13800138000' })
    @IsString()
    @IsPhoneNumber('CN')
    @IsOptional()
    phoneNumber?: string;

    @ApiPropertyOptional({ description: '验证码', example: '123456' })
    @IsString()
    @IsOptional()
    code?: string;

    @ApiProperty({ description: '类型', example: 'login' })
    @IsString()
    @IsNotEmpty({ message: '字段不能为空' })
    type: string;
}

export class CreateUserDto {
    @ApiProperty({ minLength: 6, example: 'password123' })
    @IsString()
    @MinLength(6)
    password: string;

    // 重新定义字段添加验证
    @ApiProperty({ required: true })
    @IsNotEmpty({ message: '字段不能为空' })
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nickName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    sex?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsArray()
    roles?: string[];
}

export class UpdateUserDto {
    userName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    code?: string;
    type?: string;
}
