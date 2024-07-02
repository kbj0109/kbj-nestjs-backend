import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ValidateSchemaAndDTO, checkTypeGuard } from '../../utils/type.util';

export enum AuthTypeEnum {
  REFRESH_TOKEN = 'refresh', // Access 토큰 갱신용 리프레시 토큰
}

export interface IAuth {
  id: string;
  createdAt: Date;
  expiredAt: Date;
  userId: string;
  type: AuthTypeEnum;
  data: { [key: string]: any };
}

@Entity({ name: 'auths' })
export class AuthSchema implements IAuth {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime' })
  expiredAt: Date;

  @Column({ type: 'bigint' })
  userId: string;

  @Column({ type: 'varchar' })
  type: AuthTypeEnum;

  @Column({ type: 'json' })
  data: { [key: string]: any };
}

export class AuthDTO implements Required<IAuth> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  expiredAt: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: 'enum', enum: AuthTypeEnum })
  type: AuthTypeEnum;

  @ApiProperty({ type: 'json' })
  data: { [key: string]: any };

  constructor(partial: Partial<AuthDTO>) {
    Object.assign(this, partial);
  }
}

checkTypeGuard<ValidateSchemaAndDTO<IAuth, AuthSchema, AuthDTO>>();
