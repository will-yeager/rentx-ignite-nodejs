import { Router } from 'express';

import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsByUserController } from '@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';
import { ensureAuthentication } from '@shared/infra/http/middlewares/ensureAuthentication';

const rentalsRoutes = Router();

const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUseController = new ListRentalsByUserController();

rentalsRoutes.post('/', ensureAuthentication, createRentalController.handle);

rentalsRoutes.post('/devolution/:id', ensureAuthentication, devolutionRentalController.handle);

rentalsRoutes.post('/user', ensureAuthentication, listRentalsByUseController.handle);

export { rentalsRoutes };
