import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOccasionDto } from './dto/create-occasion.dto';
import { UpdateOccasionDto } from './dto/update-occasion.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OccasionsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createOccasionDto: CreateOccasionDto) {
    return this.prisma.occasion.create({
      data: createOccasionDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.occasion.findMany({
        skip,
        take: limit,
        include: {
          products: true,
        },
      }),
      this.prisma.occasion.count(),
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
    const occasion = await this.prisma.occasion.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!occasion) {
      throw new NotFoundException(`Occasion with ID ${id} not found`);
    }

    return occasion;
  }

  async update(id: string, updateOccasionDto: UpdateOccasionDto) {
    const occasion = await this.prisma.occasion.findUnique({
      where: { id },
    });

    if (!occasion) {
      throw new NotFoundException(`Occasion with ID ${id} not found`);
    }

    return this.prisma.occasion.update({
      where: { id },
      data: updateOccasionDto,
    });
  }

  async remove(id: string) {
    const occasion = await this.prisma.occasion.findUnique({
      where: { id },
    });

    if (!occasion) {
      throw new NotFoundException(`Occasion with ID ${id} not found`);
    }

    return this.prisma.occasion.delete({
      where: { id },
    });
  }
}

