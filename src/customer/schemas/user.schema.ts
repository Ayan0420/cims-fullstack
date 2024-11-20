import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Job } from '../../job/schemas/job.schema';

@Schema({
    timestamps: true,
})
export class Customer {
    @Prop({ required: true })
    cusName: string;

    @Prop({ required: true })
    cusAddress: string;

    @Prop({ required: true })
    cusPhone: string;

    @Prop({ default: 'N/A' })
    cusEmail: string;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Job', default: [] })
    jobOrders: Job[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
