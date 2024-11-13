import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsBoolean, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { JobStatusEnum, PaymentMethodEnum } from '../schemas/job.schema';
import { Sale } from '../../sales/schemas/sale.schema';

export class UpdateJobDto extends PartialType(CreateJobDto) {
    @IsOptional()
    @IsString()
    customerId: string

    @IsEmpty()
    @IsString()
    jobOrderNum: string
    
    @IsEmpty()
    @IsString()
    trackingCode: string

    @IsOptional()
    @IsString()
    jobDate: string 

    @IsOptional()
    @IsString()
    unitModel: string
    
    @IsOptional()
    @IsString()
    unitSpecs: string

    @IsOptional()
    @IsString()
    unitAccessories: string

    @IsOptional()
    @IsString()
    workPerformed: string
    
    @IsOptional()
    @IsNumber()
    sCharge: number
    
    @IsOptional()
    @IsEnum({PaymentMethodEnum, message: "Select a valid payment method"})
    sPaymeth: PaymentMethodEnum

    @IsOptional()
    @IsNumber()
    sDownpayment: number

    @IsOptional()
    @IsNumber()
    sBalance: number

    @IsOptional()
    @IsEnum({JobStatusEnum, message: "Select a valid job status"})
    sStatus: JobStatusEnum

    @IsOptional()
    @IsBoolean()
    hasSales: boolean

    @IsOptional()
    @IsString()
    saleId: Sale
}
