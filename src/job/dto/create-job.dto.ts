import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import {
    JobStatusEnum,
    PaymentMethodEnum,
} from '../schemas/job.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @ApiProperty()
    @IsString()
    jobOrderNum: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    trackingCode: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    jobDate: string;

    @ApiProperty()
    @IsString()
    unitModel: string;

    @ApiProperty()
    @IsString()
    unitSpecs: string;

    @ApiProperty()
    @IsString()
    unitAccessories: string;

    @ApiProperty()
    @IsString()
    workPerformed: string;

    @ApiProperty()
    @IsNumber()
    sCharge: number;

    @ApiProperty({ enum: PaymentMethodEnum, description: 'Select a valid payment method' })
    @IsEnum(PaymentMethodEnum, { message: 'Select a valid payment method' })
    sPayMeth: PaymentMethodEnum;

    @ApiProperty()
    @IsNumber()
    sDownPayment: number;

    @ApiProperty()
    @IsNumber()
    sBalance: number;

    @ApiProperty({ enum: JobStatusEnum, description: 'Select a valid job status' })
    @IsEnum(JobStatusEnum, { message: 'Select a valid job status' })
    sStatus: JobStatusEnum;

    @ApiProperty()
    @IsBoolean()
    sUnitDropOff: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    sRelDate: string;


    @ApiProperty()
    @IsString()
    notes: string;

    // @ApiProperty()
    // @IsBoolean()
    // hasPartsOrdered: boolean;

    // @ApiProperty()
    // @IsString()
    // pParts: string;

    // @ApiProperty()
    // @IsString()
    // pOrdDate: string;


    // @ApiProperty()
    // @IsString()
    // pSupp: string;

    // @ApiProperty()
    // @IsNumber()
    // pPrice: number;

    // @ApiProperty({ enum: DeliveryStatusEnum, description: 'Select a valid order status' })
    // @IsEnum(DeliveryStatusEnum, { message: 'Select a valid order status' })
    // pOrdStatus: DeliveryStatusEnum;

    // @ApiProperty()
    // @IsString()
    // pInstalled: string;

    // @ApiProperty()
    // @IsNumber()
    // pDownPayment: number;

    // @ApiProperty()
    // @IsNumber()
    // pBal: number;

    // @ApiProperty({ enum: OrderStatusEnum, description: 'Select a valid Order Status' })
    // @IsEnum(OrderStatusEnum, { message: 'Select a valid Order Status' })
    // pStatus: OrderStatusEnum;

    // @ApiProperty()
    // @IsString()
    // pRelDate: string;
}
