import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum GenderEnum {
  Male = 'Male',
  Female = 'Female',
}

export type IUser = UserSchema;

@Entity({ name: 'users' })
export class UserSchema {
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
}
