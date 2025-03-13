// src/mongodb.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // Local MongoDB connection (used for offline operations)
    MongooseModule.forRootAsync({
      connectionName: 'local',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('LOCAL_MONGODB_URI'),
      }),
    }),
    // Remote Atlas connection (used during synchronization)
    // MongooseModule.forRootAsync({
    //   connectionName: 'remote',
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     uri: config.get<string>('ATLAS_MONGODB_URI'),
    //   }),
    // }),
  ],
})
export class MongodbModule {}
