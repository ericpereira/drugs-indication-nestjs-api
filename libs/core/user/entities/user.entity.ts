import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: String,
    enum: [UserRole.USER, UserRole.ADMIN],
    default: UserRole.USER,
  })
  role: UserRole;

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
