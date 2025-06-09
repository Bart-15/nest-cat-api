import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatsService {
  private cats = [
    {
      id: uuidv4(),
      name: 'Max',
      color: 'black',
    },
    {
      id: uuidv4(),
      name: 'Pusong',
      color: 'white',
    },
  ];

  getCats(color?: string) {
    if (color) {
      return this.cats.filter((cat) => cat.color === color);
    }

    return this.cats;
  }

  getCatById(id: string) {
    const cat = this.cats.find((cat) => cat.id === id);

    if (!cat) {
      throw new Error('Cat not found');
    }

    return cat;
  }

  createCat(createCatDto: CreateCatDto) {
    const newCat = {
      id: uuidv4(),
      ...createCatDto,
    };

    this.cats.push(newCat);
  }

  updateCat(id: string, updateCatDto: UpdateCatDto) {
    this.cats = this.cats.map((cat) => {
      if (cat.id === id) {
        return { ...cat, ...updateCatDto };
      }

      return cat;
    });

    return this.getCatById(id);
  }

  deleteCat(id: string) {
    const toBeRemoved = this.getCatById(id);

    this.cats = this.cats.filter((cat) => cat.id !== id);

    return toBeRemoved;
  }
}
