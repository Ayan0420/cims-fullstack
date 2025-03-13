import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCtJomLegacyDto } from './dto/create-ct-jom-legacy.dto';
import { UpdateCtJomLegacyDto } from './dto/update-ct-jom-legacy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CtJomLegacy } from './schemas/ct-jom-legacy.schema';
import mongoose, { Model } from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { getSearchArrayLegacy } from 'src/utils/utilities';

@Injectable()
export class CtJomLegacyService {
    constructor(
        @InjectModel(CtJomLegacy.name, 'local')
        private readonly ctJomLegacyModel: Model<CtJomLegacy>,
    ) {}

    // CREATE JOB ORDER
    async create(createCtJomLegacyDto: CreateCtJomLegacyDto) {
        const existingCtJomLegacy = await this.ctJomLegacyModel.findOne({
            job_id: createCtJomLegacyDto.job_id,
        });

        if (existingCtJomLegacy) {
            throw new BadRequestException(
                `Job ID ${createCtJomLegacyDto.job_id} already exists`,
            );
        }

        const createdCtJomLegacy = new this.ctJomLegacyModel(
            createCtJomLegacyDto,
        );

        return await createdCtJomLegacy.save();
    }

    // GET ALL JOBS
    async findAll(query: ExpressQuery): Promise<CtJomLegacy[]> {
        // used for pagination, showing 2 items per page
        const resPerPage = 50;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        // used for search functionality from the query params
        const keyword = query.keyword
            ? {
                  $or: getSearchArrayLegacy(query),
              }
            : {};

        return this.ctJomLegacyModel
            .find({ ...keyword })
            .limit(resPerPage)
            .skip(skip);
    }

    // GET SINGLE JOB
    async findOne(id: string): Promise<CtJomLegacy> {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Please enter correct Id');
        }

        const result = await this.ctJomLegacyModel.findById(id);
        if (!result) {
            throw new NotFoundException('Job order not found');
        }

        return result;
    }

    // UPDATE JOB
    async update(
        id: string,
        updateCtJomLegacyDto: UpdateCtJomLegacyDto,
    ): Promise<CtJomLegacy> {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Please enter correct Id');
        }

        const result = await this.ctJomLegacyModel.findByIdAndUpdate(
            id,
            updateCtJomLegacyDto,
            { new: true },
        );

        if (!result) {
            throw new NotFoundException('Job order not found');
        }

        return result;
    }

    // DELETE JOB
    async remove(id: string): Promise<CtJomLegacy> {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Please enter correct Id');
        }

        const result = await this.ctJomLegacyModel.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundException('Job order not found');
        }

        return result;
    }
}
