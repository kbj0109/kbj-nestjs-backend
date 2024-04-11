import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IUser } from './user.schema';

export enum MessageLevelEnum {
  normal = 3,
  high = 7,
}

export enum MessageStatusEnum {
  activated = 'activated',
  deactivated = 'deactivated',
  accepted = 'accepted',
  rejected = 'rejected',
}

export interface IMessage {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  fromUserId: IUser['id'];
  toUserId: IUser['id'];
  messageLevel: MessageLevelEnum;
  messageStatus: MessageStatusEnum;
  text: string;
  reason?: string;
}

@Entity({ name: 'messages' })
export class MessageSchema implements IMessage {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'bigint' })
  fromUserId: string;

  @Column({ type: 'bigint' })
  toUserId: string;

  @Column('int')
  messageLevel: MessageLevelEnum;

  @Column('varchar')
  messageStatus: MessageStatusEnum;

  @Column('text')
  text: string;

  @Column('text', { nullable: true })
  reason?: string;
}

export class MessageDTO implements Required<IMessage> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({})
  deletedAt: Date;

  @ApiProperty()
  fromUserId: string;

  @ApiProperty()
  toUserId: string;

  @ApiProperty({ enum: MessageLevelEnum })
  messageLevel: MessageLevelEnum;

  @ApiProperty({ enum: MessageStatusEnum })
  messageStatus: MessageStatusEnum;

  @ApiProperty()
  text: string;

  @ApiProperty({ description: 'Reason for status' })
  reason: string;

  constructor(partial: Partial<MessageDTO>) {
    Object.assign(this, partial);
  }
}
