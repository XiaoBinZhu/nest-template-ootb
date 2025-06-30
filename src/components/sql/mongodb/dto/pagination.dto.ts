import { IsOptional, IsNumber, Min, IsString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    limit: number = 10;

    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
    fields?: string[];

    @IsOptional()
    @Transform(({ value }) => JSON.parse(value))
    filters?: Record<string, any>;

    @IsOptional()
    @IsString()
    sort?: string;
}