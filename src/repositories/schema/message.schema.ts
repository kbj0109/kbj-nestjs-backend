import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ValidateSchemaAndDTO, checkTypeGuard } from '../../utils/type.util';
import { MatchingSchema } from './matching.schema';
import { IUser, UserSchema } from './user.schema';

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

  @OneToOne(() => MatchingSchema, (matching) => matching.message)
  matching?: MatchingSchema;

  @ManyToOne(() => UserSchema, (user) => user.sentMessages, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'fromUserId' })
  sentUser?: IUser;

  @ManyToOne(() => UserSchema, (user) => user.receivedMessages, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'toUserId' })
  receivedUser?: IUser;
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

checkTypeGuard<ValidateSchemaAndDTO<IMessage, MessageSchema, MessageDTO>>();
