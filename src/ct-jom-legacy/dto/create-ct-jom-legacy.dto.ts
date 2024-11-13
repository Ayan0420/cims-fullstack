import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCtJomLegacyDto {
    @IsString()
    job_id: string;

    @IsOptional()
    @IsString()
    tracking_code: string;

    @IsString()
    job_date: string;

    @IsString()
    cus_name: string;

    @IsString()
    cus_address: string;

    @IsString()
    cus_phone: string;

    @IsOptional()
    @IsString()
    unit_model: string;

    @IsOptional()
    @IsString()
    unit_specs: string;

    @IsOptional()
    @IsString()
    unit_accessories: string;

    @IsString()
    work_perf: string;

    @IsNumber()
    s_charge: number;

    @IsString()
    s_paymeth: string;

    @IsNumber()
    s_downpay: number;

    @IsNumber()
    s_bal: number;

    @IsString()
    s_status: string;

    @IsOptional()
    @IsString()
    p_parts: string;

    @IsOptional()
    @IsString()
    p_ord_date: string;

    @IsOptional()
    @IsString()
    p_unit_do: string;

    @IsOptional()
    @IsString()
    p_supp: string;

    @IsOptional()
    @IsNumber()
    p_price: number;

    @IsOptional()
    @IsString()
    p_ord_status: string;

    @IsOptional()
    @IsString()
    p_installed: string;

    @IsOptional()
    @IsNumber()
    p_downpay: number;

    @IsOptional()
    @IsNumber()
    p_bal: number;

    @IsOptional()
    @IsString()
    p_status: string;

    @IsOptional()
    @IsString()
    p_rel_date: string;
}
