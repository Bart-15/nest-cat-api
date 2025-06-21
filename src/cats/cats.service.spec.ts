import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  cat: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockCat = { id: 1, name: 'Whiskers', breed: 'Siamese', age: 2 };

describe('CatsService', () => {
  jest.clearAllMocks(); // 👈 add this line

  let service: CatsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a cat', async () => {
    mockPrisma.cat.create.mockResolvedValue(mockCat);

    const result = await service.create(mockCat);

    expect(result).toEqual(mockCat);
    expect(mockPrisma.cat.create).toHaveBeenCalledWith({ data: mockCat });
  });

  it('should find all cats', async () => {
    mockPrisma.cat.findMany.mockResolvedValue([mockCat]);

    const result = await service.findAll();

    expect(result).toEqual([mockCat]);
    expect(mockPrisma.cat.findMany).toHaveBeenCalledWith({ where: undefined });
  });

  it('should find cat by breed', async () => {
    await service.findAll('Siamese');
    expect(mockPrisma.cat.findMany).toHaveBeenCalledWith({
      where: { breed: { equals: 'Siamese', mode: 'insensitive' } },
    });
  });

  it('should throw NotFoundException if cat not found', async () => {
    jest.spyOn(prisma.cat, 'findUnique').mockResolvedValueOnce(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('should update a cat', async () => {
    const updatedCat = { ...mockCat, name: 'Ampon Alarcon' };

    mockPrisma.cat.findUnique.mockResolvedValue(mockCat); // ensure the cat exists
    mockPrisma.cat.update.mockResolvedValue(updatedCat); // ensure update returns expected result

    const result = await service.update(1, { name: 'Ampon Alarcon' });

    expect(result).toEqual(updatedCat);
    expect(mockPrisma.cat.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'Ampon Alarcon' },
    });
  });

  it('should remove a cat', async () => {
    mockPrisma.cat.findUnique.mockResolvedValue(mockCat); // ensure the cat exists
    mockPrisma.cat.delete.mockResolvedValue(mockCat);

    const result = await service.remove(1);
    expect(result).toEqual(mockCat);
    expect(mockPrisma.cat.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
