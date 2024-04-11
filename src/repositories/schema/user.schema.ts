import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { MatchingSchema } from './matching.schema';

export enum GenderEnum {
  Male = 'Male',
  Female = 'Female',
}

export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  username: string;
  password: string;
  name: string;
  gender?: GenderEnum;
  email?: string;
  phone?: string;
  birth?: string;
}

@Entity({ name: 'users' })
export class UserSchema implements IUser {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column('varchar')
  username: string;

  @Column('varchar')
  password: string;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  gender?: GenderEnum;

  @Column('varchar', { nullable: true })
  email?: string;

  @Column('varchar', { nullable: true })
  phone?: string;

  @Column('date', { nullable: true })
  birth?: string;

  @OneToMany(() => MatchingSchema, (matching) => matching.user)
  matchings: MatchingSchema[];

  @OneToMany(() => MatchingSchema, (matching) => matching.matchingUser)
  matchingsFromOther: MatchingSchema[];
}

export class UserDTO implements Required<IUser> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  username: string;

  @ApiProperty({ description: '비밀번호.' })
  @Exclude()
  password: string;

  @ApiProperty({})
  name: string;

  @ApiProperty({ enum: GenderEnum })
  gender: GenderEnum;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  birth: string;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
