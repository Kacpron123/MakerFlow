import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string
    
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    price?: number;
    
    @IsNumber()
    @IsOptional()
    group?: number;
}