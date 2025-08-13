import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequiredDocumentsService } from './required-documents.service';
import { RequiredDocumentsController } from './required-documents.controller';
import { RequiredDocument } from './required-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequiredDocument])],
  providers: [RequiredDocumentsService],
  controllers: [RequiredDocumentsController],
  exports: [RequiredDocumentsService]
})
export class RequiredDocumentsModule {}
