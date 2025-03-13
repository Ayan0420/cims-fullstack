// src/sync/sync.scheduler.ts
import { Inject, Injectable, Optional } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SyncService } from './sync.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class SyncScheduler {
  constructor(
    private readonly syncService: SyncService,
    // @Optional() @Inject('remote') private remoteConnection?: Connection,
  ) {
    console.log("SyncScheduler initialized...");
  }

  @Cron('*/5 * * * * *') // Run every 30 seconds.
  async handleCron() {
    console.log("Scheduler running: Attempting synchronization...");
    await this.syncService.synchronize();
  }

  // private async checkConnectivity(): Promise<boolean> {
  //     // console.log('this.remoteConnection.readyState from CRON', this.remoteConnection.readyState)
  //     if (!this.remoteConnection) {
  //       console.warn("No remote connection instance available.");
  //       return false;
  //     }
  //   try {
  //     await this.remoteConnection.db.admin().ping();
  //     console.log("Connectivity: ONLINE")
  //     return true;
  //   } catch (error) {
  //     console.log("Connectivity: OFFLINE")
  //     return false;
  //   }
  // }
}
