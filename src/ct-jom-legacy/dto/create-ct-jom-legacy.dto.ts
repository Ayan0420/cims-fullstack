import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCtJomLegacyDto {
    
    
    @ApiProperty()
    @IsString()
    job_id: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    tracking_code: string;

    @ApiProperty()
    @IsString()
    job_date: string;

    @ApiProperty()
    @IsString()
    cus_name: string;

    @ApiProperty()
    @IsString()
    cus_address: string;

    @ApiProperty()
    @IsString()
    cus_phone: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    unit_model: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    unit_specs: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    unit_accessories: string;

    @ApiProperty()
    @IsString()
    work_perf: string;

    @ApiProperty()
    @IsNumber()
    s_charge: number;

    @ApiProperty()
    @IsString()
    s_paymeth: string;

    @ApiProperty()
    @IsNumber()
    s_downpay: number;

    @ApiProperty()
    @IsNumber()
    s_bal: number;

    @ApiProperty()
    @IsString()
    s_status: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    p_parts: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    p_ord_date: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    p_unit_do: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    p_supp: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    p_price: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    p_ord_status: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    p_installed: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    p_downpay: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    p_bal: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    p_status: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    p_rel_date: string;
}
