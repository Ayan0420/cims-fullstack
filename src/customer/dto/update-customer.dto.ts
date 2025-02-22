import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsArray, isArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    cusName: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    cusAddress: string;

    @IsOptional()
    @IsArray()
    @ApiProperty({ required: false })
    cusPhones: string[];

    @IsOptional()
    @IsArray()
    @ApiProperty({ required: false })
    cusEmails?: string[];
}
