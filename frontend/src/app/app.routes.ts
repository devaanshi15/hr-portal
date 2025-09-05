import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { ResumeScannerComponent } from './resume-scanner/resume-scanner.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'job-description', component: JobDescriptionComponent, canActivate: [authGuard] },
  { path: 'resume-scanner', component: ResumeScannerComponent, canActivate: [authGuard] }
];