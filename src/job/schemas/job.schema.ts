import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Customer } from 'src/customer/schemas/user.schema';
import { Counter } from './counter.schema';

export enum PaymentMethodEnum {
    otc = 'OVER THE COUNTER',
    gCash = 'G-CASH',
    payMaya = 'PAYMAYA',
    bank = 'BANK TRANSFER',
    others = 'OTHERS',
}

export enum JobStatusEnum {
    onGoing = 'ONGOING',
    doneUnreleased = 'DONE/UNRELEASED',
    paidUnreleased = 'PAID/UNRELEASED',
    paidReleased = 'PAID/RELEASED',
    backJob = 'BACK JOB',
    dmdUnreleased = 'DMD/UNRELEASED',
    dmdReleased = 'DMD/RELEASED',
    cancelled = 'CANCELLED',
}

// export enum DeliveryStatusEnum {
//     na = 'N/A',
//     ordered = 'ORDERED',
//     shipped = 'SHIPPED',
//     received = 'RECEIVED',
//     returned = 'RETURNED',
// }

// export enum OrderStatusEnum {
//     na = 'N/A',
//     partiallyPaid = 'PARTIALLY PAID',
//     fullyPaidReleased = 'FULLY PAID/RELEASED',
//     fullyPaidUnreleased = 'FULLY PAID/UNRELEASED',
//     returnRefunded = 'RETURN REFUNDED',
// }

@Schema({
    timestamps: true,
})
export class Job {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    })
    customerId: Customer;

    // auto generated
    @Prop({ unique: true })
    jobOrderNum: string;

    // auto generated
    @Prop({ unique: true })
    trackingCode: string;

    @Prop({ required: true })
    jobDate: string;

    @Prop({ default: 'No unit model' })
    unitModel: string;

    @Prop({ default: 'No specs' })
    unitSpecs: string;

    @Prop({ default: 'No accessories' })
    unitAccessories: string;

    @Prop({ required: true })
    workPerformed: string;

    @Prop({ default: 0 })
    sCharge: number;

    @Prop({
        type: [{ type: String, enum: PaymentMethodEnum }],
        default: [PaymentMethodEnum.otc],
    })
    sPayMeth: PaymentMethodEnum;

    @Prop({ default: 0 })
    sDownPayment: number;

    @Prop({ default: 0 })
    sBalance: number;

    @Prop({
        type: [{ type: String, enum: JobStatusEnum }],
        default: [JobStatusEnum.onGoing],
    })
    sStatus: JobStatusEnum;

    @Prop({ default: true })
    // isDropOff
    sUnitDropOff: boolean;

    @Prop({ default: '' })
    sRelDate: string;
    
    @Prop({ default: 'No notes' })
    notes: string;

    // @Prop({ default: true })
    // hasPartsOrdered: boolean;

    // @Prop({ default: 'N/A' })
    // pParts: string;

    // @Prop({ default: 'N/A' })
    // pOrdDate: string;


    // @Prop({ default: 'N/A' })
    // pSupp: string;

    // @Prop({ default: 0 })
    // pPrice: number;

    // @Prop({
    //     type: [{ type: String, enum: DeliveryStatusEnum }],
    //     default: [DeliveryStatusEnum.na],
    // })
    // pOrdStatus: DeliveryStatusEnum;

    // @Prop({ default: 'N/A' })
    // pInstalled: string;

    // @Prop({ default: 0 })
    // pDownPayment: number;

    // @Prop({ default: 0 })
    // pBal: number;

    // @Prop({
    //     type: [{ type: String, enum: OrderStatusEnum }],
    //     default: [OrderStatusEnum.na],
    // })
    // pStatus: OrderStatusEnum;

}

export const JobSchema = SchemaFactory.createForClass(Job);

// Pre-save hook to assign an auto-incremented jobOrderNum
JobSchema.pre('save', async function (next) {
    const doc = this as any; 
    if (doc.isNew) {
      try {
        // Get the Counter model from the same connection using the model registry
        const counterModel = doc.constructor.model('Counter');

            // Try to find the counter document
        let counter = await counterModel.findOne({ _id: 'jobOrderNum' });

        // If counter does not exist, create one with initial value 10000
        if (!counter) {
            counter = await counterModel.create({ _id: 'jobOrderNum', seq: 4000 });
        } else {
            // Increment the counter
            counter = await counterModel.findOneAndUpdate(
            { _id: 'jobOrderNum' },
            { $inc: { seq: 1 } },
            { new: true }
            );
        }
        
        // Assign the auto-incremented value to the document
        doc.jobOrderNum = counter.seq.toString();
        // Generate trackingCode using the last 8 characters of the ObjectID
        doc.trackingCode = doc._id.toString().toUpperCase().slice(-8);

        next();
      } catch (error) {
        next(error);
      }
    } else {
      next();
    }
});