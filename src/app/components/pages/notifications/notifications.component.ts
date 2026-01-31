import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  providers: [NotificationService], // Add this line
  template: `
    <div class="notifications-container">
      <div *ngFor="let notification of notifications"
           [class]="'notification notification-' + notification.type"
           (click)="remove(notification.id)">
        <div class="notification-content">
          <span class="material-icons notification-icon">
            {{ getIcon(notification.type) }}
          </span>
          <div class="notification-text">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ notification.timestamp | date:'HH:mm:ss' }}</div>
          </div>
          <button class="notification-close" (click)="remove(notification.id); $event.stopPropagation()">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      max-width: 400px;
      width: 100%;
    }

    .notification {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      margin-bottom: 1rem;
      cursor: pointer;
      border-left: 4px solid;
      transform: translateX(100%);
      animation: slideIn 0.3s ease forwards;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .notification:hover {
      transform: translateX(0) scale(1.02);
    }

    @keyframes slideIn {
      to { transform: translateX(0); }
    }

    .notification-success {
      border-left-color: #388E3C;
    }

    .notification-error {
      border-left-color: #D32F2F;
    }

    .notification-warning {
      border-left-color: #F57C00;
    }

    .notification-info {
      border-left-color: #1976D2;
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      padding: 1rem;
      gap: 0.75rem;
    }

    .notification-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .notification-success .notification-icon { color: #388E3C; }
    .notification-error .notification-icon { color: #D32F2F; }
    .notification-warning .notification-icon { color: #F57C00; }
    .notification-info .notification-icon { color: #1976D2; }

    .notification-text {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: var(--text-dark);
    }

    .notification-message {
      color: var(--text-gray);
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
      word-wrap: break-word;
    }

    .notification-time {
      color: var(--text-light);
      font-size: 0.75rem;
    }

    .notification-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-light);
      padding: 0.25rem;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notification-close:hover {
      background: rgba(0, 0, 0, 0.05);
      color: var(--text-gray);
    }
  `]
})
export class NotificationsComponent {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  remove(id: string): void {
    this.notificationService.remove(id);
  }

  getIcon(type: string): string {
    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return icons[type as keyof typeof icons] || 'info';
  }
}
