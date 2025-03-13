import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    Optional,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobSchema } from './schemas/job.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Customer, CustomerSchema } from '../customer/schemas/user.schema';
import { SyncLog } from 'src/sync-log/sync-log.schema';

@Injectable()
export class JobService {
    constructor(
        @InjectModel(Job.name, 'local') private readonly localJobModel: Model<Job>,
        @InjectModel(Customer.name, 'local') private readonly localCustomerModel: Model<Customer>,
        @InjectModel(SyncLog.name, 'local') private syncLogModel: Model<SyncLog>,
        @Optional() @Inject('remote') private remoteConnection?: Connection,
    ) {}


    /**
     * TRANSACTION LOGIC =============================================================================
     */
    async createJobTransaction(createJobDto: CreateJobDto, useRemote = false): Promise<Job> {
        // Choose the correct models based on the connection
        const jobModel = useRemote
          ? this.remoteConnection.model(Job.name, JobSchema)
          : this.localJobModel;
        const customerModel = useRemote
          ? this.remoteConnection.model(Customer.name, CustomerSchema)
          : this.localCustomerModel;
    
        // Check if job already exists (if applicable)
        const existingJob = await jobModel.findOne({
          jobOrderNum: createJobDto.jobOrderNum,
        });
        if (existingJob) {
          throw new ConflictException(`Job ID ${createJobDto.jobOrderNum} already exists`);
        }
    
        // Verify the customer exists.
        const customer = await customerModel.findById(createJobDto.customerId);
        if (!customer) {
          throw new NotFoundException(`Error from ${useRemote ? 'remote db' : 'local db'} :Customer ID ${createJobDto.customerId} does not exist`);
        }
    
        // Create and save the Job (this will run pre-save hooks, etc.)
        const newJob = new jobModel(createJobDto);
        const createdJob = await newJob.save();
    
        // Update the customer document with the new job.
        await customerModel.findByIdAndUpdate(
          createdJob.customerId,
          { $push: { jobOrders: createdJob._id } },
          { new: true },
        );
    
        return createdJob;
    }

    // Connectivity check can be simple here or delegated to a service.
    async checkConnectivity(): Promise<boolean> {
        try {
          await this.remoteConnection.db.admin().ping();
          return true;
        } catch (error) {
          return false;
        }
    }


    /**
     * CONTROLLER SERVICES =============================================================================
     */
    // CREATE JOB ORDER
    async create(createJobDto: CreateJobDto) {
        // Always execute locally.
        const createdJob = await this.createJobTransaction(createJobDto, false);

        // Check connectivity.
        const online = await this.checkConnectivity();
        console.log('is-online:', online)

        if (!online) {
            // Log the command for later synchronization.
            await this.syncLogModel.create({
                operation: 'createJob',
                payload: createJobDto,
            });
        } else {
            // Optionally, if you want immediate remote sync when online.
            await this.createJobTransaction(createJobDto, true);
        }

        return createdJob;
    }

    // // GET ALL JOBS
    // async findAll(query: ExpressQuery): Promise<Job[]> {
    //     // used for pagination, showing 20 items per page
    //     const resPerPage = 15;
    //     const currentPage = Number(query.page) || 1;
    //     const skip = resPerPage * (currentPage - 1);

    //     // used for search functionality from the query params
    //     const keyword = query.keyword
    //         ? {
    //             $or: [
    //                 {
    //                     jobOrderNum: {
    //                         $regex: query.keyword,
    //                         $options: 'i',
    //                     },
    //                 },
    //                 {
    //                     trackingCode: {
    //                         $regex: query.keyword,
    //                         $options: 'i',
    //                     },
    //                 },
    //                 {
    //                     unitModel: {
    //                         $regex: query.keyword,
    //                         $options: 'i',
    //                     },
    //                 },
    //                 {
    //                     workPerformed: {
    //                         $regex: query.keyword,
    //                         $options: 'i',
    //                     },
    //                 },
                    
    //             ],
    //           }
    //         : {};
            
    //     // filter for sStatus if provided
    //     const statusFilter = query.status 
    //         ? { sStatus: { $regex: `\\b${query.status}\\b`, $options: 'i' } } 
    //         : {};

    //     // filter for year and month if provided
    //     const dateFilter: { [key: string]: any } = {};
    //     if (query.year) {
    //         const yearRegex = `^${query.year}-`;
    //         if (query.month) {
    //             dateFilter.jobDate = { $regex: `${yearRegex}${query.month}-\\d{2}$` };
    //         } else {
    //             dateFilter.jobDate = { $regex: `${yearRegex}\\d{2}-\\d{2}$` };
    //         }
    //     } else if (query.month) {
    //         dateFilter.jobDate = { $regex: `\\d{4}-${query.month}-\\d{2}$` };
    //     }

    //     const jobs = await this.JobModel.find({ 
    //                                         ...keyword, 
    //                                         ...statusFilter,
    //                                         ...dateFilter
    //                                     })
    //                                     .populate({
    //                                         path: 'customerId',
    //                                         select: ['cusName', 'cusAddress', 'cusPhones', 'cusEmails'],
    //                                     })
    //                                     .limit(resPerPage)
    //                                     .sort({ createdAt: -1 })
    //                                     .skip(skip);

    //     const jobsCount = await this.JobModel.countDocuments({ 
    //                                         ...keyword, 
    //                                         ...statusFilter,
    //                                         ...dateFilter
    //                                     })
                                        

    //     const result: any = {
    //         jobs,
    //         pages: Math.ceil(jobsCount / resPerPage),
    //     }

    //     return result;
    // }

    // // GET SINGLE JOB
    // async findOne(id: string): Promise<Job> {   
    //     const isValidId = mongoose.isValidObjectId(id);
    //     if (!isValidId) {
    //         throw new BadRequestException('Please enter correct Id');
    //     }

    //     const result = await this.JobModel.findById(id)
    //                                         .populate({
    //                                             path: 'customerId',
    //                                             select: ['cusName', 'cusAddress', 'cusPhones', 'cusEmails'],
    //                                         });
    //     if (!result) {
    //         throw new NotFoundException('Job order not found');
    //     }

    //     return result;
    // }

    // // UPDATE JOB
    // async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    //     const isValidId = mongoose.isValidObjectId(id);
    //     if (!isValidId) {
    //         throw new BadRequestException('Please enter correct Id');
    //     }

    //     const result = await this.JobModel.findByIdAndUpdate(id, updateJobDto, {
    //         new: true,
    //     });

    //     if (!result) {
    //         throw new NotFoundException('Job order not found');
    //     }

    //     return result;
    // }

    // // DELETE JOB
    // async remove(id: string): Promise<Job> {
    //     const isValidId = mongoose.isValidObjectId(id);
    //     if (!isValidId) {
    //         throw new BadRequestException('Please enter correct Id');
    //     }

    //     const result = await this.JobModel.findByIdAndDelete(id);
    //     if (!result) {
    //         throw new NotFoundException('Job order not found');
    //     }

    //     return result;
    // }
}
