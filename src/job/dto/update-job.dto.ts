import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import {
    IsBoolean,
    IsEmpty,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { JobStatusEnum, PaymentMethodEnum } from '../schemas/job.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateJobDto extends PartialType(CreateJobDto) {
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    customerId: string;

    @ApiProperty()
    @IsString()
    jobOrderNum: string;

    @ApiProperty()
    @IsEmpty()
    @IsString()
    trackingCode: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    jobDate: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    unitModel: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    unitSpecs: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    unitAccessories: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    workPerformed: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    sCharge: number;

    @ApiProperty()
    @IsOptional()
    @IsEnum({ PaymentMethodEnum, message: 'Select a valid payment method' })
    sPayMeth: PaymentMethodEnum;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    sDownPayment: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    sBalance: number;

    @ApiProperty()
    @IsOptional()
    @IsEnum({ JobStatusEnum, message: 'Select a valid job status' })
    sStatus: JobStatusEnum;

    @ApiProperty()
    @IsBoolean()
    sUnitDropOff: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    sRelDate: string;

    @ApiProperty()
    @IsString()
    notes: string;
}
