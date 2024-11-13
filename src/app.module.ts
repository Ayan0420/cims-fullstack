import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CtJomLegacyModule } from './ct-jom-legacy/ct-jom-legacy.module';
import { MongodbModule } from './mongodb.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ReportGeneratorModule } from './utils/report-generator/report-generator.module';
import { SalesModule } from './sales/sales.module';

@Module({
    imports: [
        CtJomLegacyModule,
        MongodbModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        ReportGeneratorModule,
        SalesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
