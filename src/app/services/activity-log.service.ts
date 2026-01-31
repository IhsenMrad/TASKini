import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ActivityLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  details: string;
  resourceType: 'user' | 'task' | 'system';
  resourceId: string;
  ipAddress?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  private logsSubject = new BehaviorSubject<ActivityLog[]>([]);
  public logs$ = this.logsSubject.asObservable();

  private readonly STORAGE_KEY = 'admin_activity_logs';
  private maxLogs = 1000;

  constructor() {
    this.loadStoredLogs();
  }

  logActivity(
    action: string,
    details: string,
    resourceType: ActivityLog['resourceType'],
    resourceId: string,
    userId?: string,
    userName?: string
  ): void {
    const log: ActivityLog = {
      id: this.generateId(),
      timestamp: new Date(),
      userId: userId || 'system',
      userName: userName || 'System',
      action,
      details,
      resourceType,
      resourceId
    };

    const currentLogs = this.logsSubject.value;
    const newLogs = [log, ...currentLogs].slice(0, this.maxLogs);

    this.logsSubject.next(newLogs);
    this.saveLogsToStorage(newLogs);

    // In production, you would also send this to your backend
    console.log('Activity Log:', log);
  }

  logUserAction(action: string, details: string, userId: string, userName: string): void {
    this.logActivity(action, details, 'user', userId, userId, userName);
  }

  logTaskAction(action: string, details: string, taskId: string, userId?: string, userName?: string): void {
    this.logActivity(action, details, 'task', taskId, userId, userName);
  }

  logSystemAction(action: string, details: string): void {
    this.logActivity(action, details, 'system', 'system');
  }

  getLogs(): ActivityLog[] {
    return this.logsSubject.value;
  }

  getLogsByResource(resourceType: string, resourceId: string): ActivityLog[] {
    return this.logsSubject.value.filter(
      log => log.resourceType === resourceType && log.resourceId === resourceId
    );
  }

  getLogsByUser(userId: string): ActivityLog[] {
    return this.logsSubject.value.filter(log => log.userId === userId);
  }

  clearLogs(): void {
    this.logsSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private loadStoredLogs(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const logs: ActivityLog[] = JSON.parse(stored).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
        this.logsSubject.next(logs);
      }
    } catch (error) {
      console.error('Error loading stored logs:', error);
    }
  }

  private saveLogsToStorage(logs: ActivityLog[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving logs to storage:', error);
    }
  }
}
