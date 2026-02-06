import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ValidateSchemaAndDTO, checkTypeGuard } from '../../utils/type.util';
import { IMessage, MessageSchema } from './message.schema';
import { IUser, UserSchema } from './user.schema';

export interface IMatching {
  id: string;
  createdAt: Date;
  userId: IUser['id'];
  matchingUserId: IUser['id'];
  messageId: IMessage['id'];
}

@Entity({ name: 'matchings' })
export class MatchingSchema implements IMatching {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('bigint')
  userId: IUser['id'];

  @Column('bigint')
  matchingUserId: IUser['id'];

  @Column('bigint')
  messageId: IMessage['id'];

  @OneToOne(() => MessageSchema, (message) => message.matching, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'messageId' })
  message?: MessageSchema;

  @ManyToOne(() => UserSchema, (user) => user.matchings, { createForeignKeyConstraints: false })
  user?: UserSchema;

  @ManyToOne(() => UserSchema, (user) => user.matchings, { createForeignKeyConstraints: false })
  matchingUser?: UserSchema;
}

export class MatchingDTO implements Required<IMatching> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userId: IUser['id'];

  @ApiProperty()
  matchingUserId: IUser['id'];

  @ApiProperty()
  messageId: IMessage['id'];

  constructor(partial: Partial<MatchingDTO>) {
    Object.assign(this, partial);
  }
}

checkTypeGuard<ValidateSchemaAndDTO<IMatching, MatchingSchema, MatchingDTO>>();
