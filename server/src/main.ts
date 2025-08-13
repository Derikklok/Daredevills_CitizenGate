import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

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
    .setDescription("API documentation for the CitizenGate application. This contains all the RESTful endpoints for the application.")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
