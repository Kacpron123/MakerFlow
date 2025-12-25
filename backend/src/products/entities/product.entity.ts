import { Exclude } from 'class-transformer';

export class ProductResponseDto {
  id: number;
  name: string;
  price: number;

  @Exclude()
  product_id: number;

  @Exclude()
  base_price: number;

  @Exclude()
  user_id: number;

  constructor(partial: any) {
    this.id = partial.product_id;
    this.name = partial.name;
    this.price = partial.base_price;
  }
}