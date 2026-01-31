// admin-layout.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service'; // Import UserService

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <div *ngIf="isAdmin()" class="admin-badge">
<h2>Admin Panel</h2>
</div>

          <div class="user-info" *ngIf="userService.getCurrentUser()">
            <small>Logged in as: {{ userService.getDisplayName() }}</small>
          </div>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
            <span class="material-icons">dashboard</span>
            Dashboard
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
            <span class="material-icons">people</span>
            User Management
          </a>
          <a routerLink="/admin/tasks" routerLinkActive="active" class="nav-item">
            <span class="material-icons">assignment</span>
            Task Management
          </a>
          <a routerLink="/admin/reports" routerLinkActive="active" class="nav-item">
            <span class="material-icons">analytics</span>
            Reports & Analytics
          </a>
          <a routerLink="/dashboard" class="nav-item back-to-app">
            <span class="material-icons">arrow_back</span>
            Back to App
          </a>
        
        </nav>
      </aside>

      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .admin-sidebar {
      width: 280px;
      background: white;
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .sidebar-header h2 {
      margin: 0;
      color: #4CAF50;
      font-size: 1.5rem;
    }

    .user-info {
      margin-top: 0.5rem;
      color: #666;
      font-size: 0.875rem;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      text-decoration: none;
      color: #333;
      transition: all 0.3s ease;
      border-left: 4px solid transparent;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
    }

    .nav-item:hover {
      background: #f0f9f0;
      color: #4CAF50;
    }

    .nav-item.active {
      background: #e8f5e8;
      color: #4CAF50;
      border-left-color: #4CAF50;
    }

    .nav-item .material-icons {
      font-size: 1.25rem;
    }

    .back-to-app {
      margin-top: auto;
      border-top: 1px solid #e0e0e0;
      background: #f0f9f0;
    }

    .logout-btn {
      color: #d32f2f;
    }

    .logout-btn:hover {
      background: #ffebee;
      color: #d32f2f;
    }

    .admin-content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .admin-sidebar {
        width: 100%;
        position: fixed;
        height: 100vh;
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .admin-sidebar.open {
        transform: translateX(0);
      }

      .admin-content {
        padding: 1rem;
      }
    }
  `]
})
export class AdminLayoutComponent {
  userService = inject(UserService); // Inject UserService

  logout(): void {
    this.userService.logout();
    // You might want to navigate to login page after logout
    // this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }
}
