

// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-create-job',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './create-job.html',
//   styleUrls: ['./create-job.css']
// })
// export class CreateJob {
//   title = '';
//   description = '';
//   jobs: any[] = [];
//   editingJob: any = null;

//   constructor(private http: HttpClient) {
//     this.fetchJobs();
//   }

//   fetchJobs() {
//     this.http.get<any[]>('http://localhost:5000/api/jobs').subscribe(data => {
//       this.jobs = data;
//     });
//   }

//   createJob() {
//     this.http.post('http://localhost:5000/api/jobs', { title: this.title, description: this.description })
//       .subscribe(() => {
//         this.title = '';
//         this.description = '';
//         this.fetchJobs();
//       });
//   }

//   editJob(job: any) {
//     this.editingJob = { ...job }; 
//   }

//   updateJob() {
//     this.http.put(`http://localhost:5000/api/jobs/${this.editingJob._id}`, this.editingJob)
//       .subscribe(() => {
//         this.editingJob = null;
//         this.fetchJobs();
//       });
//   }

//   cancelEdit() {
//     this.editingJob = null;
//   }

//   deleteJob(id: string) {
//     this.http.delete(`http://localhost:5000/api/jobs/${id}`)
//       .subscribe(() => {
//         this.fetchJobs();
//       });
//   }


// }


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './create-job.html',
  styleUrls: ['./create-job.css']
})
export class CreateJob implements OnInit {
  jobs: any[] = [];

  // 🟢 define newJob
  newJob = {
    title: '',
    description: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getJobs();
  }

  // 🟢 fetch jobs
  getJobs() {
    this.http.get<any[]>('http://localhost:5000/api/jobs')
      .subscribe(res => this.jobs = res);
  }

  // 🟢 add new job
  addJob() {
    this.http.post<any>('http://localhost:5000/api/jobs', this.newJob)
      .subscribe(res => {
        this.jobs.push(res);
        this.newJob = { title: '', description: '' }; // clear form
      });
  }

  // 🟢 delete job
  deleteJob(id: string) {
    this.http.delete(`http://localhost:5000/api/jobs/${id}`)
      .subscribe(() => {
        this.jobs = this.jobs.filter(j => j._id !== id);
      });
  }

  // 🟢 edit job (simplified for now)
  editJob(job: any) {
    const updatedTitle = prompt('Edit Job Title:', job.title);
    const updatedDesc = prompt('Edit Job Description:', job.description);

    if (updatedTitle && updatedDesc) {
      this.http.put<any>(`http://localhost:5000/api/jobs/${job._id}`, {
        title: updatedTitle,
        description: updatedDesc
      }).subscribe(updated => {
        const index = this.jobs.findIndex(j => j._id === job._id);
        this.jobs[index] = updated;
      });
    }
  }

  // 🟢 toggle read more
  toggleReadMore(job: any) {
    job.showFull = !job.showFull;
  }

  logout() {
    // For now, just navigate back to login
    localStorage.removeItem('token'); // optional, if you're storing JWT
    window.location.href = '/';
  }

}
