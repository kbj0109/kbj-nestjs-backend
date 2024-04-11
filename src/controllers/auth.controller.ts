import { Body, Controller, Post } from '@nestjs/common';
import { validateParameter } from '../utils/dto.util';
import { z } from 'zod';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRenewInput, AuthRenewOutput, AuthLoginInput, AuthLoginOutput } from './auth.controller.dto';
import { AuthService } from '../services/auth.service';
import { UserAuthGuard } from '../guards/user.auth.guard.';
import { LoginUser } from '../decorators/parameter.decorator';

@ApiTags('auths')
@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, type: AuthLoginOutput })
  @Post('login')
  async Login(@Body() body: AuthLoginInput): ReturnType<AuthService['login']> {
    validateParameter(body, { username: z.string(), password: z.string() });

    const { username, password } = body;

    const result = await this.authService.login(username, password);

    return result;
  }

  @ApiResponse({ status: 201, type: AuthRenewOutput })
  @ApiBearerAuth()
  @UserAuthGuard({ allowExpiredToken: true })
  @Post('renew')
  async RenewAccessToken(
    @Body() body: AuthRenewInput,
    @LoginUser() loginUser: LoginUserType,
  ): ReturnType<AuthService['login']> {
    validateParameter(body, { refreshToken: z.string() });

    const result = await this.authService.renewAccessToken(
      { id: loginUser.authId, userId: loginUser.userId },
      body.refreshToken,
    );

    return result;
  }
}
