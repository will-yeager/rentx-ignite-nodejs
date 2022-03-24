import { InMemoryCarsRepository } from '@modules/cars/repositories/in-memory/inMemoryCarsRepository';
import { InMemorySpecificationsRepository } from '@modules/cars/repositories/in-memory/inMemorySpecificationsRepository';

import { AppError } from '../../../../shared/errors/AppError';
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let inMemoryCarsRepository: InMemoryCarsRepository;
let inMemorySpecificationsRepository: InMemorySpecificationsRepository;

describe('Create Car Specification', () => {
  beforeEach(() => {
    inMemoryCarsRepository = new InMemoryCarsRepository();
    inMemorySpecificationsRepository = new InMemorySpecificationsRepository();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(inMemoryCarsRepository, inMemorySpecificationsRepository);
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await inMemoryCarsRepository.create({
      name: 'Name car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: '1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'Category',
    });

    const specification = await inMemorySpecificationsRepository.create({
      description: 'teste',
      name: 'teste',
    });

    const specifications_cars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id: [specification.id],
    });

    expect(specifications_cars).toHaveProperty('specifications');
    expect(specifications_cars.specifications.length).toBe(1);
  });

  it('should not be able to add a new specification to a non-existent car', async () => {
    const car_id = '1234';
    const specifications_id = ['54321'];

    expect(async () => {
      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
