import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ResponseModel } from 'src/base.model';
import { ProductModel } from 'src/products/models/products.entity';
import { CategoryDto } from 'src/products/schemas/categories.dto';
import {
  CreateProductDto,
  FilterProductsDto,
  ProductDto,
  UpdateProductDto,
} from 'src/products/schemas/products.dto';

import { Public } from './../../../auth/decorators/public.decorator';
import { Roles } from './../../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from './../../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './../../../auth/guards/roles/roles.guard';
import { Role } from './../../../auth/models/roles.model';
import { ProductsService } from '../../services/products/products.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Queryes Limit Offset and Brand',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() params: FilterProductsDto,
  ): Promise<ResponseModel<ProductModel[]>> {
    const products = await this.productsService.findAll(params);
    return {
      statusCode: HttpStatus.OK,
      data: products,
    };
  }

  @Public()
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: ProductDto['id'],
  ): Promise<ResponseModel<ProductModel>> {
    const product = await this.productsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() payload: CreateProductDto,
  ): Promise<ResponseModel<ProductDto | ProductModel>> {
    const newProduct = await this.productsService.create(payload);

    return {
      statusCode: HttpStatus.CREATED,
      data: newProduct,
    };
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: ProductDto['id'],
    @Body() changes: UpdateProductDto,
  ): Promise<ResponseModel<ProductModel>> {
    const product = await this.productsService.update(id, changes);
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  @Put('/:id/category/:categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
  })
  @ApiParam({
    name: 'categoryId',
  })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: ProductDto['id'],
    @Param('categoryId', ParseUUIDPipe) categoryId: CategoryDto['id'],
  ): Promise<ResponseModel<ProductModel>> {
    const product = await this.productsService.addCategoryByProduct(
      id,
      categoryId,
    );
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: ProductDto['id'],
  ): Promise<void> {
    await this.productsService.delete(id);
  }

  @Delete('/:id/category/:categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
  })
  @ApiParam({
    name: 'categoryId',
  })
  async deleteCategory(
    @Param('id', ParseUUIDPipe) id: ProductDto['id'],
    @Param('categoryId', ParseUUIDPipe) categoryId: CategoryDto['id'],
  ): Promise<ResponseModel<ProductModel>> {
    const removeCategory = await this.productsService.removeCategoryByProduct(
      id,
      categoryId,
    );
    return {
      statusCode: HttpStatus.OK,
      data: removeCategory,
    };
  }
}
