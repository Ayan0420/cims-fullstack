import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class CtJomLegacy {
    @Prop({ required: true, unique: true })
    job_id: string;

    @Prop()
    tracking_code: string;

    @Prop({ required: true })
    job_date: string;

    @Prop({ required: true })
    cus_name: string;

    @Prop({ required: true })
    cus_address: string;

    @Prop({ required: true })
    cus_phone: string;

    @Prop({ default: 'No Model' })
    unit_model: string;

    @Prop({ default: 'No Specs' })
    unit_specs: string;

    @Prop({ default: 'No Accessories' })
    unit_accessories: string;

    @Prop({ required: true })
    work_perf: string;

    @Prop({ required: true, default: 0 })
    s_charge: number;

    @Prop({ required: true })
    s_paymeth: string;

    @Prop({ required: true, default: 0 })
    s_downpay: number;

    @Prop({ required: true, default: 0 })
    s_bal: number;

    @Prop({ required: true })
    s_status: string;

    @Prop({ default: 'N/A' })
    p_parts: string;

    @Prop()
    p_ord_date: string;

    @Prop()
    p_unit_do: string;

    @Prop({ default: 'N/A' })
    p_supp: string;

    @Prop({ default: 0 })
    p_price: number;

    @Prop()
    p_ord_status: string;

    @Prop()
    p_installed: string;

    @Prop({ default: 0 })
    p_downpay: number;

    @Prop({ default: 0 })
    p_bal: number;

    @Prop()
    p_status: string;

    @Prop()
    p_rel_date: string;
}

export const CtJomLegacySchema = SchemaFactory.createForClass(CtJomLegacy);
