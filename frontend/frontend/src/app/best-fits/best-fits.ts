import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BestFitsService } from '../services/bestfits.service';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
    selector: 'app-best-fits',
    standalone: true,
    imports: [RouterLink, RouterModule, CommonModule, FormsModule, NavbarComponent],
    templateUrl: './best-fits.html',
    styleUrls: ['./best-fits.css']
})
export class BestFits implements OnInit {
    jobDescriptions: any[] = [];
    candidates: any[] = [];
    bestFits: any[] = [];
    selectedJD: string = '';
    numRequired: number = 1;

    constructor(private router: Router, private bestFitsService: BestFitsService) { }

    ngOnInit() {
        this.bestFitsService.getJobDescriptions().subscribe({
            next: (data) => {
                this.jobDescriptions = data;
            },
            error: (err) => console.error('Error fetching JDs:', err)
        });
    }

    onJDChange() {
        if (this.selectedJD) {
            this.bestFitsService.getCandidatesForJD(this.selectedJD).subscribe({
                next: (data) => {
                    this.candidates = data;
                },
                error: (err) => console.error('Error fetching candidates:', err)
            });
        }
    }

    getBestFits() {
        if (this.selectedJD && this.numRequired > 0) {
            this.bestFitsService.getBestFits(this.selectedJD, this.numRequired).subscribe({
                next: (data) => {
                    this.bestFits = data;
                },
                error: (err) => console.error('Error fetching best fits:', err)
            });
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
