import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({ dest: './uploads' })],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}