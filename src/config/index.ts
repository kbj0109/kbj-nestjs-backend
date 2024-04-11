import { Type } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from '../services/auth.service';
import { SignInJwtStrategy } from '../guards/sign-in.guard.';
import { MessageRepository } from '../repositories/Message.repository';
import { MessageService } from '../services/message.service';

export const getServiceList = (): Type[] => {
  return [UserService, AuthService, MessageService];
};

export const getRepositoryList = (): Type[] => {
  return [UserRepository, AuthRepository, MessageRepository];
};

export const getOtherList = (): Type[] => {
  return [SignInJwtStrategy];
};
