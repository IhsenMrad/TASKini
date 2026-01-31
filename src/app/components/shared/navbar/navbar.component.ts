import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a routerLink="/" class="navbar-brand">
          <span class="brand-icon material-icons">check_circle</span>
          <span class="brand-text">TASKini</span>
        </a>
        <div class="navbar-menu">
          <a routerLink="/dashboard" class="nav-link">Dashboard</a>
          <a routerLink="/login" class="btn btn-outline btn-sm">Login</a>
          <a routerLink="/register" class="btn btn-primary btn-sm">Sign Up</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--white);
      box-shadow: 0 2px 8px var(--shadow-light);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-green);
      text-decoration: none;
    }

    .brand-icon {
      font-size: 2rem;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-link {
      color: var(--text-dark);
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .nav-link:hover {
      color: var(--primary-green);
    }

    .btn-sm {
      padding: 0.5rem 1.5rem;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .navbar-brand {
        font-size: 1.25rem;
      }

      .navbar-menu {
        gap: 0.75rem;
      }

      .nav-link {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(public userService: UserService) {}
}
