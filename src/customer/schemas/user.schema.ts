import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true
})
export class Customer {

    @Prop({required: true})
    cusName: string

    @Prop({required: true})
    cusAddress: string

    @Prop({required: true})
    cusPhone: string

    @Prop({default: "N/A"})
    cusEmail: string

}

export const CustomerSchema = SchemaFactory.createForClass(Customer);