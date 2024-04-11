import { UserDTO } from '../repositories/schema/user.schema';
import { OmitDataType, PickDataType } from '../utils/dto';
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';

export class CreateUserInput extends IntersectionType(
  PickDataType(UserDTO, ['username', 'password', 'name']),
  PartialType(OmitDataType(UserDTO, ['username', 'password', 'name'])),
) {}

export class UsersOutput {
  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [UserDTO] })
  list: UserDTO[];
}
