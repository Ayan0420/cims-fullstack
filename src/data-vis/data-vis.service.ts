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

    /**
     * Gets the count of jobs from the database based on the given query parameters.
     *
     * @param query - The query parameters containing possible filters: year, month, and status.
     *                - year: Filter jobs by year.
     *                - month: Filter jobs by month.
     *                - status: Filter jobs by status.
     *
     * @returns An object containing:
     *          - filter: An object with the applied criteria and its value.
     *          - count: The number of jobs that match the filters.
     */
    async getJobCount(query: ExpressQuery) {
        const filter = {};
        const filterTypes = [];

        // filter for sStatus if provided
        const statusFilter = query.status 
            ? { sStatus: { $regex: `\\b${query.status}\\b`, $options: 'i' } } 
            : {};

        // filter for year and month if provided
        const dateFilter: { [key: string]: any } = {};
        if (query.year) {
            const yearRegex = `^${query.year}-`;
            if (query.month) {
                dateFilter.jobDate = { $regex: `${yearRegex}${query.month}-\\d{2}$` };
            } else {
                dateFilter.jobDate = { $regex: `${yearRegex}\\d{2}-\\d{2}$` };
            }
        } else if (query.month) {
            dateFilter.jobDate = { $regex: `\\d{4}-${query.month}-\\d{2}$` };
        }

        // console.log(filter);

        const count = await this.jobModel.countDocuments({...statusFilter, ...dateFilter});

        const data = {
            filter: filterTypes.reduce((acc, filterType) => {
                acc[filterType.criteria] = filterType.criteriaValue;
                return acc;
            }, {}),
            count,
        };

        return data;
    }

    /**
     * Calculates the total revenue from jobs based on the given query parameters.
     *
     * @param query - The query parameters containing possible filters: year, month, and status.
     *                - year: Filter jobs by year.
     *                - month: Filter jobs by month.
     *                - status: Filter jobs by status.
     *
     * @returns An object containing:
     *          - filter: An object with the applied criteria and its value.
     *          - total: The sum of the charges ('sCharge') of the jobs that match the filters.
     */
    async getRevenueFromJobs(query: ExpressQuery) {
        // const year = query.year as string;
        // const month = query.month as string;
        // const status = query.status as string;

        const filter = {};
        const filterTypes = [];

        const keys = Object.keys(query) as Array<keyof typeof query>;
        const criteriaArray = ['year', 'yearmonth', 'status'];

        // Iterate through the criteriaArray and check if the query contains the key.
        // If the query contains the key, set the filter and the criteriaValue accordingly.
        // The criteria will be the key and the criteriaValue will be the value of the key in the query.
        criteriaArray.forEach((key) => {
            if (keys.includes(key)) {
                if (key === 'year') {
                    filter['jobDate'] = {
                        $regex: `^${query[key]}-\\d{2}-\\d{2}$`,
                        $options: 'i',
                    };
                } else if (key === 'yearmonth') {
                    filter['jobDate'] = {
                        $regex: `^${query[key]}-\\d{2}$`,
                        $options: 'i',
                    };
                } else if (key === 'status') {
                    filter['sStatus'] = { $in: [query[key]] };
                }

                filterTypes.push({
                    criteria: key,
                    criteriaValue: query[key] as string,
                });
            }
        });

        // console.log(filter);

        const total = await this.jobModel.aggregate([
            {
                $match: filter,
            },
            {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$sDownPayment',
                    },
                },
            },
        ]);

        // console.log(total);

        const data = {
            filter: filterTypes.reduce((acc, filterType) => {
                acc[filterType.criteria] = filterType.criteriaValue;
                return acc;
            }, {}),
            total: total[0]?.sum ? total[0]?.sum : 0,
        };

        return data;
    }

    /**
     * Get data of the revenue from jobs based on the sDownPayment field per year and send as an array of year and
     * revenue
     */
    async getRevenuePerYear(query: ExpressQuery) {
        const groupId = query.year
            ? {
                  $dateToString: {
                      format: '%Y-%m',
                      date: {
                          $dateFromString: {
                              dateString: '$jobDate',
                              format: '%Y-%m-%d',
                              onError: null
                          },
                      },
                  },
              }
            : {
                  $year: {
                      $dateFromString: {
                          dateString: '$jobDate',
                          format: '%Y-%m-%d',
                          onError: null
                      },
                  },
              };

        // console.log('groupId', groupId)

        const yearMatch = {
            $match: {
                $expr: {
                    $eq: [
                        {
                            $year: {
                                $dateFromString: {
                                    dateString: '$jobDate',
                                    format: '%Y-%m-%d',
                                },
                            },
                        },
                        Number(query.year),
                    ],
                },
            },
        };

        const data = await this.jobModel.aggregate([
            ...(query.year ? [yearMatch] : []),
            {
                $group: {
                    _id: groupId,
                    value: {
                        $sum: '$sDownPayment',
                    },
                },
            },
        ]);

        return data;
    }

    /**
     * Get data of the number of job orders per year or per month based on the jobDate field
     */
    async getJobOrdersPerYear(query: ExpressQuery) {
        const groupId = query.year
            ? {
                  $dateToString: {
                      format: '%Y-%m',
                      date: {
                          $dateFromString: {
                              dateString: '$jobDate',
                              format: '%Y-%m-%d',
                          },
                      },
                  },
              }
            : {
                  $year: {
                      $dateFromString: {
                          dateString: '$jobDate',
                          format: '%Y-%m-%d',
                      },
                  },
              };

        const yearMatch = {
            $match: {
                $expr: {
                    $eq: [
                        {
                            $year: {
                                $dateFromString: {
                                    dateString: '$jobDate',
                                    format: '%Y-%m-%d',
                                },
                            },
                        },
                        Number(query.year),
                    ],
                },
                ...(query.status !== undefined
                    ? { sStatus: { $regex: `\\b${query.status}\\b`, $options: 'i' } }
                    : {}),
            },
        };

        const statusOnlyMatch = {
            $match: {
                ...(query.status !== undefined
                    ? {  sStatus: { $regex: `\\b${query.status}\\b`, $options: 'i' } }
                    : {}),
            },
        };

        const data = await this.jobModel.aggregate([
            // If year query parameter is present with or without status query parameter, match the year of the job date
            ...(query.year ? [yearMatch] : []),
            // If year query parameter is not present but status query parameter is, match the status
            ...(!query.year && query.status ? [statusOnlyMatch] : []),
            {
                $group: {
                    _id: groupId,
                    value: {
                        $sum: 1,
                    },
                },
            },
        ]);

        return data;
    }
}
