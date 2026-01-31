import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-post-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="post-task">
      <h1>Post a New Task</h1>
      <p>Fill out the details to get help with your task</p>

      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
        <div class="form-group">
          <label for="title">Task Title *</label>
          <input type="text" id="title" formControlName="title" placeholder="E.g., Help with grocery shopping">
        </div>

        <div class="form-group">
          <label for="description">Description *</label>
          <textarea id="description" formControlName="description" rows="5" placeholder="Describe your task in detail..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">Category *</label>
            <select id="category" formControlName="category">
              <option value="">Select a category</option>
              <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="budget">Budget (\$) *</label>
            <input type="number" id="budget" formControlName="budget" placeholder="50">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="location">Location *</label>
            <input type="text" id="location" formControlName="location" placeholder="E.g., Downtown Seattle">
          </div>

          <div class="form-group">
            <label for="date">Date Needed *</label>
            <input type="date" id="date" formControlName="date">
          </div>
        </div>

        <div class="form-group">
          <label for="requirements">Requirements (Optional)</label>
          <textarea id="requirements" formControlName="requirements" rows="3" placeholder="Any special requirements or qualifications?"></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="cancel()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid">
            <span class="material-icons">add_task</span>
            Post Task
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .post-task {
      max-width: 900px;
      margin: 0 auto;
      background: var(--white);
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 4px 16px var(--shadow-light);
    }

    .post-task h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .post-task p {
      color: var(--text-gray);
      margin-bottom: 2.5rem;
    }

    .task-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PostTaskComponent {
  taskForm: FormGroup;
  categories = ['Errands', 'Cleaning', 'Pet Care', 'Tutoring', 'Handyman', 'Transportation', 'Yard Work', 'Photography', 'Moving'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      date: ['', Validators.required],
      requirements: ['']
    });
  }

onSubmit(): void {
  if (this.taskForm.valid) {
    const user = this.userService.getCurrentUser();
    if (user) {
      const formValue = this.taskForm.value;

      // Convert date string to LocalDateTime format for Java backend
      const deadlineDate = new Date(formValue.date);
      // Add time component (end of day)
      deadlineDate.setHours(23, 59, 59);

      const payload = {
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        budget: parseFloat(formValue.budget),
        location: formValue.location,
        deadline: deadlineDate.toISOString(), // Send as ISO string
        status: 'OPEN', // Set default status
        creatorId: user.id,
        // Optional: add flagged field
        flagged: false
      };

      this.taskService.createTask(payload).subscribe({
        next: (createdTask) => {
          console.log('Task created successfully:', createdTask);
          this.router.navigate(['/dashboard/my-tasks']);
        },
        error: (err) => {
          console.error('Failed to create task', err);
        }
      });
    }
  }
}

  cancel(): void {
    this.router.navigate(['/dashboard/tasks']);
  }
}
