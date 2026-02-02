import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { TASKS_ROUTES } from './features/tasks/tasks.routes';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => LoginComponent
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadChildren: () => TASKS_ROUTES
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'tasks'
  }
];