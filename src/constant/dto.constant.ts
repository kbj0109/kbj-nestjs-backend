import { ApiProperty } from '@nestjs/swagger';
import { QueryListOption } from '../types';

export class IdInput {
  @ApiProperty()
  id: string;
}

export class ListInput implements QueryListOption {
  @ApiProperty({ required: false, type: Number, default: 0, description: '0 이상' })
  skip?: number;

  @ApiProperty({ required: false, type: Number, default: 100, description: '0 ~ 1000 사이' })
  take?: number;
}

export class ListOutput {
  @ApiProperty({ type: Number })
  totalCount: number;

  @ApiProperty({ type: Number })
  totalPageCount: number;

  @ApiProperty({ type: Boolean })
  hasNext: boolean;
}

export class ListInputAndOutput implements ListInput, ListOutput {
  @ApiProperty({ type: Number })
  totalCount: number;

  @ApiProperty({ type: Number })
  totalPageCount: number;

  @ApiProperty({ type: Boolean })
  hasNext: boolean;

  @ApiProperty({ required: false, type: Number, default: 0, description: '0 이상' })
  skip?: number;

  @ApiProperty({ required: false, type: Number, default: 100, description: '0 ~ 1000 사이' })
  take?: number;
}

export const OrderValueList: [string, ...string[]] = ['ASC', 'DESC', 'asc', 'desc'];
