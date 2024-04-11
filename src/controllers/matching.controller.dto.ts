import { MatchingDTO } from '../repositories/schema/matching.schema';
import { ApiProperty } from '@nestjs/swagger';
import { UserOutput } from './user.controller.dto';

export class MatchingOutput extends MatchingDTO {
  @ApiProperty({ type: UserOutput })
  user: UserOutput;
}

export class MatchingsOutput {
  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [MatchingOutput] })
  list: MatchingOutput[];
}
