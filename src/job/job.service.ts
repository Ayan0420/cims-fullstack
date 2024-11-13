import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './schemas/job.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { getSearchArray } from 'src/utils/utilities';

@Injectable()
export class JobService {
    constructor(
        @InjectModel(Job.name)
        private readonly JobModel: Model<Job>,
    ) {}

    // CREATE JOB ORDER
    async create(createJobDto: CreateJobDto) {
        const existingJob = await this.JobModel.findOne({
            job_id: createJobDto.jobOrderNum,
        });

        if (existingJob) {
            throw new BadRequestException(
                `Job ID ${createJobDto.jobOrderNum} already exists`,
            );
        }

        const createdJob = new this.JobModel(createJobDto);

        return await createdJob.save();
    }

    // GET ALL JOBS
    async findAll(query: ExpressQuery): Promise<Job[]> {
        // used for pagination, showing 2 items per page
        const resPerPage = 50;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        // used for search functionality from the query params
        const keyword = query.keyword
            ? {
                  $or: getSearchArray(query),
              }
            : {};

        return await this.JobModel.find({ ...keyword })
            .limit(resPerPage)
            .skip(skip);
    }

    // GET SINGLE JOB
    async findOne(id: string): Promise<Job> {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Please enter correct Id');
        }

        const result = await this.JobModel.findById(id);
        if (!result) {
            throw new NotFoundException('Job order not found');
        }

        return result;
    }

    // UPDATE JOB
    async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Please enter correct Id');
        }

        const result = await this.JobModel.findByIdAndUpdate(id, updateJobDto, {
            new: true,
        });

        if (!result) {
            throw new NotFoundException('Job order not found');
        }

        return result;
    }

    // DELETE JOB
    async remove(id: string): Promise<Job> {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Please enter correct Id');
        }

        const result = await this.JobModel.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundException('Job order not found');
        }

        return result;
    }

    
}
