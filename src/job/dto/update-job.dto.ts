import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import {
    IsEmpty,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { JobStatusEnum, PaymentMethodEnum } from '../schemas/job.schema';

export class UpdateJobDto extends PartialType(CreateJobDto) {
    @IsOptional()
    @IsString()
    customerId: string;

    @IsString()
    jobOrderNum: string;

    @IsEmpty()
    @IsString()
    trackingCode: string;

    @IsOptional()
    @IsString()
    jobDate: string;

    @IsOptional()
    @IsString()
    unitModel: string;

    @IsOptional()
    @IsString()
    unitSpecs: string;

    @IsOptional()
    @IsString()
    unitAccessories: string;

    @IsOptional()
    @IsString()
    workPerformed: string;

    @IsOptional()
    @IsNumber()
    sCharge: number;

    @IsOptional()
    @IsEnum({ PaymentMethodEnum, message: 'Select a valid payment method' })
    sPayMeth: PaymentMethodEnum;

    @IsOptional()
    @IsNumber()
    sDownPayment: number;

    @IsOptional()
    @IsNumber()
    sBalance: number;

    @IsOptional()
    @IsEnum({ JobStatusEnum, message: 'Select a valid job status' })
    sStatus: JobStatusEnum;
}
