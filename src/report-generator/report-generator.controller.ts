import { BadRequestException, Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ReportGeneratorService } from './report-generator.service';
import mongoose, { Model } from 'mongoose';
import { Job } from 'src/job/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';

@Controller('report-generator')
export class ReportGeneratorController {

    constructor(@InjectModel(Job.name)
            private readonly JobModel: Model<Job>,
            private readonly reportGeneratorService: ReportGeneratorService
    ) {}
    

    @Get(':id')
    async generateReport(@Res() res, @Param('id') id: string,) {
        
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Please enter correct Id');
        }

        const result = await this.JobModel.findById(id)
                                            .populate({
                                                path: 'customerId',
                                                select: ['cusName', 'cusAddress', 'cusPhones', 'cusEmails'],
                                            });
        if (!result) {
            throw new NotFoundException('Job order not found');
        }
        
        const jobOrderSlip = await this.reportGeneratorService.generateJobOrderSlip(result);

        res.header('Content-Disposition', 'inline');
        return res.end(jobOrderSlip);
    }
}
