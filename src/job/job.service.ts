import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './schemas/job.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { getSearchForJobArray } from 'src/utils/utilities';
import { Customer } from '../customer/schemas/user.schema';

@Injectable()
export class JobService {
    constructor(
        @InjectModel(Job.name)
        private readonly JobModel: Model<Job>,
        @InjectModel(Customer.name)
        private readonly CustomerModel: Model<Customer>,
    ) {}

    // CREATE JOB ORDER
    async create(createJobDto: CreateJobDto) {
        const existingJob = await this.JobModel.findOne({
            jobOrderNum: createJobDto.jobOrderNum,
        });

        if (existingJob) {
            throw new ConflictException(
                `Job ID ${createJobDto.jobOrderNum} already exists`,
            );
        }

        const customer = await this.CustomerModel.findById(
            createJobDto.customerId,
        );

        if (!customer) {
            throw new NotFoundException(
                `Customer ID ${createJobDto.customerId} does not exist`,
            );
        }
        
        // // For Autoincrement Job Order number
        // const lastJob = await this.JobModel.findOne({}, 'jobOrderNum', {
        //     sort: { jobOrderNum: -1 },
        // });
        // console.log(lastJob);

        const newJob = new this.JobModel(createJobDto);

        let createdJob = await newJob.save();

        // // Autoincrement Job Order number
        // if (!createdJob.jobOrderNum) {
        //     if (!lastJob) {
        //         createdJob.jobOrderNum = 10000;
        //     } else {
        //         createdJob.jobOrderNum = lastJob
        //             ? lastJob.jobOrderNum + 1
        //             : 10000;
        //     }
        // }

        // Add tracking code
        // createdJob.trackingCode = createdJob._id
        //     .toString()
        //     .toUpperCase()
        //     .slice(-8);

        // createdJob = await createdJob.save();

        // Add the new job to the customer document
        await this.CustomerModel.findByIdAndUpdate(
            createdJob.customerId,
            {
                $push: { jobOrders: createdJob._id },
            },
            { new: true },
        );

        return createdJob;
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
                  $or: getSearchForJobArray(query),
              }
            : {};

        return this.JobModel.find({ ...keyword })
            .populate({
                path: 'customerId',
                select: ['cusName', 'cusAddress', 'cusPhones', 'cusEmails'],
            })
            .limit(resPerPage)
            .sort({ createdAt: -1 })
            .skip(skip);
    }

    // GET SINGLE JOB
    async findOne(id: string): Promise<Job> {
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
