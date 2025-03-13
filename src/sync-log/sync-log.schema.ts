// src/sync-log/sync-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SyncLogDocument = SyncLog & Document;

@Schema()
export class SyncLog {
  @Prop({ required: true })
  operation: string; // e.g., 'createJob'

  @Prop({ type: Object, required: true })
  payload: any; // The CreateJobDto or additional context

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: false })
  synced: boolean;
}

export const SyncLogSchema = SchemaFactory.createForClass(SyncLog);
