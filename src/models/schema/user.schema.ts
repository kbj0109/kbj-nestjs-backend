import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum GenderEnum {
  Male = 'Male',
  Female = 'Female',
}

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

export type IUser = UserSchema;
