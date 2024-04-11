import { Body, Controller, Post } from '@nestjs/common';
import { validateParameter } from '../utils/dto';
import { z } from 'zod';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthSignInInput, AuthSignInOutput } from './auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auths')
@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, type: AuthSignInOutput })
  @Post('signin')
  async SignIn(@Body() body: AuthSignInInput): ReturnType<AuthService['signIn']> {
    validateParameter(body, { username: z.string(), password: z.string() });

    const { username, password } = body;

    const item = await this.authService.signIn(username, password);

    return item;
  }
}
