import { Controller, Post, Body, UseGuards, Get, Param, Put, Delete } from '@nestjs/common';
import { DrugIndication } from 'libs/core/drug-indication/entities/drug-indication.entity';
import { CreateDrugIndicationUseCase } from 'libs/core/drug-indication/use-cases/create-drug-indication.use-case';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DrugIndicationRepositoryImpl } from 'libs/infrastructure/src/database/repositories/drug-indication.repository.impl';

@Controller('drugIndications')
export class DrugIndicationController {
  constructor(
    private readonly createDrugIndicationUseCase: CreateDrugIndicationUseCase,
    private readonly drugIndicationRepo: DrugIndicationRepositoryImpl,
  ) {}

  // Create a new drug indication
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: { query: string }): Promise<DrugIndication> {
    return this.createDrugIndicationUseCase.execute(data);
  }

  // Get all drug indications
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<DrugIndication[]> {
    return this.drugIndicationRepo.findAll();
  }

  // Get a single drug indication by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<DrugIndication | null> {
    return this.drugIndicationRepo.findById(id);
  }

  // Update a drug indication by ID
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<DrugIndication>,
  ): Promise<DrugIndication | null> {
    return this.drugIndicationRepo.update(id, updateData);
  }

  // Delete a drug indication by ID
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.drugIndicationRepo.delete(id);
    return { deleted };
  }
}
