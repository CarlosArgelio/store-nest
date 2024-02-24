import { Injectable } from '@nestjs/common';
import {
  CreateProduct,
  Products,
  UpdateProduct,
} from '../../entities/products/products.dtos';
import { v4 as uuidv4 } from 'uuid';

import { faker } from '@faker-js/faker';

@Injectable()
export class ProductsService {
  private products: Products[] = [];

  constructor() {
    for (let i = 0; i < 5; i++) {
      this.products.push({
        productId: faker.datatype.uuid(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price(),
        stock: faker.datatype.number(),
        images: [faker.image.imageUrl()],
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: faker.datatype.uuid(),
      });
    }
  }

  findAll() {
    return this.products;
  }

  findOne(id: Products['productId']) {
    const product = this.products.find((product) => {
      return product.productId === id;
    });
    // if (product === undefined) {
    // }
    return product;
  }

  create(product: CreateProduct) {
    const productId = uuidv4();
    const newProduct = {
      ...product,
      productId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  update(id: Products['productId'], product: UpdateProduct) {
    const index = this.products.findIndex((p) => p.productId === id);
    if (index === -1) {
    }

    const updatedProduct = {
      ...this.products[index],
      ...product,
    };
    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  delete(id: Products['productId']) {
    const product = this.findOne(id);
    if (product === undefined) {
      return null;
    }
    const index = this.products.findIndex((p) => p.productId === id);
    delete this.products[index];
    return id;
  }
}