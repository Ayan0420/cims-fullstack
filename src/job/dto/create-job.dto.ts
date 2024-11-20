import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import {
    DeliveryStatusEnum,
    JobStatusEnum,
    OrderStatusEnum,
    PaymentMethodEnum,
} from '../schemas/job.schema';

export class CreateJobDto {
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @IsString()
    jobOrderNum: string;

    @IsNotEmpty()
    @IsString()
    trackingCode: string;

    @IsNotEmpty()
    @IsString()
    jobDate: string;

    @IsString()
    unitModel: string;

    @IsString()
    unitSpecs: string;

    @IsString()
    unitAccessories: string;

    @IsString()
    workPerformed: string;

    @IsNumber()
    sCharge: number;

    @IsEnum({ PaymentMethodEnum, message: 'Select a valid payment method' })
    sPayMeth: PaymentMethodEnum;

    @IsNumber()
    sDownPayment: number;

    @IsNumber()
    sBalance: number;

    @IsEnum({ JobStatusEnum, message: 'Select a valid job status' })
    sStatus: JobStatusEnum;

    @IsBoolean()
    hasPartsOrdered: boolean;

    @IsString()
    pParts: string;

    @IsString()
    pOrdDate: string;

    @IsString()
    pUnitDo: string;

    @IsString()
    pSupp: string;

    @IsNumber()
    pPrice: number;

    @IsEnum(DeliveryStatusEnum, { message: 'Select a valid order status' })
    pOrdStatus: DeliveryStatusEnum;

    @IsString()
    pInstalled: string;

    @IsNumber()
    pDownPayment: number;

    @IsNumber()
    pBal: number;

    @IsEnum(OrderStatusEnum, { message: 'Select a valid Order Status' })
    pStatus: OrderStatusEnum;

    @IsString()
    pRelDate: string;
}
