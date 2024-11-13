import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from './schemas/job.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Job', schema: JobSchema}, {name: 'Sale', schema: SaleSchema}]),
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
