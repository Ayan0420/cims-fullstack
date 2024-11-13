import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
}
