import { Routes } from '@angular/router';
import { adminGuard } from './components/pages/admin/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
      },
      {
        path: 'tasks',
        loadComponent: () => import('./components/pages/task-feed/task-feed.component').then(m => m.TaskFeedComponent)
      },
      {
        path: 'task/:id',
        loadComponent: () => import('./components/pages/task-details/task-details.component').then(m => m.TaskDetailsComponent)
      },
      {
        path: 'post-task',
        loadComponent: () => import('./components/pages/post-task/post-task.component').then(m => m.PostTaskComponent)
      },
      {
        path: 'my-tasks',
        loadComponent: () => import('./components/pages/my-tasks/my-tasks.component').then(m => m.MyTasksComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./components/pages/applications/applications.component').then(m => m.ApplicationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'offers',
        loadComponent: () => import('./components/pages/offers/offers.component').then(m => m.OffersComponent)
      }
    ]
  },
  // Move admin route BEFORE the wildcard route
  {
    path: 'admin',
    loadComponent: () => import('./components/pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/pages/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./components/pages/admin/admin-tasks/admin-tasks.component').then(m => m.AdminTasksComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/pages/admin/admin-reports/admin-reports.component').then(m => m.AdminReportsComponent)
      }
    ]
  },
  // Only ONE wildcard route at the end
  {
    path: '**',
    redirectTo: ''
  }
];
