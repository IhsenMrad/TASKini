import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar></app-sidebar>
      <main class="dashboard-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
      background: var(--bg-greenish);
    }

    .dashboard-main {
      flex: 1;
      margin-left: 280px;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .dashboard-main {
        margin-left: 70px;
        padding: 1rem;
      }
    }
  `]
})
export class DashboardComponent {}
