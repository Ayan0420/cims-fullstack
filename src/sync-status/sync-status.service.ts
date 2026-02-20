import { Injectable } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common';
import { merge, Observable, of, Subject } from 'rxjs';

type ConnectivityState = 'online' | 'offline' | 'unknown';

interface WatchdogMessage {
  connectivity?: 'online' | 'offline';
  syncStatus?: number;
  message?: string;
}

export interface SyncStatusSnapshot {
  connectivity: ConnectivityState;
  syncStatus: number | null;
  message: string | null;
  updatedAt: string;
}

@Injectable()
export class SyncStatusService {
  private readonly events$ = new Subject<MessageEvent>();

  private snapshot: SyncStatusSnapshot = {
    connectivity: 'unknown',
    syncStatus: null,
    message: null,
    updatedAt: new Date().toISOString(),
  };

  getSnapshot(): SyncStatusSnapshot {
    return this.snapshot;
  }

  stream(): Observable<MessageEvent> {
    return merge(of({ data: this.snapshot }), this.events$.asObservable());
  }

  publishWatchdogMessage(message: WatchdogMessage): void {
    if (message.connectivity === 'online' || message.connectivity === 'offline') {
      this.snapshot = {
        ...this.snapshot,
        connectivity: message.connectivity,
        updatedAt: new Date().toISOString(),
      };
      this.events$.next({
        data: {
          type: 'connectivity',
          connectivity: message.connectivity,
          updatedAt: this.snapshot.updatedAt,
        },
      });
    }

    if (message.syncStatus === 0 || message.syncStatus === 1) {
      this.snapshot = {
        ...this.snapshot,
        syncStatus: message.syncStatus,
        message: message.message ?? null,
        updatedAt: new Date().toISOString(),
      };
      this.events$.next({
        data: {
          type: 'sync',
          syncStatus: message.syncStatus,
          message: message.message ?? null,
          updatedAt: this.snapshot.updatedAt,
        },
      });
    }
  }
}
