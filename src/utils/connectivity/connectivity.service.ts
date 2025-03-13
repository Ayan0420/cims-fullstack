// // src/connectivity/connectivity.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectConnection } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';

// @Injectable()
// export class ConnectivityService {
//   constructor(@InjectConnection('remote') private remoteConnection: Connection) {}

//   async isOnline(): Promise<boolean> {
//     try {
//       // This pings the admin database on the remote connection
//       await this.remoteConnection.db.admin().ping();
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }
// }
