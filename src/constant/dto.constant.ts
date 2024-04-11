import { ApiProperty } from '@nestjs/swagger';

export class IdInput {
  @ApiProperty()
  id: string;
}

export class ListInput {
  @ApiProperty({ required: false, type: Number })
  skip?: number | string;

  @ApiProperty({ required: false, type: Number })
  take?: number | string;
}
