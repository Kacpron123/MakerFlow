import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from '@database/database.service';
import { ProductResponseDto } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private databaseService: DatabaseService) {}

  async create(createProductDto: CreateProductDto, userId: number) {
      const { name, price, group_id } = createProductDto;
      const query = `
        INSERT INTO products (name, base_price, group_id, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const res = await this.databaseService.query(query, [name, price, group_id || null, userId]);
      return res[0];
    }

  async find_All(userId: number) {
    const query = `SELECT * FROM products WHERE user_id = $1 ORDER BY name ASC`;
    const rows = await this.databaseService.query(query, [userId]);
    return rows.map(row => new ProductResponseDto(row));
  }

  async find_One(productId: number) {
    const query = `SELECT * FROM products WHERE product_id = $1`;
    const res = await this.databaseService.query(query, [productId]);
    if (!res[0]) return null;
    return new ProductResponseDto(res[0]);
  }

  async find_One_Detail(userId: number, productId: number) {
    const query = `SELECT * FROM products WHERE user_id = $1 AND product_id = $2 ORDER BY name ASC`;
    const res = await this.databaseService.query(query, [userId, productId]);
    if (!res[0]) return null;
    return new ProductResponseDto(res[0]);
  }
  async remove(userId:number,id: number) {
    const query = `DELETE FROM products WHERE user_id = $1 AND product_id = $2`
    return await this.databaseService.query(query, [userId,id]);
  }
  
  async update(userId: number, product_id: number, updateProductDto: UpdateProductDto) {
    const { name, group, price } = updateProductDto;
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (name) {
      fields.push(`name = $${i++}`);
      values.push(name);
    }
    if (group !== undefined) {
      fields.push(`group_id = $${i++}`);
      values.push(group);
    }
    if (price) {
      fields.push(`base_price = $${i++}`);
      values.push(price);
    }
    values.push(product_id);
    const idIndex = i++;
    values.push(userId);
    const userIndex = i;

  const query = `
    UPDATE products 
    SET ${fields.join(', ')} 
    WHERE product_id = $${idIndex} AND user_id = $${userIndex}
    RETURNING *;
  `;
  const res = await this.databaseService.query(query, values);
  return res[0];
  }

  async updateStock(userId: number, product_id: number, stock_add: number) {
    const query = `
      UPDATE products 
      SET stock_number = stock_number + $1
      WHERE product_id = $2 AND user_id = $3
      RETURNING *;
    `;
    const res = await this.databaseService.query(query, [stock_add, product_id, userId]);
    return new ProductResponseDto(res[0]);
  }

}