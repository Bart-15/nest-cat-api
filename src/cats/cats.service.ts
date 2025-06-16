import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CatsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCatDto) {
    return this.prisma.cat.create({ data });
  }

  findAll(breed?: string) {
    return this.prisma.cat.findMany({
      where: breed
        ? { breed: { equals: breed, mode: 'insensitive' } }
        : undefined,
    });
  }

  async findOne(id: number) {
    const cat = await this.prisma.cat.findUnique({ where: { id } });

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return cat;
  }

  async update(id: number, data: UpdateCatDto) {
    await this.findOne(id);

    return this.prisma.cat.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.cat.delete({ where: { id } });
  }
}
