import { Injectable, OnModuleInit } from '@nestjs/common';
const bonjour = require('bonjour')();

@Injectable()
export class BonjourService implements OnModuleInit {
    onModuleInit() {
        bonjour.publish({
            name: 'cims-server',
            type: 'http',
            port: 4444,
            txt: {
                version: '1.0.0',
            },
        });
        console.log('Bonjour service started');
    }
}