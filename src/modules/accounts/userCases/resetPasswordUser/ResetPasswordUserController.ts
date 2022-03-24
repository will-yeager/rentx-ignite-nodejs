import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetPasswordUserUseCase } from './ResetPasswordUserUseCase';

class ResetPasswordUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;
    const resetPasswordUserCase = container.resolve(ResetPasswordUserUseCase);

    await resetPasswordUserCase.execute({ token: token.toString(), password });
    return response.json();
  }
}

export { ResetPasswordUserController };
