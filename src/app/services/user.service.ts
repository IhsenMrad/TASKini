import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  fullName: string;
  name?: string; // For compatibility
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  role: string;
  skills: string[];
  completedTasks: number;
  rating: number;
  bio?: string;
  banned?: boolean;
  banReason?: string;
  createdAt?: string;
}

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
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  // API endpoints
  private springApi = 'http://localhost:8094';
  private adminApi = 'http://localhost:8080/api/admin';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  // ===============================================================
  // AUTHENTICATION METHODS
  // ===============================================================

  register(userData: any): Observable<any> {
    return this.http.post(`${this.springApi}/api/auth/register`, userData).pipe(
      tap((response: any) => {
        if (response.user) {
          this.setCurrentUser(response.user);
        }
      })
    );
  }


login(email: string, password: string): Observable<any> {
  return this.http.post<any>(
    `${this.springApi}/api/auth/login`,
    { email, password }
    // Remove withCredentials: true - let the browser handle cookies automatically
  ).pipe(
    tap(response => {
      console.log('Login response:', response);
      if (response.user || response.id) {
        const user = response.user || response;
        this.setCurrentUser(user);
      }
    })
  );
}

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // ===============================================================
  // USER MANAGEMENT METHODS
  // ===============================================================

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.springApi}/users/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.springApi}/users/${user.id}`, user).pipe(
      tap(updatedUser => {
        // Update current user if it's the same user
        const currentUser = this.currentUserSubject.value;
        if (currentUser && currentUser.id === updatedUser.id) {
          this.setCurrentUser(updatedUser);
        }
      })
    );
  }

  // ===============================================================
  // ADMIN METHODS
  // ===============================================================

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.adminApi}/stats`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminApi}/users`);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.adminApi}/tasks`);
  }

  banUser(userId: number, reason: string): Observable<any> {
    return this.http.post(`${this.adminApi}/users/${userId}/ban`, { reason });
  }

  unbanUser(userId: number): Observable<any> {
    return this.http.post(`${this.adminApi}/users/${userId}/unban`, {});
  }

  flagTask(taskId: number, reason: string): Observable<any> {
    return this.http.post(`${this.adminApi}/tasks/${taskId}/flag`, { reason });
  }

  unflagTask(taskId: number): Observable<any> {
    return this.http.post(`${this.adminApi}/tasks/${taskId}/unflag`, {});
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.adminApi}/tasks/${taskId}`);
  }

  // ===============================================================
  // USER STATE MANAGEMENT
  // ===============================================================

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ===============================================================
  // UTILITY METHODS
  // ===============================================================

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === 'ADMIN' : false;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  // Helper method to get user's display name
  getDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return '';

    return user.fullName || user.name || user.email.split('@')[0];
  }

  // Check if current user is the owner of a resource
  isOwner(userId: number): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.id === userId : false;
  }
}
