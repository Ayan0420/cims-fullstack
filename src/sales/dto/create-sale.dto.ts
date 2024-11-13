import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { DeliveryStatusEnum, OrderStatusEnum } from "../schemas/sale.schema";

export class CreateSaleDto {

    @IsOptional()
    @IsString()
    jobId: string;

    @IsString()
    customerId: string;

    @IsOptional()
    @IsString()
    pParts: string;

    @IsOptional()
    @IsString()
    pOrdDate: string;

    @IsOptional()
    @IsString()
    pUnitDo: string;

    @IsOptional()
    @IsString()
    pSupp: string;

    @IsOptional()
    @IsNumber()
    pPrice: number;


    @IsOptional()
    @IsEnum({DeliveryStatusEnum, message: "Select a valid delivery status"})
    pOrdStatus: string;

    @IsOptional()
    @IsString()
    pInstalled: string;

    @IsOptional()   
    @IsNumber()
    pDownpay: number;

    @IsOptional()   
    @IsNumber()
    pBal: number;

    @IsOptional()
    @IsEnum({OrderStatusEnum, message: "Select a valid order status"})
    pStatus: string;

    @IsOptional()
    @IsString()
    pRelDate: string;

}
