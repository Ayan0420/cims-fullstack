// src/remote-connection.module.ts
import { Module } from '@nestjs/common';
import { RemoteConnectionService } from './remote-connection.service';
// import { remoteConnectionProvider } from './remote-connection.provider';

@Module({
  providers: [RemoteConnectionService],
  exports: [RemoteConnectionService],
})
export class RemoteConnectionModule {}
