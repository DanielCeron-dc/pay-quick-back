import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // use the NestExpressApplication type to get access to express-specific APIs
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // configure the query parser to maintain the same behaviour as Express v4
  // which supports nested query strings and arrays.  Starting with Express v5,
  // NestJS uses a simplified parser by default.  See the NestJS v11 migration
  // guide for details【668386019051235†L301-L329】.
  app.set('query parser', 'extended');
  // enable validation for all DTOs and automatically strip unknown properties
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend listening on port ${port}`);
}

bootstrap();