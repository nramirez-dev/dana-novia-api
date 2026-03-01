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

  async findAll(page: number = 1, limit: number = 10, categoryId?: string, occasionId?: string, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId) {
      where.categories = {
        some: { id: categoryId }
      };
    }
    if (occasionId) {
      where.occasions = {
        some: { id: occasionId }
      };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          categories: true,
          occasions: true,
        }
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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