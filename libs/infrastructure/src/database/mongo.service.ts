// libs/infrastructure/src/database/mongo.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoService implements OnModuleInit {
  private client: MongoClient;
  private dbName: string;

  constructor(private configService: ConfigService) {
    this.dbName = this.configService.get<string>('MONGO_DB_NAME') || 'drugdb';
    this.client = new MongoClient(this.configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017');
  }

  async onModuleInit() {
    await this.client.connect();
    console.log('MongoDB connected');
  }

  getDb() {
    return this.client.db(this.dbName);
  }

  async closeConnection() {
    await this.client.close();
  }
}
