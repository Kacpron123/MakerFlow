import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { DatabaseModule } from '@app/database/database.module';
import { ProductsModule } from '@app/products/products.module';

@Module({
  imports: [DatabaseModule, ProductsModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
