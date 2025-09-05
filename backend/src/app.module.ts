import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JobPostingsModule } from './job-postings/job-postings.module';
import { ResumeModule } from './resume/resume.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/hr-app'),
    AuthModule,
    JobPostingsModule,
    ResumeModule,
  ],
})
export class AppModule {}