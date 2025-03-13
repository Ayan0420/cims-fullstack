import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncScheduler } from './sync.scheduler';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncLogSchema } from 'src/sync-log/sync-log.schema';
import { JobSchema } from 'src/job/schemas/job.schema';
import { CustomerSchema } from 'src/customer/schemas/user.schema';
import { CounterSchema } from 'src/job/schemas/counter.schema';
import { JobService } from 'src/job/job.service';
import { RemoteConnectionModule } from 'src/remote-connection.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Job', schema: JobSchema },
            { name: 'Customer', schema: CustomerSchema },
            { name: 'Counter', schema: CounterSchema },
            { name: 'SyncLog', schema: SyncLogSchema },
        ], 'local'),
        RemoteConnectionModule,
    ],
    providers: [SyncService, SyncScheduler, JobService],
    
    exports: [SyncService],
})
export class SyncModule {}
