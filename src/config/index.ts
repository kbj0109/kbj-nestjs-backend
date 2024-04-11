import { Type } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from '../services/auth.service';
import { LoginJwtStrategy } from '../guards/user.auth.guard.';
import { MessageRepository } from '../repositories/Message.repository';
import { MessageService } from '../services/message.service';
import { MatchingService } from '../services/matching.service';
import { MatchingRepository } from '../repositories/matching.repository';

export const getServiceList = (): Type[] => {
  return [UserService, AuthService, MessageService, MatchingService];
};

export const getRepositoryList = (): Type[] => {
  return [UserRepository, AuthRepository, MessageRepository, MatchingRepository];
};

export const getOtherList = (): Type[] => {
  return [LoginJwtStrategy];
};
