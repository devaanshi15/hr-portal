import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JobPostingsService } from './job-postings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('job-postings')
@UseGuards(AuthGuard('jwt'))
export class JobPostingsController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.jobPostingsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.jobPostingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const job = await this.jobPostingsService.findOne(id);
    if (!job) {
      throw new HttpException('Job posting not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const job = await this.jobPostingsService.update(id, updateDto);
    if (!job) {
      throw new HttpException('Job posting not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const job = await this.jobPostingsService.delete(id);
    if (!job) {
      throw new HttpException('Job posting not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }
}