// src/sync/sync.service.ts
import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { SyncLog, SyncLogDocument } from 'src/sync-log/sync-log.schema';
import { CreateJobDto } from 'src/job/dto/create-job.dto';
import { JobService } from 'src/job/job.service';
import { RemoteConnectionService } from '../remote-connection.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectModel(SyncLog.name, 'local') private syncLogModel: Model<SyncLogDocument>,
    private readonly jobService: JobService, // Reuse business logic
    private readonly remoteConnectionService: RemoteConnectionService
    // @Optional() @InjectConnection('remote') private remoteConnection?: Connection,
  ) {}

  async synchronize() {

    const remoteConnection = this.remoteConnectionService.getConnection();

    if (!remoteConnection) {
      this.logger.warn('Remote connection is still unavailable. Skipping synchronization.');
      return;
    }

    this.logger.log('Remote connection is available. Proceeding with synchronization...');

    // SYNC LOGIC
    const unsyncedOps = await this.syncLogModel.find({ synced: false }).exec();
    console.log("Syncronizing...")
    for (const op of unsyncedOps) {
      try {
        if (op.operation === 'createJob') {
          // Retrieve the payload (the CreateJobDto)
          const createJobDto: CreateJobDto = op.payload;
          console.log(createJobDto.jobOrderNum)
          // Re-run the job creation logic on the remote database.
          await this.jobService.createJobTransaction(createJobDto, true);
        }
        // Mark the operation as synced.
        op.synced = true;
        await op.save();
      } catch (error) {
        this.logger.error(`Failed to sync operation ${op._id}: ${error.message}`);
        // Optionally add retry logic.
      }
    }
    console.log("Syncronization complete! Successfully synced", unsyncedOps.length, "operations.");
  }
  
}
