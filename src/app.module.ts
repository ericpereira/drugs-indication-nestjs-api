import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDatabaseModule } from 'libs/infrastructure/src/database/mongo.module';
import { UserModule } from './user/user.module';
import { DrugIndicationModule } from './drug-indication/drug-indication.module';

@Module({
  imports: [MongoDatabaseModule, UserModule, DrugIndicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
