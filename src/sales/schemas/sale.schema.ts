import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


export enum DeliveryStatusEnum {
    na = "N/A",
    ordered = "ORDERED",
    shipped = "SHIPPED",
    received = "RECEIVED",
    returned = "RETURNED"
}

export enum OrderStatusEnum {
    na = "N/A",
    partiallyPaid = "PARTIALLY PAID",
    fullyPaidReleased = "FULLY PAID/RELEASED",
    fullyPaidUnreleased = "FULLY PAID/UNRELEASED",
    returnRefunded = "RETURN REFUNDED"
}

@Schema({
    timestamps: true
})
export class Sale {

    @Prop({default: null, type: mongoose.Schema.Types.ObjectId, ref: 'Job'})
    jobId: string | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
    customerId: string;
    
    @Prop({ default: 'N/A' })
    pParts: string;

    @Prop({ default: 'N/A' })
    pOrdDate: string;

    @Prop({ default: 'N/A' })
    pUnitDo: string;

    @Prop({ default: 'N/A' })
    pSupp: string;

    @Prop({ default: 0 })
    pPrice: number;

    @Prop({
        type: [{type: String, enum: DeliveryStatusEnum}],
        default: [DeliveryStatusEnum.na],
    })
    pOrdStatus: DeliveryStatusEnum;

    @Prop({ default: 'N/A' })
    pInstalled: string;

    @Prop({ default: 0 })
    pDownpay: number;

    @Prop({ default: 0 })
    pBal: number;

    @Prop({
        type: [{type: String, enum: OrderStatusEnum}],
        default: [OrderStatusEnum.na],
    })
    pStatus: OrderStatusEnum;

    @Prop({ default: 'N/A' })
    pRelDate: string;
}


export const SaleSchema = SchemaFactory.createForClass(Sale);