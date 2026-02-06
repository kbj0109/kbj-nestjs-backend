import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDTO } from '../repositories/schema/user.schema';
import { PickDataType } from '../utils/dto.util';

export class AuthLoginInput extends PickDataType(UserDTO, ['username', 'password']) {}

export class AuthLoginOutput {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class AuthRenewInput extends PickType(AuthLoginOutput, ['refreshToken']) {}
export class AuthRenewOutput extends AuthLoginOutput {}
