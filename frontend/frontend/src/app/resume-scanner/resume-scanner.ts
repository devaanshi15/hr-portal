// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-resume-scanner',
//   imports: [],
//   templateUrl: './resume-scanner.html',
//   styleUrl: './resume-scanner.css'
// })
// export class ResumeScanner {

// }


import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-resume-scanner',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './resume-scanner.html',
  styleUrls: ['./resume-scanner.css']
})
export class ResumeScanner {
  uploadedFileId: string | null = null;
  analysis: any = null;

  constructor(private http: HttpClient) {}

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) this.uploadFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.uploadFile(file);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('resume', file);

    this.http.post<any>('http://localhost:5000/api/resume/upload', formData).subscribe(res => {
      this.uploadedFileId = res.resumeId;
      alert('File uploaded successfully');
    });
  }

  analyseResume() {
    if (!this.uploadedFileId) return;

    this.http.post<any>(`http://localhost:5000/api/resume/analyse/${this.uploadedFileId}`, {})
      .subscribe(res => {
        this.analysis = res.analysis;
      });
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
