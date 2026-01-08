import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { DatabaseService } from '@database/database.service';
import { ProductsService } from '@app/products/products.service';

@Injectable()
export class SalesService {
  constructor(
    private databaseService: DatabaseService,
    private productsService: ProductsService
  ) {}

  async getAll(userId: number){
    const query=`
      SELECT t.total_price, t.transaction_id 
      FROM transaction AS t
      WHERE user_id = $1
    `;
    // TODO get all sales 
  }

  async createSale(userId: number, createSaleDto: CreateSaleDto) {
    const client = await this.databaseService.getClient();

    try {
      await client.query('BEGIN');

      let totalPrice = 0;
      const itemsWithPrices:{
        id:any,
        price: number
        qty: number
      }[]=[];

      for (const item of createSaleDto.items) {
        const product = (await client.query(
          'SELECT product_id, base_price FROM products WHERE product_id = $1 AND user_id = $2',
          [item.id, userId]
        )).rows;
        if (!product[0]) {
          throw new Error(`Product with ID ${item.id} does not exist or not found in the database`);
        }

        const price = parseFloat(product[0].base_price);
        totalPrice += price * item.quantity;
        
        itemsWithPrices.push({
          id: product[0].product_id,
          price: price,
          qty: item.quantity
        });
      }

      const transactionRes = (await client.query(
        `INSERT INTO transactions (user_id, total_price) 
        VALUES ($1, $2) RETURNING transaction_id`,
        [userId, totalPrice]
      )).rows;
      const transactionId = transactionRes[0].transaction_id;

      for (const item of itemsWithPrices) {
        await client.query(
          `INSERT INTO sale_items (transaction_id, product_id, quantity, price_at_sale) 
          VALUES ($1, $2, $3, $4)`,
          [transactionId, item.id, item.qty, item.price]
        );
        this.productsService.updateStock(userId, item.id, -item.qty);
      }

      await client.query('COMMIT');

      return {
        transactionId,
        totalPrice,
        message: "The operation was successful"
      };

    } catch (error) {
      // when error change  back changes
      await client.query('ROLLBACK');
      throw error;
    }
  }

  // TODO sales find
  // TODO optional delete, update

}
