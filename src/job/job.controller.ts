import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query, UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

/**
 * GET /api/job
 * GET /api/job?page=1&limit=50
 * POST /api/job
 * {"jobOrderNum": "12345", "jobDesc": "test job", "jobType": "test", "quoteNum": "12345", "quoteDesc": "test quote", "quoteType": "test"}
 * GET /api/job/:id
 * GET /api/job/12345
 * PATCH /api/job/:id
 * PATCH /api/job/12345
 * {"jobDesc": "test2"}
 * DELETE /api/job/:id
 * DELETE /api/job/12345
 */
@Controller('api/jobs')
export class JobController {
    constructor(private readonly jobService: JobService) {}

    @UseGuards(AuthGuard())
    @Post()
    create(@Body() createJobDto: CreateJobDto) {
        return this.jobService.create(createJobDto);
    }

    @UseGuards(AuthGuard())
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.jobService.findAll(query);
    }

    @UseGuards(AuthGuard())
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobService.findOne(id);
    }

    @UseGuards(AuthGuard())
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
        return this.jobService.update(id, updateJobDto);
    }

    @UseGuards(AuthGuard())
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.jobService.remove(id);
    }
}
