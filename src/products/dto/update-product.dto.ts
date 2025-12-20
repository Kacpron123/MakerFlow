import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsNumber()
    product_id: number;

    @IsString()
    @Optional()
    name?: string
}