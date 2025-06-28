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
  UseGuards,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatsService } from './cats.service';

import { AuthGuard } from '@nestjs/passport';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getCats(@Query('breed') breed?: string) {
    return this.catsService.findAll(breed);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getCat(@Param('id') id: number) {
    return this.catsService.findOne(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createCat(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateCat(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(Number(id), updateCatDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteCat(@Param('id') id: number) {
    return this.catsService.remove(Number(id));
  }
}
