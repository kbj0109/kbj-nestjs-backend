import { Type } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from '../services/auth.service';
import { SignInJwtStrategy } from '../guards/sign-in.guard.';

export const getControllerList = (): Type[] => {
  return [UserController];
};

export const getServiceList = (): Type[] => {
  return [UserService, AuthService];
};

export const getRepositoryList = (): Type[] => {
  return [UserRepository, AuthRepository];
};

export const getOtherList = (): Type[] => {
  return [SignInJwtStrategy];
};
