import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { ListOutput } from '../constant/dto.constant';
import { UserDTO } from '../repositories/schema/user.schema';
import { OmitDataType, PickDataType } from '../utils/dto.util';

export class UserCreateInput extends IntersectionType(
  PickDataType(UserDTO, ['username', 'password', 'name']),
  PartialType(OmitDataType(UserDTO, ['username', 'password', 'name'])),
) {}

export class UserOutput extends IntersectionType(
  OmitType(UserDTO, ['password']),
  PartialType(PickType(UserDTO, ['birth', 'email', 'gender', 'phone', 'deletedAt'])),
) {}

export class UserListOutput extends ListOutput {
  @ApiProperty({ type: [UserOutput] })
  list: UserOutput[];
}

export class UserConditionInput extends PartialType(
  OmitType(UserDTO, ['password', 'createdAt', 'updatedAt', 'deletedAt']),
) {}

export class UserUpdateInput extends PartialType(OmitType(UserCreateInput, ['username'])) {}
