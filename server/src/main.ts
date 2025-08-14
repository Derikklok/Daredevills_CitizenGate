import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Enable validation pipes for DTOs
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Auto-transform payloads to DTO instances
    whitelist: true, // Strip non-whitelisted properties
    forbidNonWhitelisted: true, // Throw errors for non-whitelisted properties
  }));

  // Enable CORS for frontend integration
  app.enableCors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Vite dev server and potential frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Enable Swagger
  const config = new DocumentBuilder()
    .setTitle("API Documentation - CitizenGate")
    .setDescription("API documentation for the CitizenGate application. This contains all the RESTful endpoints for the application. Most of the endpoints require authentication. You can get the JWT token from the Clerk frontend by calling the `getToken` function.")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "JWT token for authentication. You can get the JWT token from the Clerk frontend by calling the `getToken` function.",
      in: "header",
    })
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
