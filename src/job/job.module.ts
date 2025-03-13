import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from './schemas/job.schema';
import { AuthModule } from '../auth/auth.module';
import { CustomerSchema } from '../customer/schemas/user.schema';
import { CounterSchema } from './schemas/counter.schema';
import { SyncLogSchema } from 'src/sync-log/sync-log.schema';
import { RemoteConnectionModule } from 'src/remote-connection.module';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: 'Job', schema: JobSchema },
            { name: 'Customer', schema: CustomerSchema },
            { name: 'Counter', schema: CounterSchema },
            { name: 'SyncLog', schema: SyncLogSchema },
        ], 'local'),
        RemoteConnectionModule,
    ],
    controllers: [JobController],
    providers: [JobService],
    exports: [JobService],
})
export class JobModule {}
