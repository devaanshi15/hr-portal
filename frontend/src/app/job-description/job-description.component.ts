import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobPosting, JobDetails } from '../job-posting.model';

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit {
  jobPostings: JobPosting[] = [];
  newJob: JobPosting = {
    title: '',
    company: '',
    description: '',
    details: {
      requisitionId: '',
      remoteType: '',
      location: '',
      postingDate: '',
      jobFamily: '',
      timeType: '',
      jobType: '',
      supervisoryOrg: ''
    }
  };
  updateJob: JobPosting = {
    title: '',
    company: '',
    description: '',
    details: {
      requisitionId: '',
      remoteType: '',
      location: '',
      postingDate: '',
      jobFamily: '',
      timeType: '',
      jobType: '',
      supervisoryOrg: ''
    }
  };
  deleteId = '';
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.http.get<JobPosting[]>('http://localhost:3000/job-postings').subscribe({
      next: (res) => {
        this.jobPostings = res;
        this.errorMessage = null;
      },
      error: err => {
        this.errorMessage = 'Failed to load job postings';
        console.error('Failed to load jobs', err);
      }
    });
  }

  createJob() {
    this.http.post('http://localhost:3000/job-postings', this.newJob).subscribe({
      next: () => {
        this.loadJobs();
        this.newJob = {
          title: '',
          company: '',
          description: '',
          details: {
            requisitionId: '',
            remoteType: '',
            location: '',
            postingDate: '',
            jobFamily: '',
            timeType: '',
            jobType: '',
            supervisoryOrg: ''
          }
        };
        this.errorMessage = null;
      },
      error: err => {
        this.errorMessage = 'Failed to create job posting';
        console.error('Failed to create job', err);
      }
    });
  }

  selectForUpdate(job: JobPosting) {
    this.updateJob = { ...job, _id: job._id };
    this.errorMessage = null;
  }

  updateJobFn() {
    if (this.updateJob._id) {
      this.http.put(`http://localhost:3000/job-postings/${this.updateJob._id}`, this.updateJob).subscribe({
        next: () => {
          this.loadJobs();
          this.updateJob = {
            title: '',
            company: '',
            description: '',
            details: {
              requisitionId: '',
              remoteType: '',
              location: '',
              postingDate: '',
              jobFamily: '',
              timeType: '',
              jobType: '',
              supervisoryOrg: ''
            }
          };
          this.errorMessage = null;
        },
        error: err => {
          this.errorMessage = err.status === 404 ? 'Job posting not found' : 'Failed to update job posting';
          console.error('Failed to update job', err);
        }
      });
    }
  }

  deleteJob() {
    if (this.deleteId) {
      this.http.delete(`http://localhost:3000/job-postings/${this.deleteId}`).subscribe({
        next: () => {
          this.loadJobs();
          this.deleteId = '';
          this.errorMessage = null;
        },
        error: err => {
          this.errorMessage = err.status === 404 ? 'Job posting not found' : 'Failed to delete job posting';
          console.error('Failed to delete job', err);
        }
      });
    }
  }
}