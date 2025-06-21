import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

const mockCat = { id: 1, name: 'Whiskers', breed: 'Siamese', age: 2 };

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  const mockCatsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: mockCatsService,
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all cats', async () => {
    mockCatsService.findAll.mockResolvedValue([mockCat]);

    const result = await controller.getCats();
    expect(result).toEqual([mockCat]);
    expect(mockCatsService.findAll).toHaveBeenCalled();
  });

  it('should get one cat with type breed Siamese', async () => {
    mockCatsService.findAll.mockResolvedValue([mockCat]);

    const result = await controller.getCats('Siamese');
    expect(result).toEqual([mockCat]);
    expect(mockCatsService.findAll).toHaveBeenCalledWith('Siamese');
  });

  it('should get on cat by id', async () => {
    mockCatsService.findOne.mockResolvedValue(mockCat);

    const result = await controller.getCat(1);
    expect(result).toEqual(mockCat);
    expect(mockCatsService.findOne).toHaveBeenCalledWith(1);
  });

  it('should remove cat by id', async () => {
    mockCatsService.remove.mockResolvedValue(mockCat);

    const result = await controller.deleteCat(1);
    expect(result).toEqual(mockCat);
    expect(mockCatsService.remove).toHaveBeenCalledWith(1);
  });

  it('should update cat by id', async () => {
    const updatedCat = { ...mockCat, name: 'Ampon Alarcon' };
    mockCatsService.update.mockResolvedValue(updatedCat);

    const result = await controller.updateCat('1', { name: 'Max Ampon' });
    expect(result).toEqual(updatedCat);
    expect(mockCatsService.update).toHaveBeenCalledWith(1, {
      name: 'Max Ampon',
    });
  });
});
