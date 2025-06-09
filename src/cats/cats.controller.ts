import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Controller('cats')
export class CatsController {
  @Get()
  getCats(@Query('type') type: string) {
    return [{ type }];
  }

  @Get(':id')
  getCat(@Param('id') id: string) {
    return {
      catId: id,
    };
  }

  @Post()
  createCat(@Body() createCatDto: CreateCatDto) {
    return {
      name: createCatDto.name,
    };
  }

  @Put(':id')
  updateCat(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return {
      catId: id,
      name: updateCatDto,
    };
  }

  @Delete(':id')
  deleteCat(@Param('id') id: string) {
    return {
      catId: id,
    };
  }
}
