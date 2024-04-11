import { Body, Controller, Post } from '@nestjs/common';
import { validateParameter } from '../utils/dto.util';
import { z } from 'zod';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRenewInput, AuthRenewOutput, AuthSignInInput, AuthSignInOutput } from './auth.dto';
import { AuthService } from '../services/auth.service';
import { UserAuthGuard } from '../guards/user.auth.guard.';
import { CurrentUser } from '../decorators/parameter.decorator';

@ApiTags('auths')
@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, type: AuthSignInOutput })
  @Post('signin')
  async SignIn(@Body() body: AuthSignInInput): ReturnType<AuthService['signIn']> {
    validateParameter(body, { username: z.string(), password: z.string() });

    const { username, password } = body;

    const result = await this.authService.signIn(username, password);

    return result;
  }

  @ApiResponse({ status: 201, type: AuthRenewOutput })
  @ApiBearerAuth()
  @UserAuthGuard({ allowExpiredToken: true })
  @Post('renew')
  async RenewAccessToken(
    @Body() body: AuthRenewInput,
    @CurrentUser() user: JwtType,
  ): ReturnType<AuthService['signIn']> {
    validateParameter(body, { refreshToken: z.string() });

    const result = await this.authService.renewAccessToken({ id: user.authId, userId: user.userId }, body.refreshToken);

    return result;
  }
}
