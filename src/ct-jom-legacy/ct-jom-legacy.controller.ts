import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CtJomLegacyService } from './ct-jom-legacy.service';
import { CreateCtJomLegacyDto } from './dto/create-ct-jom-legacy.dto';
import { UpdateCtJomLegacyDto } from './dto/update-ct-jom-legacy.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';

@Controller('legacy')
export class CtJomLegacyController {
    constructor(private readonly ctJomLegacyService: CtJomLegacyService) {}

    @Post()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    create(@Body() createCtJomLegacyDto: CreateCtJomLegacyDto) {
        // console.log('createCtJomLegacyDto ', createCtJomLegacyDto);
        return this.ctJomLegacyService.create(createCtJomLegacyDto);
    }

    @Get()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    findAll(@Query() query: ExpressQuery) {
        return this.ctJomLegacyService.findAll(query);
    }

    @Get(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    findOne(@Param('id') id: string) {
        return this.ctJomLegacyService.findOne(id);
    }

    @Put(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    update(
        @Param('id') id: string,
        @Body() updateCtJomLegacyDto: UpdateCtJomLegacyDto,
    ) {
        return this.ctJomLegacyService.update(id, updateCtJomLegacyDto);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    remove(@Param('id') id: string) {
        return this.ctJomLegacyService.remove(id);
    }
}
