import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema()
export class User extends Document {
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
    super();
    this._id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
