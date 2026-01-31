import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, AdminStats } from '../../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, tasks, and monitor platform activity</p>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card">
          <div class="stat-icon users">
            <span class="material-icons">people</span>
          </div>
          <div class="stat-info">
            <h3>{{ stats.total_users }}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon banned">
            <span class="material-icons">block</span>
          </div>
          <div class="stat-info">
            <h3>{{ stats.banned_users }}</h3>
            <p>Banned Users</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon tasks">
            <span class="material-icons">task</span>
          </div>
          <div class="stat-info">
            <h3>{{ stats.total_tasks }}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon flagged">
            <span class="material-icons">flag</span>
          </div>
          <div class="stat-info">
            <h3>{{ stats.flagged_tasks }}</h3>
            <p>Flagged Tasks</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon applications">
            <span class="material-icons">assignment</span>
          </div>
          <div class="stat-info">
            <h3>{{ stats.total_applications }}</h3>
            <p>Applications</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon completed">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="stat-info">
            <h3>{{ stats.completed_tasks }}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="admin-nav">
        <a routerLink="/admin/users" class="nav-card">
          <span class="material-icons">manage_accounts</span>
          <h3>User Management</h3>
          <p>Manage and moderate users</p>
        </a>

        <a routerLink="/admin/tasks" class="nav-card">
          <span class="material-icons">assignment</span>
          <h3>Task Management</h3>
          <p>Review and manage tasks</p>
        </a>



        <a routerLink="/admin/reports" class="nav-card">
  <span class="material-icons">analytics</span>
  <h3>Reports & Analytics</h3>
  <p>Platform insights and reports</p>
</a>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: var(--white);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 16px var(--shadow-light);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.users { background: #E3F2FD; color: #1976D2; }
    .stat-icon.banned { background: #FFEBEE; color: #D32F2F; }
    .stat-icon.tasks { background: #E8F5E8; color: #388E3C; }
    .stat-icon.flagged { background: #FFF3E0; color: #F57C00; }
    .stat-icon.applications { background: #F3E5F5; color: #7B1FA2; }
    .stat-icon.completed { background: #E8F5E8; color: #388E3C; }

    .stat-icon .material-icons {
      font-size: 2rem;
    }

    .stat-info h3 {
      font-size: 2rem;
      margin: 0;
      color: var(--text-dark);
    }

    .stat-info p {
      margin: 0;
      color: var(--text-gray);
    }

    .admin-nav {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .nav-card {
      background: var(--white);
      border-radius: 1rem;
      padding: 2rem;
      text-decoration: none;
      color: inherit;
      text-align: center;
      box-shadow: 0 4px 16px var(--shadow-light);
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .nav-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary-green);
      text-decoration: none;
      color: inherit;
    }

    .nav-card .material-icons {
      font-size: 3rem;
      color: var(--primary-green);
      margin-bottom: 1rem;
    }

    .nav-card h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .nav-card p {
      margin: 0;
      color: var(--text-gray);
    }

    @media (max-width: 768px) {
      .admin-dashboard {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }

      .admin-nav {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {

  stats: AdminStats | null = null;
  loading = false;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = '';

    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.error = 'Failed to load statistics';
        this.loading = false;
      }
    });
  }

}
