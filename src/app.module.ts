import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDatabaseModule } from 'libs/infrastructure/src/database/mongo.module';
import { UserModule } from './user/user.module';
import { DrugIndicationModule } from './drug-indication/drug-indication.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MongoDatabaseModule, UserModule, DrugIndicationModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
