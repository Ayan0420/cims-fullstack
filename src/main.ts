import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
