import { Repository, getRepository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

import { UserTokens } from '../entities/UserTokens';

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create({ expires_date, refresh_token, user_id }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(userId: string, refreshToken: string): Promise<UserTokens> {
    return this.repository.findOne({ user_id: userId, refresh_token: refreshToken });
  }

  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    return this.repository.findOne(refresh_token);
  }

  async deleteById(tokenId: string): Promise<void> {
    await this.repository.delete(tokenId);
  }
}

export { UsersTokensRepository };
