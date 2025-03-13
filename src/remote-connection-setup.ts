import { Connection } from 'mongoose';
import { CounterSchema } from './job/schemas/counter.schema';
import { CustomerSchema } from './customer/schemas/user.schema';
import { JobSchema } from './job/schemas/job.schema';

export const registerCounterModel = (connection: Connection) => {
  connection.model('Counter', CounterSchema);
  connection.model('Job', JobSchema);
  connection.model('Customer', CustomerSchema);
};