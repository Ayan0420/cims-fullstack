import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DataVisService } from './data-vis.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/data-vis')
export class DataVisController {
    constructor(private dataVisService: DataVisService) {}


    // @UseGuards(AuthGuard())
    @Get()
    hello() {
        return 'Hello from data-vis';
    }

    // @UseGuards(AuthGuard())
    @Get('count')
    getStats(@Query() query: ExpressQuery) {
        return this.dataVisService.getJobCount(query);
    }


    @UseGuards(AuthGuard())
    @Roles(Role.Admin)
    @Get('revenue')
    getRevenue(@Query() query: ExpressQuery) {
        return this.dataVisService.getRevenueFromJobs(query);
    }

    @UseGuards(AuthGuard())
    @Roles(Role.Admin)
    @Get('revenue/data')
    getRevenueData(@Query() query: ExpressQuery) {
        return this.dataVisService.getRevenuePerYear(query);
    }

    @UseGuards(AuthGuard())
    @Roles(Role.Admin)
    @Get('count/data')
    getCountData(@Query() query: ExpressQuery) {
        return this.dataVisService.getJobOrdersPerYear(query);
    }
}
