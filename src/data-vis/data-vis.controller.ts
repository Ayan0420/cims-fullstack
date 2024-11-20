import { Controller, Get, Query } from '@nestjs/common';
import { DataVisService } from './data-vis.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('data-vis')
export class DataVisController {
    constructor(private dataVisService: DataVisService) {}

    @Get()
    getStats(@Query() query: ExpressQuery) {
        return this.dataVisService.getJobCount(query);

    }
}
