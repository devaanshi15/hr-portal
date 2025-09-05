import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class JobPosting extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Object })
  details: {
    requisitionId: string;
    remoteType: string;
    location: string;
    postingDate: Date;
    jobFamily: string;
    timeType: string;
    jobType: string;
    supervisoryOrg: string;
  };
}

export const JobPostingSchema = SchemaFactory.createForClass(JobPosting);