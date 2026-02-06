import { ApiProperty } from '@nestjs/swagger';
import { ListOutput } from '../constant/dto.constant';
import { MatchingDTO } from '../repositories/schema/matching.schema';
import { MessageOutput } from './message.controller.dto';
import { UserOutput } from './user.controller.dto';

export class MatchingOutput extends MatchingDTO {
  @ApiProperty({ type: UserOutput })
  matchingUser: UserOutput;

  @ApiProperty({ type: MessageOutput })
  message: MessageOutput;
}

export class MatchingListOutput extends ListOutput {
  @ApiProperty({ type: [MatchingOutput] })
  list: MatchingOutput[];
}
