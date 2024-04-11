import { UserDTO } from '../repositories/schema/user.schema';
import { OmitDataType, PickDataType } from '../utils/dto';
import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';

export class UserCreateInput extends IntersectionType(
  PickDataType(UserDTO, ['username', 'password', 'name']),
  PartialType(OmitDataType(UserDTO, ['username', 'password', 'name'])),
) {}

export class UsersOutput {
  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [UserDTO] })
  list: UserDTO[];
}

export class UserConditionInput extends PartialType(
  OmitType(UserDTO, ['password', 'createdAt', 'updatedAt', 'deletedAt']),
) {}

export class UserUpdateInput extends PartialType(OmitType(UserCreateInput, ['username'])) {}
