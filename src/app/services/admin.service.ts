import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface AdminStats {
  total_users: number;
  banned_users: number;
  total_tasks: number;
  total_applications: number;
  completed_tasks: number;
  flagged_tasks: number;
  active_users_last_7_days: number;
  new_tasks_last_7_days: number;
  average_task_budget: number;
  most_popular_category: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  role: string;
  banned: boolean;
  banReason?: string;
  createdAt: string;
  avatar?: string;
  skills?: string[];
  bio?: string;
  lastLogin?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  status: string;
  flagged: boolean;
  flagReason?: string;
  creatorId: number;
  createdAt: string;
  requirements?: string;
  dueDate?: string;
  flaggedAt?: string;
}

export interface UserStats {
  tasksPosted: number;
  tasksCompleted: number;
  applications: number;
}

export interface TaskStats {
  applications: number;
  views: number;
  saves: number;
}

export interface TaskApplication {
  id: number;
  userId: number;
  userName: string;
  message: string;
  status: string;
  appliedAt: string;
  proposedPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<AdminStats>('getStats', this.getMockStats()))
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, { headers: this.getHeaders() });
  }

  banUser(userId: number, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/ban`, { reason }, { headers: this.getHeaders() });
  }

  unbanUser(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/unban`, {}, { headers: this.getHeaders() });
  }

  flagTask(taskId: number, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks/${taskId}/flag`, { reason }, { headers: this.getHeaders() });
  }

  unflagTask(taskId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks/${taskId}/unflag`, {}, { headers: this.getHeaders() });
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${taskId}`, { headers: this.getHeaders() });
  }

   getUserRegistrationTrend(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics/user-registrations`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error loading user registration trend:', error);
          return this.getMockUserRegistrationData();
        })
      );
  }

  getTaskCategoriesDistribution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics/task-categories`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error loading task categories:', error);
          return this.getMockTaskCategoriesData();
        })
      );
  }

  getRevenueOverview(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics/revenue`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error loading revenue overview:', error);
          return this.getMockRevenueData();
        })
      );
  }

  getPlatformActivity(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics/platform-activity`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error loading platform activity:', error);
          return this.getMockPlatformActivityData();
        })
      );
  }

  getTaskStatusDistribution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics/task-status`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error loading task status:', error);
          return this.getMockTaskStatusData();
        })
      );
  }

  getBudgetDistribution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics/budget-distribution`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error loading budget distribution:', error);
          return this.getMockBudgetData();
        })
      );
  }

  // Mock data methods (fallback when backend is not available)
  private getMockStats(): AdminStats {
    return {
      total_users: 1250,
      banned_users: 23,
      total_tasks: 890,
      total_applications: 2450,
      completed_tasks: 567,
      flagged_tasks: 45,
      active_users_last_7_days: 342,
      new_tasks_last_7_days: 67,
      average_task_budget: 150,
      most_popular_category: 'Cleaning'
    };
  }

  private getMockUserRegistrationData(): Observable<any> {
    const mockData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 80, 85]
    };
    return of(mockData);
  }

  private getMockTaskCategoriesData(): Observable<any> {
    const mockData = {
      labels: ['Cleaning', 'Repair', 'Delivery', 'IT Help', 'Gardening', 'Moving', 'Pet Care', 'Tutoring'],
      data: [30, 25, 15, 12, 8, 5, 3, 2],
      colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF']
    };
    return of(mockData);
  }

  private getMockRevenueData(): Observable<any> {
    const mockData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [12000, 19000, 15000, 25000, 22000, 30000]
    };
    return of(mockData);
  }

  private getMockPlatformActivityData(): Observable<any> {
    const mockData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      tasks: [12, 19, 15, 25, 22, 30, 18],
      applications: [28, 35, 42, 38, 45, 52, 40]
    };
    return of(mockData);
  }

  private getMockTaskStatusData(): Observable<any> {
    const mockData = {
      labels: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      data: [45, 25, 20, 10],
      colors: ['#36A2EB', '#FFCE56', '#4BC0C0', '#FF6384']
    };
    return of(mockData);
  }

  private getMockBudgetData(): Observable<any> {
    const mockData = {
      labels: ['$0-50', '$51-100', '$101-200', '$201-500', '$500+'],
      data: [15, 35, 25, 18, 7],
      colors: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ]
    };
    return of(mockData);
  }

  getUserStats(userId: number): Observable<UserStats> {
    // For now, return mock data. Replace with actual API call when backend is ready
    return of({
      tasksPosted: Math.floor(Math.random() * 20),
      tasksCompleted: Math.floor(Math.random() * 15),
      applications: Math.floor(Math.random() * 30)
    });
  }

  // New methods for task details
  getTaskStats(taskId: number): Observable<TaskStats> {
    // For now, return mock data. Replace with actual API call when backend is ready
    return of({
      applications: Math.floor(Math.random() * 10),
      views: Math.floor(Math.random() * 50),
      saves: Math.floor(Math.random() * 5)
    });
  }

  getTaskApplications(taskId: number): Observable<TaskApplication[]> {
    // For now, return mock data. Replace with actual API call when backend is ready
    const mockApplications: TaskApplication[] = [
      {
        id: 1,
        userId: 101,
        userName: 'John Doe',
        message: 'I have experience in this field and would love to help!',
        status: 'PENDING',
        appliedAt: new Date().toISOString(),
        proposedPrice: 150
      },
      {
        id: 2,
        userId: 102,
        userName: 'Jane Smith',
        message: 'I can complete this task quickly and efficiently.',
        status: 'ACCEPTED',
        appliedAt: new Date(Date.now() - 86400000).toISOString(),
        proposedPrice: 120
      }
    ];
    return of(mockApplications);
  }

}


