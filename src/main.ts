import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
