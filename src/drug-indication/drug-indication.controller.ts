import { Controller, Post, Body } from '@nestjs/common';
import { DrugIndication } from 'libs/core/drug-indication/entities/drug-indication.entity';
import { CreateDrugIndicationUseCase } from 'libs/core/drug-indication/use-cases/create-drug-indication.use-case';

@Controller('drugIndications')
export class DrugIndicationController {
  constructor(private readonly createDrugIndicationUseCase: CreateDrugIndicationUseCase) {}

  // Route to create a user
  @Post()
  async create(@Body() data: { query: string }): Promise<DrugIndication> {
    return this.createDrugIndicationUseCase.execute(data);
  }
}
