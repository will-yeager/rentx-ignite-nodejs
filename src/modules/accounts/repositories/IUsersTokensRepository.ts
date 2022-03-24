import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { UserTokens } from '../infra/typeorm/entities/UserTokens';

interface IUsersTokensRepository {
  create({ expires_date, refresh_token, user_id }: ICreateUserTokenDTO): Promise<UserTokens>;
  findByUserIdAndRefreshToken(userId: string, refreshToken: string): Promise<UserTokens>;
  findByRefreshToken(refresh_token: string): Promise<UserTokens>;
  deleteById(tokenId: string): Promise<void>;
}

export { IUsersTokensRepository };
