import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class ProductsService {
  constructor(private databaseService: DatabaseService) {}

  async create(createProductDto: CreateProductDto, userId: number) {
      const { name, base_price, group_id } = createProductDto;
      const query = `
        INSERT INTO products (name, base_price, group_id, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const res = await this.databaseService.query(query, [name, base_price, group_id || null, userId]);
      return res[0];
    }

  async find_All_Private(userId: number) {
    const query = `SELECT * FROM products WHERE user_id = $1 ORDER BY name ASC`;
    return await this.databaseService.query(query, [userId]);
  }
  async find_One(productId: number) {
    const query = `SELECT * FROM products WHERE product_id = $2 ORDER BY name ASC`;
    return await this.databaseService.query(query, [productId]);
  }
  async find_One_Detail(userId: number,productId: number) {
    const query = `SELECT * FROM products WHERE user_id = $1 AND product_id = $2 ORDER BY name ASC`;
    return await this.databaseService.query(query, [userId,productId]);
  }
  async remove(userId:number,id: number) {
    const query = `DELETE FROM products WHERE user_id = $1 AND product_id = $2`
    return await this.databaseService.query(query, [userId,id]);
  }
  
  // async find_All_Public(){

  // }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }


}
