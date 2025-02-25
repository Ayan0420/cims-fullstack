import { Module } from '@nestjs/common';
import { ReportGeneratorService } from './report-generator.service';
import { ReportGeneratorController } from './report-generator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from 'src/job/schemas/job.schema';
import { CustomerSchema } from 'src/customer/schemas/user.schema';
import { CounterSchema } from 'src/job/schemas/counter.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
                    { name: 'Job', schema: JobSchema },
                    // { name: 'Customer', schema: CustomerSchema },
                    // { name: 'Counter', schema: CounterSchema },
                ]),
    ],
    providers: [ReportGeneratorService],
    exports: [ReportGeneratorService],
    controllers: [ReportGeneratorController],
})
export class ReportGeneratorModule {}
