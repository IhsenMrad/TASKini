import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="material-icons">check_circle</span>
        <span>TASKini</span>
      </div>
      <nav class="sidebar-nav">
        <a routerLink="/dashboard/tasks" routerLinkActive="active" class="sidebar-link">
          <span class="material-icons">home</span>
          <span>Home</span>
        </a>
        <a routerLink="/dashboard/post-task" routerLinkActive="active" class="sidebar-link">
          <span class="material-icons">add_circle</span>
          <span>Post a Task</span>
        </a>
        <a routerLink="/dashboard/my-tasks" routerLinkActive="active" class="sidebar-link">
          <span class="material-icons">assignment</span>
          <span>My Tasks</span>
          <span *ngIf="myTasksCount > 0" class="badge">{{ myTasksCount }}</span>
        </a>
        <a routerLink="/dashboard/offers" routerLinkActive="active" class="sidebar-link">
          <span class="material-icons">local_offer</span>
          <span>Offers</span>
        </a>
        <a routerLink="/dashboard/applications" routerLinkActive="active" class="sidebar-link">
          <span class="material-icons">work</span>
          <span>Tasks I Applied To</span>
        </a>
        <a routerLink="/dashboard/profile" routerLinkActive="active" class="sidebar-link">
          <span class="material-icons">person</span>
          <span>Profile</span>
        </a>

        <!-- Admin Dashboard Link (Only for Admin Users) -->
        <a *ngIf="isAdminUser"
           routerLink="/admin"
           routerLinkActive="active"
           class="sidebar-link admin-link">
          <span class="material-icons">admin_panel_settings</span>
          <span>Admin Dashboard</span>
        </a>

        <a (click)="logout()" class="sidebar-link logout">
          <span class="material-icons">logout</span>
          <span>Logout</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      background: var(--white);
      border-right: 1px solid var(--border-light);
      position: fixed;
      top: 0;
      left: 0;
      overflow-y: auto;
      z-index: 50;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-green);
      border-bottom: 1px solid var(--border-light);
    }

    .sidebar-brand .material-icons {
      font-size: 2rem;
    }

    .sidebar-nav {
      padding: 1.5rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      color: var(--text-gray);
      font-weight: 500;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
    }

    .sidebar-link:hover {
      background: var(--bg-greenish);
      color: var(--primary-green);
    }

    .sidebar-link.active {
      background: var(--bg-greenish);
      color: var(--primary-green);
      border-right: 3px solid var(--primary-green);
    }

    .sidebar-link .material-icons {
      font-size: 1.5rem;
    }

    .badge {
      background: var(--primary-green);
      color: white;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      font-size: 0.75rem;
      margin-left: auto;
      align-self: center;
    }

    .sidebar-link.logout {
      margin-top: auto;
      color: var(--text-light);
    }

    .sidebar-link.logout:hover {
      background: #FFEBEE;
      color: #D32F2F;
    }

    /* Admin link specific styles */
    .sidebar-link.admin-link {
      background: rgba(76, 175, 80, 0.1);
      color: var(--primary-green);
      border-left: 4px solid var(--primary-green);
      margin: 1rem 0;
    }

    .sidebar-link.admin-link:hover {
      background: rgba(76, 175, 80, 0.2);
    }

    .sidebar-link.admin-link .material-icons {
      color: var(--primary-green);
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 70px;
      }

      .sidebar-brand span:not(.material-icons),
      .sidebar-link span:not(.material-icons) {
        display: none;
      }

      .sidebar-link {
        justify-content: center;
        padding: 1rem;
      }
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  myTasksCount: number = 0;
  isAdminUser: boolean = false;
  private sub?: Subscription;

  constructor(
    private userService: UserService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes to check admin status
    this.sub = this.userService.currentUser$.subscribe(user => {
      this.isAdminUser = this.userService.isAdmin();
    });

    // Combine latest tasks and current user to compute the "My Tasks" count
    this.sub.add(
      combineLatest([this.taskService.tasks$, this.userService.currentUser$])
        .subscribe(([tasks, user]) => {
          if (!user) {
            // try to read from localStorage fallback
            const lu = this.userService.getCurrentUser();
            const uid = lu ? (lu as any).id : null;
            this.myTasksCount = uid ? tasks.filter((t: any) => String(t.creatorId) === String(uid)).length : 0;
          } else {
            const uid = (user as any).id;
            this.myTasksCount = uid ? tasks.filter((t: any) => String(t.creatorId) === String(uid)).length : 0;
          }
        })
    );

    // Ensure tasks are fetched at least once so the badge can populate quickly
    this.taskService.getTasks().subscribe({
      next: () => { },
      error: () => { }
    });
  }

  logout(): void {
    this.userService.logout();
    window.location.href = '/';
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
