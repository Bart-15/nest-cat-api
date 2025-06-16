import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getCats(@Query('breed') breed?: string) {
    return this.catsService.findAll(breed);
  }

  @Get(':id')
  getCat(@Param('id') id: number) {
    return this.catsService.findOne(Number(id));
  }

  @Post()
  createCat(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Put(':id')
  updateCat(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(Number(id), updateCatDto);
  }

  @Delete(':id')
  deleteCat(@Param('id') id: number) {
    return this.catsService.remove(Number(id));
  }
}
