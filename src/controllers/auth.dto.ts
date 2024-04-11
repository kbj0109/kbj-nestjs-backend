import { UserDTO } from '../repositories/schema/user.schema';
import { PickDataType } from '../utils/dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSignInInput extends PickDataType(UserDTO, ['username', 'password']) {}

export class AuthSignInOutput {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
