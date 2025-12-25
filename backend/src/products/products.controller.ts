import { Controller, Get, UseGuards, Post, Body, Patch, Param, Delete, Request, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
@UseGuards(AuthGuard('session-token'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @Post()
  create(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto,req.user.user_id);
  }
  @Get()
  find_All_Private(@Request() req) {
    return this.productsService.find_All(req.user.user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.find_One(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.productsService.remove(req.user.user_id, +id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }
}
