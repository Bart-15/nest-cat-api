import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

describe('CatsController', () => {
  let catsController: CatsController;
  let catsService: CatsService;

  const mockCatsService = {
    getCats: jest.fn(),
    getCatById: jest.fn(),
    createCat: jest.fn(),
    updateCat: jest.fn(),
    deleteCat: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [{ provide: CatsService, useValue: mockCatsService }],
    }).compile();

    catsController = moduleRef.get<CatsController>(CatsController);
    catsService = moduleRef.get<CatsService>(CatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all cats', () => {
    const result = [{ id: 1, name: 'Max', color: 'black' }];
    mockCatsService.getCats.mockReturnValue(result);

    expect(catsController.getCats('white')).toBe(result);
    expect(mockCatsService.getCats).toHaveBeenCalledWith('white');
  });

  it('it should return cat by ID', () => {
    const result = { id: 1, name: 'Max', color: 'black' };
    mockCatsService.getCatById.mockReturnValue(result);

    expect(catsController.getCat('1')).toBe(result);
  });

  it('should throw an NotFoundException if cat not found', () => {
    mockCatsService.getCatById.mockImplementation(() => {
      throw new Error('Not found');
    });

    expect(() => catsController.getCat('999')).toThrow(NotFoundException);
  });

  it('should create a cat', () => {
    const createDto: CreateCatDto = { name: 'Tiger', color: 'orange' };
    expect(catsController.createCat(createDto)).toEqual(createDto);
    expect(mockCatsService.createCat).toHaveBeenCalledWith(createDto);
  });

  it('should update a cat', () => {
    const updateDto: UpdateCatDto = { name: 'Leo' };
    catsController.updateCat('1', updateDto);
    expect(mockCatsService.updateCat).toHaveBeenCalledWith('1', updateDto);
  });

  it('should delete a cat', () => {
    catsController.deleteCat('1');
    expect(mockCatsService.deleteCat).toHaveBeenCalledWith('1');
  });
});
