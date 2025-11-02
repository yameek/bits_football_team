import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3001'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger/OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('Football Team Treasury & Session Management API')
    .setDescription(
      'REST API for managing football team finances, sessions, attendance, and member contributions. ' +
      'Features include member management, field booking, session planning, attendance tracking with automatic fee allocation, ' +
      'contributions, on-field payments, and comprehensive financial reports.',
    )
    .setVersion('1.0')
    .setContact(
      'Treasurer',
      'https://github.com/yourusername/football-treasury',
      'treasurer@footballteam.com',
    )
    .setLicense('Private', '')
    .addTag('members', 'Member management and balances')
    .addTag('fields', 'Field/location management')
    .addTag('categories', 'Transaction category management')
    .addTag('sessions', 'Session planning and scheduling')
    .addTag('attendance', 'Attendance tracking')
    .addTag('transactions', 'Financial transactions')
    .addTag('reports', 'Reports and analytics')
    .addTag('exports', 'Data exports (CSV/PDF)')
    .addTag('auth', 'Authentication (optional RBAC)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token (optional, only if RBAC is enabled)',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Football Treasury API',
    customfavIcon: '⚽',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
  console.log(`⚽ Football Team Treasury API v1.0\n`);
}
bootstrap();
