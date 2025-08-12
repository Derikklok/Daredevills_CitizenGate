import { Controller, Get } from "@nestjs/common";

@Controller("bookings")
export class BookingsController {
  @Get()
  getAllBookings(): string {
    return "This action returns all bookings";
  }
}
