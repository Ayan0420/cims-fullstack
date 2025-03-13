import { Module } from '@nestjs/common';
import { CtJomLegacyService } from './ct-jom-legacy.service';
import { CtJomLegacyController } from './ct-jom-legacy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CtJomLegacySchema } from './schemas/ct-jom-legacy.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: 'CtJomLegacy', schema: CtJomLegacySchema }
        ], 'local'),
    ],
    controllers: [CtJomLegacyController],
    providers: [CtJomLegacyService],
})
export class CtJomLegacyModule {}
