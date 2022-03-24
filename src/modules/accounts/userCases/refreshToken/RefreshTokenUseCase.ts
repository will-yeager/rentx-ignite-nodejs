import { verify, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth.config';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

import { AppError } from '../../../../shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}
@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dayjsDateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const { email, sub } = verify(token, authConfig.secret_refresh_token) as IPayload;

    const userId = sub;

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(userId, token);

    if (!userToken) {
      throw new AppError('Refresh token is missing!');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refreshTokenExpiresDate = this.dayjsDateProvider.addDays(authConfig.expires_refresh_token_days);

    const refreshToken = sign({ email }, authConfig.secret_refresh_token, {
      subject: sub,
      expiresIn: authConfig.expires_refresh_token_days,
    });

    await this.usersTokensRepository.create({
      expires_date: refreshTokenExpiresDate,
      refresh_token: refreshToken,
      user_id: userId,
    });

    const newToken = sign({}, authConfig.secret_token, {
      subject: userId,
      expiresIn: authConfig.expires_in_token,
    });

    return {
      refresh_token: refreshToken,
      token: newToken,
    };
  }
}

export { RefreshTokenUseCase };
