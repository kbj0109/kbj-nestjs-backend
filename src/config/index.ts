import { Type } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

export const getControllerList = (): Type[] => {
  return [UserController];
};

export const getServiceList = (): Type[] => {
  return [UserService];
};

export const getModelList = (): Type[] => {
  return [UserModel];
};
