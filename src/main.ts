import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    let env = process.env.ENV;
    const options = new DocumentBuilder()
        .setTitle('DocumentGenerator API doc')
        .setDescription('The document generator API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/documents/dev/docs', app, document);

    await app.listen(process.env.PORT || 8080);
}
bootstrap();
