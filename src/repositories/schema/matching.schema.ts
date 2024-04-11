import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from './user.schema';
import { IMessage } from './message.schema';

export interface IMatching {
  id: string;
  createdAt: Date;
  fromUserId: IUser['id'];
  toUserId: IUser['id'];
  messageId: IMessage['id'];
}

@Entity({ name: 'matchings' })
export class MatchingSchema implements IMatching {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('bigint')
  fromUserId: IUser['id'];

  @Column('bigint')
  toUserId: IUser['id'];

  @Column('bigint')
  messageId: IMessage['id'];
}

export class MatchingDTO implements Required<IMatching> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  fromUserId: IUser['id'];

  @ApiProperty()
  toUserId: IUser['id'];

  @ApiProperty()
  messageId: IMessage['id'];

  constructor(partial: Partial<MatchingDTO>) {
    Object.assign(this, partial);
  }
}
