import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Job } from '../../job/schemas/job.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    cusName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    cusAddress: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    cusPhones: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    cusEmails?: string[];

    @ApiProperty({ type: [Job], required: false })
    @IsOptional()
    @IsArray()
    jobOrders: Job[];
}
