import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './schemas/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Customer', schema: CustomerSchema },
        ], 'local'),
        AuthModule,
    ],
    controllers: [CustomerController],
    providers: [CustomerService],
})
export class CustomerModule {}
