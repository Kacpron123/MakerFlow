import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, Min, ValidateNested } from "class-validator";

class SaleItemDto {
    @IsNumber()
    id: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateSaleDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => SaleItemDto)
    items: SaleItemDto[];
}
