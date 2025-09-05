import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume-scanner',
  standalone: true,
  imports: [],
  templateUrl: './resume-scanner.component.html',
  styleUrls: ['./resume-scanner.component.scss']
})
export class ResumeScannerComponent {
  selectedFile: File | null = null;
  score: number | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadAndScore() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http.post('http://localhost:3000/resume/score', formData).subscribe({
        next: (res: any) => {
          this.score = res.score;
        },
        error: err => console.error('Failed to score resume', err)
      });
    }
  }
}