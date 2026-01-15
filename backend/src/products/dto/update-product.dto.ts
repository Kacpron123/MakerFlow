import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string
    
    @IsNumber()
    @IsOptional()
    @IsMin(0)
    @Type(() => Number)
    price?: number;
    
    @IsNumber()
    @IsOptional()
    group?: number;
}