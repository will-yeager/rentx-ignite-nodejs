import { ICretateRentalDTO } from '../dtos/ICreateRentalDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

interface IRentalsRepository {
  findById(car_id: string): Promise<Rental>;
  findByUser(user_id: string): Promise<Array<Rental>>;
  findOpenRentalByCar(car_id: string): Promise<Rental>;
  findOpenRentalByUser(user_id: string): Promise<Rental>;
  create(data: ICretateRentalDTO): Promise<Rental>;
}

export { IRentalsRepository };
