import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
  getCats(@Query('color') color: string) {
    return this.catsService.getCats(color);
  }

  @Get(':id')
  getCat(@Param('id') id: string) {
    try {
      return this.catsService.getCatById(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundException('Oops! Cat not found');
      }
    }
  }

  @Post()
  createCat(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
    const newCat = createCatDto;
    this.catsService.createCat(createCatDto);

    return newCat;
  }

  @Put(':id')
  updateCat(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.updateCat(id, updateCatDto);
  }

  @Delete(':id')
  deleteCat(@Param('id') id: string) {
    return this.catsService.deleteCat(id);
  }
}
