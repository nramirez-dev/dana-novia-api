import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        currency: dto.currency,
        imageUrl: dto.imageUrl,
        categories: {
          connect: dto.categoryIds.map(id => ({ id }))
        },
        occasions: dto.occasionIds ? {
          connect: dto.occasionIds.map(id => ({ id }))
        } : undefined,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        categories: true,
        occasions: true,
      }
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        occasions: true,
      }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const data: any = { ...dto };
    if (dto.categoryIds) {
      data.categories = { set: dto.categoryIds.map(id => ({ id })) };
      delete data.categoryIds;
    }

    if (dto.occasionIds) {
      data.occasions = { set: dto.occasionIds.map(id => ({ id })) };
      delete data.occasionIds;
    }

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}