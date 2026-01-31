import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { Application } from '../../../models/task.model';

@Component({
  selector: 'app-posts-i-applied-to',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="posts-i-applied-to">
      <h1>Posts I Applied To</h1>
      <p>View the status of your applications</p>

      <div class="applications-grid" *ngIf="applications && applications.length > 0">
        <div class="application-card" *ngFor="let app of applications">
          <h3>Task ID: {{ app.taskId }}</h3>
          <p>Status: {{ app.status }}</p>
        </div>
      </div>

      <div class="empty-state" *ngIf="!applications || applications.length === 0">
        <span class="material-icons">assignment</span>
        <p>You haven't applied to any tasks yet</p>
      </div>
    </div>
  `,
  styles: [`
    .posts-i-applied-to { max-width: 1200px; margin: 0 auto; }
    .applications-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 1rem; margin-top:1rem }
    .empty-state { background: var(--white); border-radius: 1rem; padding: 4rem 2rem; text-align: center; margin-top: 2rem; }
    .empty-state .material-icons { font-size: 5rem; color: var(--text-light); margin-bottom: 1rem; }
  `]
})
export class PostsIAppliedToComponent implements OnInit {
  applications: Application[] = [];

  constructor(private taskService: TaskService, private userService: UserService) {}

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    const uid = user ? (user as any).id : null;
    if (uid) {
      this.taskService.getApplicationsByUser(uid).subscribe(applications => {
        this.applications = applications;
      });
    }
  }
}