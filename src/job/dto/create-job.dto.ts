import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { JobStatusEnum, PaymentMethodEnum } from "../schemas/job.schema"
import { Sale } from "../../sales/schemas/sale.schema"

export class CreateJobDto {

    @IsNotEmpty()
    @IsString()
    customerId: string

    @IsNotEmpty()
    @IsString()
    jobOrderNum: string
    
    @IsNotEmpty()
    @IsString()
    trackingCode: string

    @IsNotEmpty()
    @IsString()
    jobDate: string 

    @IsString()
    unitModel: string
    
    @IsString()
    unitSpecs: string

    @IsString()
    unitAccessories: string

    @IsString()
    workPerformed: string

    @IsNumber()
    sCharge: number
    
    @IsEnum({PaymentMethodEnum, message: "Select a valid payment method"})
    sPaymeth: PaymentMethodEnum

    @IsNumber()
    sDownpayment: number

    @IsNumber()
    sBalance: number

    @IsEnum({JobStatusEnum, message: "Select a valid job status"})
    sStatus: JobStatusEnum

    @IsBoolean()
    hasSales: boolean

    @IsString()
    saleId: Sale
}
