import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  findAll() {
    return this.occasionsService.findAll();
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
