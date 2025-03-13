import { Inject, Module, OnModuleInit, Optional } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CtJomLegacyModule } from './ct-jom-legacy/ct-jom-legacy.module';
import { MongodbModule } from './mongodb.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ReportGeneratorModule } from './utils/report-generator/report-generator.module';
import { JobModule } from './job/job.module';
import { CustomerModule } from './customer/customer.module';
import { DataVisModule } from './data-vis/data-vis.module';
import { ClientModule } from './client.module';
import { SyncLogModule } from './sync-log/sync-log.module';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { registerCounterModel } from './remote-connection-setup';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncModule } from './sync/sync.module';
import { RemoteConnectionModule } from './remote-connection.module';

@Module({
    imports: [
        CtJomLegacyModule,
        MongodbModule,
        RemoteConnectionModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        ScheduleModule.forRoot(),
        ReportGeneratorModule,
        JobModule,
        CustomerModule,
        DataVisModule,
        ClientModule,
        SyncLogModule,
        SyncModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
// export class AppModule {}

export class AppModule implements OnModuleInit {
    constructor(
        @Optional() @Inject('remote') private readonly remoteConnection?: Connection,
    ) {}
  
    onModuleInit() {
        // console.log(this.remoteConnection.readyState)
        if (this.remoteConnection) {
            if (this.remoteConnection.readyState === 1) {
                registerCounterModel(this.remoteConnection);
            } else {
                // If it's still connecting (or not yet connected), wait for the 'open' event
                this.remoteConnection.once('open', () => {
                console.log('Remote connection is now open.');
                registerCounterModel(this.remoteConnection);
                });
                this.remoteConnection.on('error', (err) => {
                console.error('Error on remote connection:', err);
                });
            }
        } else {
        console.warn('Remote DB is unavailable. Running in offline mode.');
        }
    }
}

