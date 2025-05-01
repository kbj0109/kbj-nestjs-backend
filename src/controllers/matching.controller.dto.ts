import { MatchingDTO } from '../repositories/schema/matching.schema';
import { ApiProperty } from '@nestjs/swagger';
import { UserOutput } from './user.controller.dto';
import { MessageOutput } from './message.controller.dto';
import { ListOutput } from '../constant/dto.constant';

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
