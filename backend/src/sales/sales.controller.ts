import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('sales')
@UseGuards(AuthGuard('session-token'))
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  getAll(@Request() req){
    return this.salesService.getAll(req.user.user_id);
  }

  @Post()
  create(@Request() req, @Body() createSaleDto: CreateSaleDto) {
    return this.salesService.createSale(req.user.user_id, createSaleDto);
  }

}
