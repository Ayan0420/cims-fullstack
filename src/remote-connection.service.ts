// src/remote-connection.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Connection, createConnection } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RemoteConnectionService {
  private remoteConnection: Connection | null = null;
  private readonly logger = new Logger(RemoteConnectionService.name);

  constructor(private readonly configService: ConfigService) {
    // Start a polling loop that attempts to reconnect every 10 seconds if not connected
    setInterval(async () => {
      if (!this.remoteConnection) {
        this.logger.log('Periodic reconnect attempt...');
        await this.connect();
      }
    }, 10000); // every 10 seconds
  }

  /**
   * Attempts to create a remote connection.
   */
  async connect(): Promise<Connection | null> {
    const uri = this.configService.get<string>('ATLAS_MONGODB_URI');
    try {
      const connection = createConnection(uri, {
        serverSelectionTimeoutMS: 5000, // fail fast if unreachable
        connectTimeoutMS: 5000,
      });
      // Force the connection attempt to complete
      await connection.asPromise();
      this.logger.log('Connected to remote MongoDB');
      this.remoteConnection = connection;
      return connection;
    } catch (error) {
      this.logger.error(
        'Remote MongoDB connection failed, continuing offline:',
        error.message,
      );
      this.remoteConnection = null;
      return null;
    }
  }

  /**
   * Returns the current remote connection (if available).
   */
  getConnection(): Connection | null {
    return this.remoteConnection;
  }
}
