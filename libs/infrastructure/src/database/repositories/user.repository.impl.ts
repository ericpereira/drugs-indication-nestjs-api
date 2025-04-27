import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../../core/user/entities/user.entity';
import { UserDTO, UserRepository } from 'libs/core/user/interfaces/user.interface';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(user: UserDTO): Promise<User> {
    return this.userModel.create(user);
  }
  
  // todo: implement it in the future
  // async findAll(): Promise<User[]> {
  //   return this.userModel.find().exec();
  // }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // todo: implement it in the future
  // async findById(id: string): Promise<User | null> {
  //   return this.userModel.findById(id).exec();
  // }

  // async update(id: string, userData: Partial<User>): Promise<User | null> {
  //   const updatedUser = await this.userModel
  //     .findByIdAndUpdate(id, userData, { new: true })
  //     .exec();
  //   return updatedUser ? updatedUser : null;
  // }

  // async delete(id: string): Promise<boolean> {
  //   const result = await this.userModel.findByIdAndDelete(id).exec();
  //   return result != null;
  // }
}
