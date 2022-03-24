import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import CreateUserController from '@modules/accounts/userCases/createUser/CeateUserController';
import { ProfileUserController } from '@modules/accounts/userCases/profileUserUseCase/ProfileUserController';
import { UpdateUserAvatarController } from '@modules/accounts/userCases/updateUserAvatar/UpdateUserAvatarController';
import { ensureAuthentication } from '@shared/infra/http/middlewares/ensureAuthentication';

const usersRoutes = Router();
const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const profileUserController = new ProfileUserController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.patch('/avatar', ensureAuthentication, uploadAvatar.single('avatar'), updateUserAvatarController.handle);
usersRoutes.get('/', ensureAuthentication, profileUserController.handle);

export { usersRoutes };
