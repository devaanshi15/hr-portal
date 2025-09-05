import { Controller, Post, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('resume')
@UseGuards(AuthGuard('jwt'))
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return { filename: file.filename, message: 'Uploaded successfully' };
  }

  @Post('score')
  @UseInterceptors(FileInterceptor('file')) // Reuse for scoring, or separate endpoint
  score(@UploadedFile() file: Express.Multer.File) {
    return this.resumeService.scoreResume(file);
  }
}