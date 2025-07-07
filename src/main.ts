import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { fork } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

async function runDBSyncScripts() {
    console.log('Running DB synchronization service...');

    let watchdogProcess: any;
    let syncServicePath: any;
    function startSyncService() {
        syncServicePath = path.join(
            __dirname,
            'utils',
            'db-sync',
            'connection-watchdog.js',
        );

        // Explicitly pass process.env to the child process
        watchdogProcess = fork(syncServicePath, {
            cwd: __dirname,
            env: process.env,
        });

        watchdogProcess.on('message', (msg) => {
            if (msg.connectivity) {
                console.log(`MAIN: Connectivity status: ${msg.connectivity}`);
                // forward the message to your renderer process:
                // if (mainWindow) {
                //     mainWindow.webContents.send(
                //         'connectivity-status',
                //         msg.connectivity,
                //     );
                // }
            }

            // console.log('msg', msg)

            if (msg.syncStatus === 0 || msg.syncStatus === 1) {
                // console.log(`MAIN: Sync status: ${msg.message}`);
                // // forward the message to your renderer process:
                // if (mainWindow) {
                //     mainWindow.webContents.send('sync-status', msg);
                // }
            }
        });

        watchdogProcess.on('error', (err) => {
            console.error('Sync Service Error: ', err);
        });

        watchdogProcess.on('exit', (code: any, signal: any) => {
            console.log('Sync Service exited: ', code, signal);
            // Optionally, restart or handle the exit logic here.
        });
    }

    startSyncService();
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    // app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('CIMS API')
        .setDescription('API Documentation for CIMS backend services')
        .setVersion('1.0')
        .addTag('API')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    // Generate JSON file
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));

    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
    await runDBSyncScripts();
}
bootstrap();
