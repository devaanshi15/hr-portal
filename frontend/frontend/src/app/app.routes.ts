

import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { CreateJob } from './create-job/create-job';
import { ResumeScanner } from './resume-scanner/resume-scanner';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // redirect root to login
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'dashboard', component: Dashboard },
  { path: 'dashboard/create-job', component: CreateJob },
  { path: 'dashboard/resume-scanner', component: ResumeScanner } // New route for ResumeScanner
];
