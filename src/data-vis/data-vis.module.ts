import { Module } from '@nestjs/common';
import { DataVisController } from './data-vis.controller';
import { DataVisService } from './data-vis.service';
import { JobSchema } from '../job/schemas/job.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: "Job", schema: JobSchema}
        ], 'local'),
        AuthModule
    ],
    controllers: [DataVisController],
    providers: [DataVisService],
})
export class DataVisModule {}
