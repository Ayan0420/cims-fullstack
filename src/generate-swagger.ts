import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function generateSwaggerSpec() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Your API')
        .setDescription('The API description')
        .setVersion('1.0')
        .addBearerAuth() // if you use JWT
        .build();

    const document = SwaggerModule.createDocument(app, config);

    fs.writeFileSync('./api-docs.json', JSON.stringify(document, null, 2));

    console.log('Swagger JSON generated successfully!');
    await app.close();
}

generateSwaggerSpec();
