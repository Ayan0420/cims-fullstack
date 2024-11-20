import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from '../job/schemas/job.schema';
import { Model } from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class DataVisService {
    constructor(
        @InjectModel(Job.name)
        private jobModel: Model<Job>,
    ) {}

    async getJobCount(query: ExpressQuery) {
        const year = query.year as string;
        const month = query.month as string;
        const status = query.status as string;

        console.log(year);
        console.log(month);

        const filter = {};
        let criteria = 'none';
        let criteriaValue = '';

        if (year) {
            filter['jobDate'] = {
                $regex: `${year}-`,
                $options: 'i',
            };
            criteria = 'year';
            criteriaValue = year;
        }

        if (month) {
            filter['jobDate'] = {
                $regex: `-${month}-`,
                $options: 'i',
            };
            criteria = 'month';
            criteriaValue = month;
        }

        if (status) {
            filter['sStatus'] = { $in: [status] };
            criteria = 'status';
            criteriaValue = status;
        }

        const count = await this.jobModel.countDocuments(filter);

        const data = {
            filter: {
                [criteria]: criteriaValue,
            },
            count,
        };

        return data;
    }
}
