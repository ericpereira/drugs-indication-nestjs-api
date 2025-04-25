import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepositoryImpl } from 'libs/infrastructure/src/database/repositories/user.repository.impl';
import { CreateUserUseCase } from 'libs/core/user/use-cases/create-user.use-case';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'libs/core/user/entities/user.entity';
import { UserSchema } from 'libs/infrastructure/src/database/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [CreateUserUseCase, UserRepositoryImpl],
})
export class UserModule {}
