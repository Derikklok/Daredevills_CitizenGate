import { Controller, Get } from "@nestjs/common";


@Controller()
export class AppController {
  constructor() { }

  @Get()
  getHello() {
    return {
      message: "Hello World!",
      version: "1.0.0",
      status: "ok",
      api_docs: "/api-docs",
      timestamp: new Date().toISOString(),
    }
  }
}
