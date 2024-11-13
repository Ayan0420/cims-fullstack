import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    @IsOptional()
    @IsString()
    cusName: string;

    @IsOptional()
    @IsString()
    cusAddress: string;

    @IsOptional()
    @IsString()
    cusPhone: string;

    @IsOptional()
    @IsString()
    cusEmail?: string;
}
