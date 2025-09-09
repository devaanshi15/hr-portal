import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-resume-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule, NavbarComponent],
  templateUrl: './resume-scanner.html',
  styleUrls: ['./resume-scanner.css']
})
export class ResumeScanner implements OnInit {
  jobs: any[] = [];
  selectedJdId: string = '';
  candidateName: string = '';

  uploadedFileId: string | null = null;
  uploadedFileName = '';
  isDragging = false;

  analysis: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/api/jobs').subscribe(j => this.jobs = j);
  }

  onFileSelect(ev: any) {
    const file: File = ev.target.files[0];
    if (file) this.upload(file);
  }
  onDragOver(ev: DragEvent) { ev.preventDefault(); this.isDragging = true; }
  onDragLeave(ev: DragEvent) { ev.preventDefault(); this.isDragging = false; }
  onDrop(ev: DragEvent) {
    ev.preventDefault(); this.isDragging = false;
    const file = ev.dataTransfer?.files?.[0];
    if (file) this.upload(file);
  }

  upload(file: File) {
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }
    if (!this.selectedJdId) {
      alert('Please select a Job Description first.');
      return;
    }

    const fd = new FormData();
    fd.append('resume', file);
    this.http.post<any>(`http://localhost:5000/api/resume/upload?jdId=${this.selectedJdId}&candidateName=${encodeURIComponent(this.candidateName || '')}`, fd)
      .subscribe(res => {
        this.uploadedFileId = res.resumeId;
        this.uploadedFileName = file.name;
        this.analysis = null;
        alert('Resume uploaded. You can now click AI Score.');
      }, err => {
        alert(err.error?.error || 'Upload failed');
      });
  }

  analyse() {
    if (!this.uploadedFileId) return;
    this.http.post<any>(`http://localhost:5000/api/resume/analyse/${this.uploadedFileId}`, {})
      .subscribe(res => {
        this.analysis = res.analysis;
      }, err => {
        alert(err.error?.error || 'Analysis failed');
      });
  }

  exportCsv() {
    if (!this.selectedJdId) { alert('Select JD for export'); return; }
    window.open(`http://localhost:5000/api/resume/export.csv?jdId=${this.selectedJdId}`, '_blank');
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}





// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { RouterLink, RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-resume-scanner',
//   standalone: true,
//   imports: [CommonModule, RouterLink, RouterModule],
//   templateUrl: './resume-scanner.html',
//   styleUrls: ['./resume-scanner.css']
// })
// export class ResumeScanner {
//   uploadedFileId: string | null = null;
//   analysis: any = null;

//   constructor(private http: HttpClient) {}

//   onFileSelect(event: any) {
//     const file = event.target.files[0];
//     if (file) this.uploadFile(file);
//   }

//   onDragOver(event: DragEvent) {
//     event.preventDefault();
//   }

//   onFileDrop(event: DragEvent) {
//     event.preventDefault();
//     const file = event.dataTransfer?.files[0];
//     if (file) this.uploadFile(file);
//   }

//   uploadFile(file: File) {
//     const formData = new FormData();
//     formData.append('resume', file);

//     this.http.post<any>('http://localhost:5000/api/resume/upload', formData).subscribe(res => {
//       this.uploadedFileId = res.resumeId;
//       alert('File uploaded successfully');
//     });
//   }

//   analyseResume() {
//     if (!this.uploadedFileId) return;

//     this.http.post<any>(`http://localhost:5000/api/resume/analyse/${this.uploadedFileId}`, {})
//       .subscribe(res => {
//         this.analysis = res.analysis;
//       });
//   }

//   logout() {
//     localStorage.removeItem('token');
//     window.location.href = '/';
//   }
// }
