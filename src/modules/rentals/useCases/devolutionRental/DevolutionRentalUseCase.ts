import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

import { AppError } from '../../../../shared/errors/AppError';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ id, user_id }: IRequest): Promise<void> {
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);
    const minimumRentDays = 1;

    if (!rental) {
      throw new AppError("Rental doesn't exists");
    }

    const actualDateAndHour = this.dateProvider.dateNow();

    let carDaysRented = this.dateProvider.compareInDays(rental.start_date, actualDateAndHour);

    if (carDaysRented <= 0) {
      carDaysRented = minimumRentDays;
    }

    const delay = this.dateProvider.compareInDays(actualDateAndHour, rental.expected_return_date);

    if (delay > 0) {
      const calculateFine = delay * car.fine_amount;
      rental.total = calculateFine;
    }

    rental.total += carDaysRented * car.daily_rate;
    rental.end_date = actualDateAndHour;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);
  }
}

export { DevolutionRentalUseCase };
