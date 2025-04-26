import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrugIndication } from 'libs/core/drug-indication/entities/drug-indication.entity';
import { DrugIndicationRepositoryImpl } from 'libs/infrastructure/src/database/repositories/drug-indication.repository.impl';
import { DrugIndicationController } from './drug-indication.controller';
import { CreateDrugIndicationUseCase } from 'libs/core/drug-indication/use-cases/create-drug-indication.use-case';
import { DrugIndicationSchema } from 'libs/infrastructure/src/database/schemas/drug-indication.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DrugIndication.name, schema: DrugIndicationSchema }]),
  ],
  controllers: [DrugIndicationController],
  providers: [CreateDrugIndicationUseCase, DrugIndicationRepositoryImpl],
})
export class DrugIndicationModule {}
