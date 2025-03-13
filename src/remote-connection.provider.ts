// // src/remote-connection.provider.ts
// import { Provider } from '@nestjs/common';
// import { Connection, createConnection } from 'mongoose';
// import { ConfigService } from '@nestjs/config';

// export const remoteConnectionProvider: Provider = {
//   provide: 'remote', // change token to 'remote'
//   useFactory: async (config: ConfigService): Promise<Connection | null> => {
//     const uri = config.get<string>('ATLAS_MONGODB_URI');
//     try {
//       const connection = await createConnection(uri, {
//         serverSelectionTimeoutMS: 5000,
//         connectTimeoutMS: 5000
//       });

//       // Force the connection to be established (or fail)
//       await connection.asPromise();

//       console.log(connection.readyState)
//       console.log('Connected to remote MongoDB from remote-connection.provider');
//       return connection;
//     } catch (error) {
//       console.error('Remote MongoDB connection failed, continuing offline:', error.message);
//       return null;
//     }
//   },
//   inject: [ConfigService],
// };
