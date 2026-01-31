import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { Task } from '../../../models/task.model';
import { BadgeComponent } from '../../shared/badge/badge.component';
import { TaskCardComponent } from '../../shared/task-card/task-card.component';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent, TaskCardComponent],
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  task: Task | undefined;
  similarTasks: Task[] = [];
  applied = false;
  applications: any[] = [];
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const idNum = Number(id);
    this.taskService.getTaskById(idNum).subscribe({
      next: (task) => {
        this.task = task;

        const currentUser = this.userService.getCurrentUser();
        const uid = currentUser ? String((currentUser as any).id) : null;
        // Determine ownership using several possible fields
        this.isOwner = Boolean(
          uid && (
            String(task.creatorId) === uid ||
            String((task as any).postedBy) === uid ||
            String((task as any).postedById) === uid ||
            String((task as any).createdBy) === uid ||
            String((task as any).creator?.id) === uid
          )
        );

        // If owner, fetch applications for review
        if (this.isOwner) {
          this.taskService.getApplications(idNum).subscribe({
            next: (apps) => (this.applications = apps || []),
            error: (err) => console.error('Failed to load applications', err)
          });
        }

        // fetch tasks and filter by category
        this.taskService.getTasks().subscribe({
          next: (tasks) => {
            this.similarTasks = tasks
              .filter(t => t.category === task.category && t.id !== task.id)
              .slice(0, 3);
          }
        });
      }
    });
  }

  applyToTask(): void {
    if (!this.task) return;

    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) return;

    const payload: any = {
      taskId: this.task.id,
      applicantId: currentUser.id,
      message: 'I would like to help with this task!'
    };

    this.taskService.applyToTask(Number(this.task.id), payload).subscribe({
      next: () => {
        this.applied = true;
      },
      error: (err) => {
        console.error('Error applying to task:', err);
        if (err.status === 400) {
          // Backend says already applied (or other bad request)
          // We treat "already applied" as a success state for the UI (show "Applied" badge)
          this.applied = true;
        } else {
          alert('Failed to apply to task. Please try again.');
        }
      }
    });
  }

  acceptApplication(app: any): void {
    if (!this.task) return;

    this.taskService.acceptApplication(this.task.id, app.id).subscribe({
      next: () => {
        app.status = 'ACCEPTED';
        alert('Application accepted!');
      },
      error: (err) => {
        console.error('Failed to accept application', err);
        alert('Failed to accept application.');
      }
    });
  }

  rejectApplication(app: any): void {
    if (!this.task) return;

    this.taskService.rejectApplication(this.task.id, app.id).subscribe({
      next: () => {
        app.status = 'REJECTED';
        alert('Application rejected.');
      },
      error: (err) => {
        console.error('Failed to reject application', err);
        alert('Failed to reject application.');
      }
    });
  }
}