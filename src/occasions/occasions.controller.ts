import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OccasionsService } from './occasions.service';
import { CreateOccasionDto } from './dto/create-occasion.dto';
import { UpdateOccasionDto } from './dto/update-occasion.dto';

@Controller('occasions')
export class OccasionsController {
  constructor(private readonly occasionsService: OccasionsService) { }

  @Post()
  create(@Body() createOccasionDto: CreateOccasionDto) {
    return this.occasionsService.create(createOccasionDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = parseInt(page || '1', 10);
    const limitNumber = parseInt(limit || '10', 10);

    return this.occasionsService.findAll(
      isNaN(pageNumber) ? 1 : pageNumber,
      isNaN(limitNumber) ? 10 : limitNumber,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.occasionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOccasionDto: UpdateOccasionDto) {
    return this.occasionsService.update(id, updateOccasionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.occasionsService.remove(id);
  }
}
