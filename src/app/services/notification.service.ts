import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  show(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date()
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Auto remove after duration
    if (notification.duration !== 0) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  showSuccess(message: string, title: string = 'Success'): void {
    this.show({
      type: 'success',
      title,
      message,
      duration: 5000
    });
  }

  showError(message: string, title: string = 'Error'): void {
    this.show({
      type: 'error',
      title,
      message,
      duration: 7000
    });
  }

  showWarning(message: string, title: string = 'Warning'): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration: 6000
    });
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.show({
      type: 'info',
      title,
      message,
      duration: 5000
    });
  }

  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }
}
