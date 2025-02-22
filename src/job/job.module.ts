import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from './schemas/job.schema';
import { AuthModule } from '../auth/auth.module';
import { CustomerSchema } from '../customer/schemas/user.schema';
import { CounterSchema } from './schemas/counter.schema';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: 'Job', schema: JobSchema },
            { name: 'Customer', schema: CustomerSchema },
            { name: 'Counter', schema: CounterSchema },
        ]),
    ],
    controllers: [JobController],
    providers: [JobService],
})
export class JobModule {}
