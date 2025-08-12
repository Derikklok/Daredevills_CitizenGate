import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemAdminModule } from './system-admin/system-admin.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:'postgresql://postgres:iamironman0516@db.qntlhmmsysgawoelgkwa.supabase.co:5432/postgres',
      synchronize: true, // ⚠️ Use only in dev
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }) , SystemAdminModule, DepartmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
