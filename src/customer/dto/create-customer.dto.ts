import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Job } from '../../job/schemas/job.schema';

export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    cusName: string;

    @IsNotEmpty()
    @IsString()
    cusAddress: string;

    @IsNotEmpty()
    @IsString()
    cusPhone: string;

    @IsOptional()
    @IsString()
    cusEmail?: string;

    @IsOptional()
    @IsArray()
    jobOrders: Job[];
}
