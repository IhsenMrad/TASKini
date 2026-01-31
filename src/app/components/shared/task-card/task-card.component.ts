import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Task } from '../../../models/task.model';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent],
  template: `
    <div class="task-card">
      <div class="task-card-header">
        <app-badge [text]="task.category"></app-badge>
        <span class="task-budget">\${{ task.budget }}</span>
      </div>
      <h3 class="task-title">{{ task.title }}</h3>
      <p class="task-description">{{ task.description }}</p>
      <div class="task-meta">
        <div class="meta-item">
          <span class="material-icons">location_on</span>
          <span>{{ task.location }}</span>
        </div>
        <div class="meta-item">
          <span class="material-icons">calendar_today</span>
          <span>{{ task.date | date: 'MMM d' }}</span>
        </div>
      </div>
      <div class="application-status" *ngIf="task.applicationStatus">
        <app-badge [status]="task.applicationStatus">
          {{ getStatusText(task.applicationStatus) }}
        </app-badge>
      </div>
      <div class="task-footer">
        <span class="applications-count" *ngIf="task.applications">
          {{ task.applications }} {{ task.applications === 1 ? 'application' : 'applications' }}
        </span>
        <a [routerLink]="['/dashboard/task', task.id]" class="btn btn-primary btn-sm">View Details</a>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      background: var(--white);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 4px 16px var(--shadow-light);
      transition: all 0.3s ease;
      border: 2px solid transparent;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .task-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px var(--shadow-medium);
      border-color: var(--light-green);
    }

    .task-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .task-budget {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-green);
    }

    .task-title {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      color: var(--text-dark);
    }

    .task-description {
      color: var(--text-gray);
      margin-bottom: 1rem;
      line-height: 1.6;
      flex-grow: 1;
    }

    .task-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      color: var(--text-gray);
      font-size: 0.875rem;
    }

    .meta-item .material-icons {
      font-size: 1rem;
      color: var(--primary-green);
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }

    .applications-count {
      font-size: 0.875rem;
      color: var(--text-light);
    }

    .application-status {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: var(--background-light);
      border-radius: 0.5rem;
      text-align: center;
    }

    .btn-sm {
      padding: 0.5rem 1.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class TaskCardComponent {
  @Input() task!: Task;

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Waiting for Approval';
      case 'ACCEPTED':
        return 'Application Accepted';
      case 'REJECTED':
        return 'Application Rejected';
      default:
        return status;
    }
  }
}
