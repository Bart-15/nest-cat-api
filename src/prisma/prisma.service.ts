import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    console.log('✅ Database connected successfully!');
    await this.$connect();
  }

  async onModuleDestroy() {
    console.log('🛑 Database disconnected');
    await this.$disconnect();
  }
}
