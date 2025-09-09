import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  showUserMenu = false;
  userInfo = {
    username: 'John Doe',
    email: 'john.doe@mmc.com'
  };

  stats = {
    jobs: 0,
    resumes: 0,
    candidates: 0,
    jobcodeWise: 0
  };

  constructor(private router: Router, private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error fetching stats:', err);
      }
    });
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}


// import { Component } from '@angular/core';
// import { Router, RouterLink, RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [RouterLink, RouterModule],
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css']
// })
// export class Dashboard {
//   constructor(private router: Router) {}

//   logout() {
//     localStorage.removeItem('token'); // clear auth token
//     this.router.navigate(['/login']);
//   }
// }
