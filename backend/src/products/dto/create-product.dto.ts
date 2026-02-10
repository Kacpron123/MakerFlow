import { IsString, IsNumber, IsOptional, Min, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  group_id?: number;
}