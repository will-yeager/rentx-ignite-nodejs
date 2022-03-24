import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { UserTokens } from '@modules/accounts/infra/typeorm/entities/UserTokens';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

class InMemoryUsersTokensRepository implements IUsersTokensRepository {
  usersTokens: Array<UserTokens> = [];

  async create({ expires_date, refresh_token, user_id }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      expires_date,
      refresh_token,
      user_id,
    });

    this.usersTokens.push(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(userId: string, refreshToken: string): Promise<UserTokens> {
    const userToken = this.usersTokens.find((ut) => ut.user_id === userId && ut.refresh_token && refreshToken);
    return userToken;
  }

  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    const userToken = this.usersTokens.find((userToken) => userToken.refresh_token === refresh_token);
    return userToken;
  }

  async deleteById(tokenId: string): Promise<void> {
    const userToken = this.usersTokens.find((ut) => ut.id === tokenId);
    this.usersTokens.splice(this.usersTokens.indexOf(userToken));
  }
}

export { InMemoryUsersTokensRepository };
