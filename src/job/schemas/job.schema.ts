import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Customer } from "src/customer/schemas/user.schema";
import { Sale } from "../../sales/schemas/sale.schema";

export enum PaymentMethodEnum {
    otc = "OVER THE COUNTER",
    gCash = "G-CASH",
    payMaya = "PAYMAYA",
    bank = "BANK TRANSFER",
    others = "OTHERS"
}

export enum JobStatusEnum {
    onGoing= "ONGOING",
    doneUnreleased = "DONE/UNRELEASED",
    paidUnreleased = "PAID/UNRELEASED",
    paidReleased = "PAIN/RELEASED",
    backJob = "BACK JOB",
    dmdUnreleased = "DMD/UNRELEASED",
    dmdReleased = "DMD/RELEASED",
    cancelled = "CANCELLED"
}

@Schema({
    timestamps: true
})
export class Job {

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Customer'})
    customerId: Customer

    @Prop({ required: true, auto: true, autoIncrement: 10000 })
    jobOrderNum: number
    
    @Prop({required: true})
    trackingCode: string

    @Prop({required: true})
    jobDate: string 

    @Prop({default: 'No model'})
    unitModel: string
    
    @Prop({default: 'No spects'})
    unitSpecs: string

    @Prop({default: 'No accessories'})
    unitAccessories: string

    @Prop({required: true})
    workPerformed: string

    @Prop({default: 0})
    sCharge: number
    
    @Prop({
        type: [{type: String, enum: PaymentMethodEnum}],
        default: [PaymentMethodEnum.otc],
    })
    sPaymeth: PaymentMethodEnum

    @Prop({default: 0})
    sDownpayment: number

    @Prop({default: 0})
    sBalance: number

    @Prop({
        type: [{type: String, enum: JobStatusEnum}],
        default: [JobStatusEnum.onGoing],
    })
    sStatus: JobStatusEnum

    @Prop({default: false})
    hasSales: boolean

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Sale'})
    saleId: Sale
}

export const JobSchema = SchemaFactory.createForClass(Job)