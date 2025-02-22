import { Schema, model } from 'mongoose';

export const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 10000 } // starting value, adjust as needed
});

export const Counter = model('Counter', CounterSchema);
