import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Customer } from './schemas/user.schema';
import { getSearchForCustomerArray } from '../utils/utilities';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name)
        private customerModel: Model<Customer>,
    ) {}

    async create(createCustomerDto: CreateCustomerDto) {
        const customer = new this.customerModel(createCustomerDto);
        const result = await customer.save();
        return result;
    }

    async findAll(query: ExpressQuery) {
        // used for pagination, showing 2 items per page
        const resPerPage = 15;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        // used for search functionality from the query params
        const keyword = query.keyword
            ? {
                  $or: getSearchForCustomerArray(query),
              }
            : {};
        const customers = await this.customerModel
            .find({ ...keyword })
            .limit(resPerPage)
            .skip(skip);

        return customers;
    }

    async findOne(id: string) {
        const isValidObjectId = mongoose.isValidObjectId(id);

        if (!isValidObjectId) {
            throw new BadRequestException('Invalid customer id');
        }

        const customer = await this.customerModel.findById(id)
                                    .populate({
                                        path: 'jobOrders',
                                        select: ['jobOrderNum', 'workPerformed', 'unitModel', 'sStatus', 'jobDate'],
                                        populate: {
                                            path: 'customerId',
                                            select: ['cusName'],
                                        },
                                        options: {
                                            sort: {
                                                createdAt: -1
                                            }
                                        }
                                    })
        // console.log(customer);
        if (!customer) {
            throw new NotFoundException('Customer not found');
        }
        return customer;
    }

    async update(id: string, updateCustomerDto: UpdateCustomerDto) {
        const isValidObjectId = mongoose.isValidObjectId(id);
        if (!isValidObjectId) {
            throw new BadRequestException('Invalid customer id');
        }

        const updatedCustomer = await this.customerModel.findByIdAndUpdate(
            id,
            updateCustomerDto,
            {
                new: true,
            },
        );

        if (!updatedCustomer) {
            throw new NotFoundException('Customer not found');
        }

        return updatedCustomer;
    }

    async remove(id: string) {
        const isValidObjectId = mongoose.isValidObjectId(id);
        if (!isValidObjectId) {
            throw new BadRequestException('Invalid customer id');
        }
        const result = await this.customerModel.findByIdAndDelete(id);

        if (!result) {
            throw new NotFoundException('Customer not found');
        }

        return result;
    }
}
