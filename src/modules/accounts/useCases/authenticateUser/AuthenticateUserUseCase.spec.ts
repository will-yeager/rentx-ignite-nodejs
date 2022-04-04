import ICreateUserDTO from '@modules/accounts/dtos/ICreateUserDTO';
import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUsersTokensRepository: UsersTokensRepositoryInMemory;
let daysjsDateProvider: IDateProvider;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryUsersTokensRepository = new UsersTokensRepositoryInMemory();
    daysjsDateProvider = new DayJsDateProvider();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository, inMemoryUsersTokensRepository, daysjsDateProvider);
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: '00123',
      email: 'user@teste.com',
      password: '1234',
      name: 'User Teste',
    };

    await createUserUseCase.execute(user);

    const authentication = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    expect(authentication).toHaveProperty('token');
  });

  it('should not be able to authenticate a non-existent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@email.com',
        password: '12312312',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate without a password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: '123123',
        email: '12313@email.com',
        password: '1234',
        name: 'user test error',
      };

      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrect password',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
