import { Module } from '@nestjs/common';
import { DataVisController } from './data-vis.controller';
import { DataVisService } from './data-vis.service';
import { JobSchema } from '../job/schemas/job.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: "Job", schema: JobSchema}
        ])
    ],
    controllers: [DataVisController],
    providers: [DataVisService],
})
export class DataVisModule {}
