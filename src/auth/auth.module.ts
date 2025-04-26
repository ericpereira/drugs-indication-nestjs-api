import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'libs/infrastructure/src/database/schemas/user.schema';
import { UserRepositoryImpl } from 'libs/infrastructure/src/database/repositories/user.repository.impl';
import { LoginUseCase } from 'libs/core/auth/use-cases/login.use-case';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  providers: [AuthService, JwtStrategy, UserRepositoryImpl, LoginUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
