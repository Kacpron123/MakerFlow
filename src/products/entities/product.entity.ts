export class Product {
  product_id: number;
  user_id: number;
  name: string;
  base_price: number;
  group_id: number | null;
  
  group_name?: string;///<optional

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}