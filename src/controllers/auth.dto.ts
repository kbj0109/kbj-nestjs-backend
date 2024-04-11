import { UserDTO } from '../repositories/schema/user.schema';
import { PickDataType } from '../utils/dto';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class AuthSignInInput extends PickDataType(UserDTO, ['username', 'password']) {}

export class AuthSignInOutput {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class AuthRenewInput extends PickType(AuthSignInOutput, ['refreshToken']) {}
export class AuthRenewOutput extends AuthSignInOutput {}
