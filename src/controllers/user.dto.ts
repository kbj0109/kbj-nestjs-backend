import { GenderEnum, UserSchema } from '../models/schema/user.schema';
import { z } from 'nestjs-zod/z';
import { OnlyData } from '../types';
import { getParamValidator } from '../utils/dto';
import { DATE_REGEX } from '../constant/date';

type _CreateUserInput = OnlyData<UserSchema>;
export class CreateUserInput extends getParamValidator<_CreateUserInput>({
  username: z.string(),
  password: z.string(),
  name: z.string(),
  birth: z.string().regex(DATE_REGEX).optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum([GenderEnum.Male, GenderEnum.Female]).optional(),
}) {}
