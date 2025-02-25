import { Controller, Get, Query } from '@nestjs/common';
import { DataVisService } from './data-vis.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('api/data-vis')
export class DataVisController {
    constructor(private dataVisService: DataVisService) {}

    @Get()
    hello() {
        return 'Hello from data-vis';
    }

    @Get('count')
    getStats(@Query() query: ExpressQuery) {
        return this.dataVisService.getJobCount(query);
    }

    @Get('revenue')
    getRevenue(@Query() query: ExpressQuery) {
        return this.dataVisService.getRevenueFromJobs(query);
    }

    @Get('revenue/data')
    getRevenueData(@Query() query: ExpressQuery) {
        return this.dataVisService.getRevenuePerYear(query);
    }

    @Get('count/data')
    getCountData(@Query() query: ExpressQuery) {
        return this.dataVisService.getJobOrdersPerYear(query);
    }
}
