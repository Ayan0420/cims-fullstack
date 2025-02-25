import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // Adjust the rootPath to point to your React build folder
      rootPath: join(__dirname, '..', 'client', 'dist'),
      // Optionally, specify a URL prefix where the app will be served (e.g., '/client')
      // serveRoot: '/client',
    }),
  ],
})
export class ClientModule {}
