import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { Task } from '../../../models/task.model';
import { TaskCardComponent } from '../../shared/task-card/task-card.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskCardComponent],
  template: `
    <div class="applications">
      <div class="header">
        <h1>Tasks I Applied To</h1>
        <p>Track your task applications</p>
      </div>
      
      <div class="tasks-grid" *ngIf="appliedTasks.length > 0; else emptyState">
        <app-task-card *ngFor="let task of appliedTasks" [task]="task"></app-task-card>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <span class="material-icons">work</span>
          <p>You haven't applied to any tasks yet</p>
          <a routerLink="/dashboard/tasks" class="browse-btn">Browse Tasks</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .applications {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .header {
      margin-bottom: 2rem;
    }
    .header h1 {
      font-size: 2rem;
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }
    .header p {
      color: var(--text-light);
    }
    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    .empty-state {
      background: var(--white);
      border-radius: 1rem;
      padding: 4rem 2rem;
      text-align: center;
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .empty-state .material-icons {
      font-size: 4rem;
      color: var(--text-light);
    }
    .browse-btn {
      background: var(--primary-color);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      margin-top: 1rem;
      transition: background-color 0.2s;
    }
    .browse-btn:hover {
      background-color: var(--primary-dark);
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  appliedTasks: Task[] = [];
  applicationStatuses: Map<number, string> = new Map(); // taskId -> status

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    if (user && user.id) {
      this.taskService.getApplicationsByUser(Number(user.id)).subscribe({
        next: (apps) => {
          if (apps.length > 0) {
            // Store application statuses
            apps.forEach(app => {
              this.applicationStatuses.set(app.taskId, app.status);
            });

            // Fetch task details for each application
            const taskRequests = apps.map(app => this.taskService.getTaskById(app.taskId));
            forkJoin(taskRequests).subscribe({
              next: (tasks) => {
                this.appliedTasks = tasks.map(task => ({
                  ...task,
                  applicationStatus: this.applicationStatuses.get(task.id)
                }));
              },
              error: (err) => console.error('Failed to load applied tasks details', err)
            });
          }
        },
        error: (err) => console.error('Failed to load applications', err)
      });
    }
  }
}
