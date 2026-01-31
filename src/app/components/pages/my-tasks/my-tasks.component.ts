import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { TaskCardComponent } from '../../shared/task-card/task-card.component';
import { Task } from '../../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  template: `
    <div class="my-tasks">
      <h1>My Posted Tasks</h1>
      <p>Manage tasks you've posted</p>

      <div class="tasks-grid" *ngIf="myTasks && myTasks.length > 0">
        <app-task-card *ngFor="let task of myTasks" [task]="task"></app-task-card>
      </div>

      <div class="empty-state" *ngIf="!myTasks || myTasks.length === 0">
        <span class="material-icons">assignment</span>
        <p>You haven't posted any tasks yet</p>
      </div>
    </div>
  `,
  styles: [`
    .my-tasks { max-width: 1200px; margin: 0 auto; }
    .tasks-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 1rem; margin-top:1rem }
    .empty-state { background: var(--white); border-radius: 1rem; padding: 4rem 2rem; text-align: center; margin-top: 2rem; }
    .empty-state .material-icons { font-size: 5rem; color: var(--text-light); margin-bottom: 1rem; }
  `]
})
export class MyTasksComponent implements OnInit, OnDestroy {
  myTasks: Task[] = [];
  offers: any[] = [];
  private sub?: Subscription;

  constructor(private taskService: TaskService, private userService: UserService) { }

  ngOnInit(): void {
    // Subscribe to tasks and compute user's tasks
    this.sub = this.taskService.tasks$.subscribe(tasks => {
      const user = this.userService.getCurrentUser();
      const uid = user ? (user as any).id : null;
      if (uid) {
        this.myTasks = tasks.filter((t: any) => String(t.creatorId) === String(uid));
        // Offers are now handled in the OffersComponent
        this.offers = [];
      } else {
        this.myTasks = [];
        this.offers = [];
      }
    });

    // Ensure tasks are fetched
    this.taskService.getTasks().subscribe({ next: () => { }, error: () => { } });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  acceptOffer(taskId: number, applicationId: number): void {
    this.taskService.acceptApplication(taskId, applicationId).subscribe(() => {
      this.offers = this.offers.filter(offer => offer.id !== applicationId);
    });
  }

  rejectOffer(taskId: number, applicationId: number): void {
    this.taskService.rejectApplication(taskId, applicationId).subscribe(() => {
      this.offers = this.offers.filter(offer => offer.id !== applicationId);
    });
  }
}
