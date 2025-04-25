import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDatabaseModule } from 'libs/infrastructure/src/database/mongo.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongoDatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
