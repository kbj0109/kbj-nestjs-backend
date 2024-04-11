import { OmitType } from '@nestjs/swagger';
import { UserSchema } from '../models/schema/user.schema';
import { PickDataType } from '../utils/dto';

export class CreateUserInput extends PickDataType(UserSchema) {}

export class UserOutput extends OmitType(UserSchema, ['password']) {}
