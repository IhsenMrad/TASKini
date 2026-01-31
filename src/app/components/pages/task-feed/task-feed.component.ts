import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { TaskCardComponent } from '../../shared/task-card/task-card.component';
import { Task } from '../../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent],
  templateUrl: './task-feed.component.html',
  styleUrl: './task-feed.component.css'
})
export class TaskFeedComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  maxBudget: number = 1000;
  private sub?: Subscription;

  categories = [
    'All',
    'Errands',
    'Cleaning',
    'Pet Care',
    'Tutoring',
    'Handyman',
    'Transportation',
    'Yard Work',
    'Photography',
    'Moving'
  ];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    // Subscribe to the shared tasks$ observable so the component updates
    // whenever TaskService.setTasks(...) is called.
    this.sub = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
    });

    // Trigger a fetch from the backend. TaskService will populate tasks$ when the response arrives.
    this.taskService.getTasks().subscribe({
      next: () => {},
      error: () => {
        // errors are already handled in the service; no-op here
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || this.selectedCategory === 'All' || task.category === this.selectedCategory;
      const matchesBudget = task.budget <= this.maxBudget;
      return matchesSearch && matchesCategory && matchesBudget;
    });
  }
}
