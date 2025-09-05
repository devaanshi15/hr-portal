import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobPosting } from './job-posting.schema';

@Injectable()
export class JobPostingsService {
  constructor(@InjectModel(JobPosting.name) private jobPostingModel: Model<JobPosting>) {}

  async create(createDto: any): Promise<JobPosting> {
    const created = new this.jobPostingModel(createDto);
    return created.save();
  }

  async findAll(): Promise<JobPosting[]> {
    return this.jobPostingModel.find().exec();
  }

  async findOne(id: string): Promise<JobPosting | null> {
    return this.jobPostingModel.findById(id).exec();
  }

  async update(id: string, updateDto: any): Promise<JobPosting | null> {
    return this.jobPostingModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async delete(id: string): Promise<JobPosting | null> {
    return this.jobPostingModel.findByIdAndDelete(id).exec();
  }
}