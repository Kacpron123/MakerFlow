import { Controller, Get, UseGuards, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  // publics:
  
  // @Get()
  // find_All_Public() {
  //   return this.productsService.find_All_Public();
  // }
  
  //privates:
  @Post('me')
  @UseGuards(AuthGuard('session-token'))
  create(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto,req.user.user_id);
  }
  @Get('me')
  @UseGuards(AuthGuard('session-token'))
  find_All_Private(@Request() req) {
    return this.productsService.find_All_Private(req.user.user_id);
  }
  @Get('me/:id')
  @UseGuards(AuthGuard('session-token'))
  find_One_Private(@Request() req, @Param('id') id: string) {
    return this.productsService.find_One_Detail(req.user.user_id, +id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.find_One(+id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('session-token'))
  remove(@Param('id') id: string, @Request() req) {
    return this.productsService.remove(req.user.user_id, +id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }
}
