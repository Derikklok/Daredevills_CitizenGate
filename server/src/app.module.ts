import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingController } from './booking/booking.controller';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [BookingModule],
  controllers: [AppController, BookingController],
  providers: [AppService],
})
export class AppModule {}
