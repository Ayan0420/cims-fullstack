import { Controller, Get, Sse } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SyncStatusService } from './sync-status.service';

@Controller('sync')
export class SyncStatusController {
  constructor(private readonly syncStatusService: SyncStatusService) {}

  @Get('status')
  getStatus() {
    return this.syncStatusService.getSnapshot();
  }

  @Sse('events')
  events(): Observable<MessageEvent> {
    return this.syncStatusService.stream();
  }
}
