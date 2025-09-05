export interface JobPosting {
  _id?: string; // Optional, as it's assigned by MongoDB
  title: string;
  company: string;
  description: string;
  details: JobDetails;
}

export interface JobDetails {
  requisitionId: string;
  remoteType: string;
  location: string;
  postingDate: string;
  jobFamily: string;
  timeType: string;
  jobType: string;
  supervisoryOrg: string;
}