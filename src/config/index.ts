import { Type } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';

export const getControllerList = (): Type[] => {
  return [UserController];
};

export const getServiceList = (): Type[] => {
  return [UserService];
};

export const getModelList = (): Type[] => {
  return [UserRepository];
};
