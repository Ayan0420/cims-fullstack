import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query, UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @UseGuards(AuthGuard())
    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customerService.create(createCustomerDto);
    }

    @UseGuards(AuthGuard())
    @Get()
    findAll(@Query() query: ExpressQuery) {
        return this.customerService.findAll(query);
    }

    @UseGuards(AuthGuard())
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.customerService.findOne(id);
    }

    @UseGuards(AuthGuard())
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCustomerDto: UpdateCustomerDto,
    ) {
        return this.customerService.update(id, updateCustomerDto);
    }

    @UseGuards(AuthGuard())
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.customerService.remove(id);
    }
}
