import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1, 100)
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