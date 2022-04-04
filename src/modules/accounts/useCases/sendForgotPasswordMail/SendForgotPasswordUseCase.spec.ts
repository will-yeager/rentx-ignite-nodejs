import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayJsDateProvider;
let mailProvider: MailProviderInMemory;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sendForgotPasswrodMailUseCase: SendForgotPasswordMailUseCase;

describe('Send Forgot Mail', () => {
  beforeEach(() => {
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayJsDateProvider();
    mailProvider = new MailProviderInMemory();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sendForgotPasswrodMailUseCase = new SendForgotPasswordMailUseCase(
      inMemoryUsersRepository,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });

  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await inMemoryUsersRepository.create({
      driver_license: '664168',
      email: 'teste@gmail.com',
      name: 'teste',
      password: '123',
    });

    await sendForgotPasswrodMailUseCase.execute('teste@gmail.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send an email if user does not exists', async () => {
    await expect(sendForgotPasswrodMailUseCase.execute('testeerror@gmail.com')).rejects.toEqual(new AppError('User does not exists!'));
  });

  it('should be able to create an users token', async () => {
    const generateTokenMail = jest.spyOn(usersTokensRepositoryInMemory, 'create');

    await inMemoryUsersRepository.create({
      driver_license: '6641687',
      email: 'teste2@gmail.com',
      name: 'teste2',
      password: '1234',
    });

    await sendForgotPasswrodMailUseCase.execute('teste2@gmail.com');

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
