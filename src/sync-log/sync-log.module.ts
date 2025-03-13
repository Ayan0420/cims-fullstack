// src/sync-log/sync-log.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncLog, SyncLogSchema } from './sync-log.schema';
import { Counter, CounterSchema } from 'src/job/schemas/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: SyncLog.name, schema: SyncLogSchema },
        { name: Counter.name, schema: CounterSchema },
        
    ], 'local'),
    
  ],
  exports: [MongooseModule],
})
export class SyncLogModule {}
