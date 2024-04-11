import { UserDTO } from '../models/schema/user.schema';
import { OmitDataType, PickDataType } from '../utils/dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';

export class CreateUserInput extends IntersectionType(
  PickDataType(UserDTO, ['username', 'password', 'name']),
  PartialType(OmitDataType(UserDTO, ['username', 'password', 'name'])),
) {}
