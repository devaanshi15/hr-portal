import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobPosting, JobPostingSchema } from './job-posting.schema';
import { JobPostingsController } from './job-postings.controller';
import { JobPostingsService } from './job-postings.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: JobPosting.name, schema: JobPostingSchema }])],
  controllers: [JobPostingsController],
  providers: [JobPostingsService],
})
export class JobPostingsModule {}