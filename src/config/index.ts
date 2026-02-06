import { Type } from '@nestjs/common';
import { LoginJwtStrategy } from '../guards/user.auth.guard.';
import { AuthRepository } from '../repositories/auth.repository';
import { MatchingRepository } from '../repositories/matching.repository';
import { MessageRepository } from '../repositories/Message.repository';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { MatchingService } from '../services/matching.service';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';

export const getServiceList = (): Type[] => {
  return [UserService, AuthService, MessageService, MatchingService];
};

export const getRepositoryList = (): Type[] => {
  return [UserRepository, AuthRepository, MessageRepository, MatchingRepository];
};

export const getOtherList = (): Type[] => {
  return [LoginJwtStrategy];
};
