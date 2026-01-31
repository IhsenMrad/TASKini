import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Task } from '../../../../services/admin.service';
import { NotificationService } from '../../../../services/notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-tasks">
      <div class="page-header">
        <h1>Task Management</h1>
        <p>Review and manage tasks posted by users</p>
      </div>

      <div class="filters-section">
        <div class="filter-group">
          <label>Status:</label>
          <select [(ngModel)]="statusFilter" (change)="applyFilters()">
            <option value="all">All Tasks</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Flagged:</label>
          <select [(ngModel)]="flaggedFilter" (change)="applyFilters()">
            <option value="all">All</option>
            <option value="flagged">Flagged Only</option>
            <option value="not-flagged">Not Flagged</option>
          </select>
        </div>

        <div class="search-box">
          <span class="material-icons">search</span>
          <input
            type="text"
            placeholder="Search tasks..."
            [(ngModel)]="searchTerm"
            (input)="applyFilters()">
        </div>
      </div>

      <div class="tasks-table-container">
        <table class="tasks-table" *ngIf="filteredTasks.length > 0">
          <thead>
            <tr>
              <th>Task</th>
              <th>Creator ID</th>
              <th>Category</th>
              <th>Budget</th>
              <th>Location</th>
              <th>Status</th>
              <th>Flagged</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let task of filteredTasks" [class.flagged]="task.flagged">
              <td>
                <div class="task-info">
                  <strong>{{ task.title }}</strong>
                  <small>{{ task.description | slice:0:100 }}{{ task.description.length > 100 ? '...' : '' }}</small>
                </div>
              </td>
              <td>
                <div class="creator-info">
                  <strong>User #{{ task.creatorId }}</strong>
                </div>
              </td>
              <td>
                <span class="category-badge">{{ task.category }}</span>
              </td>
              <td>
                <span class="budget">\${{ task.budget }}</span>
              </td>
              <td>
                {{ task.location }}
              </td>
              <td>
  <span [class]="getStatusClass(task.status)">
    {{ task.status || 'Unknown' }}
  </span>
</td>
              <td>
                <span *ngIf="task.flagged" class="flagged-indicator">
                  <span class="material-icons">flag</span>
                  Flagged
                  <small *ngIf="task.flagReason">({{ task.flagReason }})</small>
                </span>
                <span *ngIf="!task.flagged">-</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    *ngIf="!task.flagged"
                    (click)="openFlagModal(task)"
                    class="btn btn-warning btn-sm">
                    <span class="material-icons">flag</span>
                    Flag
                  </button>
                  <button
                    *ngIf="task.flagged"
                    (click)="unflagTask(task.id)"
                    class="btn btn-success btn-sm">
                    <span class="material-icons">outlined_flag</span>
                    Unflag
                  </button>
                  <button
                    (click)="openDeleteModal(task)"
                    class="btn btn-danger btn-sm">
                    <span class="material-icons">delete</span>
                    Delete
                  </button>
                  <button
                    (click)="viewTaskDetails(task)"
                    class="btn btn-outline btn-sm">
                    <span class="material-icons">visibility</span>
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredTasks.length === 0 && !loading" class="empty-state">
          <span class="material-icons">assignment</span>
          <p>No tasks found matching your criteria</p>
        </div>

        <div *ngIf="loading" class="loading-state">
          <span class="material-icons">refresh</span>
          <p>Loading tasks...</p>
        </div>
      </div>

      <!-- Flag Task Modal -->
      <div *ngIf="showFlagModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3>Flag Task</h3>
            <button (click)="closeFlagModal()" class="btn-close">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to flag <strong>{{ selectedTask?.title }}</strong>?</p>
            <div class="form-group">
              <label for="flagReason">Reason for flagging:</label>
              <textarea
                id="flagReason"
                [(ngModel)]="flagReason"
                placeholder="Enter reason for flagging this task..."
                rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeFlagModal()" class="btn btn-outline">Cancel</button>
            <button (click)="confirmFlag()" class="btn btn-warning">Flag Task</button>
          </div>
        </div>
      </div>

      <!-- Delete Task Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3>Delete Task</h3>
            <button (click)="closeDeleteModal()" class="btn-close">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ selectedTask?.title }}</strong>?</p>
            <p class="warning-text">This action cannot be undone. All applications for this task will also be deleted.</p>
          </div>
          <div class="modal-footer">
            <button (click)="closeDeleteModal()" class="btn btn-outline">Cancel</button>
            <button (click)="confirmDelete()" class="btn btn-danger">Delete Task</button>
          </div>
        </div>
      </div>

      <!-- Task Details Modal -->
      <div *ngIf="showTaskDetailsModal" class="modal-overlay">
        <div class="modal modal-large">
          <div class="modal-header">
            <h3>Task Details</h3>
            <button (click)="closeTaskDetailsModal()" class="btn-close">
              <span class="material-icons">close</span>
            </button>
          </div>

          <div *ngIf="selectedTaskDetails">
            <div class="modal-body">
              <div class="task-details-content">
                <div class="task-header">
                  <div class="task-title-section">
                    <span class="category-badge-large">{{ selectedTaskDetails.category }}</span>
                    <h2>{{ selectedTaskDetails.title }}</h2>
                    <div class="task-meta">
                      <span class="task-budget-large">\${{ selectedTaskDetails.budget }}</span>
                      <span [class]="'status-badge status-' + (selectedTaskDetails.status || 'unknown').toLowerCase()">
  {{ selectedTaskDetails.status || 'Unknown' }}
</span>
                      <span *ngIf="selectedTaskDetails.flagged" class="flagged-badge">
                        <span class="material-icons">flag</span>
                        Flagged
                      </span>
                    </div>
                  </div>
                </div>

                <div class="details-grid">
                  <div class="detail-section">
                    <h4>Basic Information</h4>
                    <div class="detail-item">
                      <span class="material-icons">person</span>
                      <div>
                        <label>Creator</label>
                        <p>User #{{ selectedTaskDetails.creatorId }}</p>
                      </div>
                    </div>
                    <div class="detail-item">
                      <span class="material-icons">location_on</span>
                      <div>
                        <label>Location</label>
                        <p>{{ selectedTaskDetails.location }}</p>
                      </div>
                    </div>
                    <div class="detail-item">
                      <span class="material-icons">calendar_today</span>
                      <div>
                        <label>Created</label>
                        <p>{{ selectedTaskDetails.createdAt | date: 'MMM d, yyyy' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="detail-section">
                    <h4>Task Stats</h4>
                    <div class="stats-grid">
                      <div class="stat-item">
                        <span class="stat-number">{{ taskStats?.applications || 0 }}</span>
                        <span class="stat-label">Applications</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">{{ taskStats?.views || 0 }}</span>
                        <span class="stat-label">Views</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">{{ taskStats?.saves || 0 }}</span>
                        <span class="stat-label">Saves</span>
                      </div>
                    </div>
                  </div>

                  <div class="detail-section full-width">
                    <h4>Description</h4>
                    <p class="task-description">{{ selectedTaskDetails.description }}</p>
                  </div>

                  <div class="detail-section full-width" *ngIf="selectedTaskDetails.flagReason">
                    <h4>Flag Information</h4>
                    <div class="flag-info">
                      <span class="material-icons">warning</span>
                      <div>
                        <label>Flag Reason</label>
                        <p>{{ selectedTaskDetails.flagReason }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="detail-section full-width" *ngIf="taskApplications?.length">
                    <h4>Applications ({{ taskApplications.length }})</h4>
                    <div class="applications-list">
                      <div *ngFor="let application of taskApplications" class="application-item">
                        <div class="application-user">
                          <strong>User #{{ application.userId }}</strong>
                          <span class="application-date">{{ application.appliedAt | date: 'MMM d, yyyy' }}</span>
                        </div>
                        <p class="application-message">{{ application.message }}</p>
                        <div class="application-status">
                          <span [class]="'status-' + (application.status || 'unknown').toLowerCase()">
  {{ application.status || 'Unknown' }}
</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- UPDATED MODAL FOOTER -->
            <div class="modal-footer">
              <button (click)="closeTaskDetailsModal()" class="btn btn-outline">Close</button>
              <button
                *ngIf="!selectedTaskDetails.flagged"
                (click)="openFlagModalFromDetails(selectedTaskDetails)"
                class="btn btn-warning">
                Flag Task
              </button>
              <button
                *ngIf="selectedTaskDetails.flagged"
                (click)="unflagTaskFromDetails(selectedTaskDetails.id)"
                class="btn btn-success">
                Unflag Task
              </button>
              <button
                (click)="openDeleteModalFromDetails(selectedTaskDetails)"
                class="btn btn-danger">
                Delete Task
              </button>
            </div>
          </div>

          <!-- Loading state -->
          <div *ngIf="!selectedTaskDetails" class="modal-body">
            <div class="loading-state">
              <span class="material-icons">refresh</span>
              <p>Loading task details...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Keep your existing styles the same */
    .admin-tasks {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .filters-section {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: var(--white);
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-light);
    }

    .search-box input {
      border: none;
      outline: none;
      margin-left: 0.5rem;
      width: 200px;
    }

    .tasks-table-container {
      background: var(--white);
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 16px var(--shadow-light);
    }

    .tasks-table {
      width: 100%;
      border-collapse: collapse;
    }

    .tasks-table th {
      background: var(--bg-greenish);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-dark);
      border-bottom: 1px solid var(--border-light);
    }

    .tasks-table td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-light);
    }

    .tasks-table tr:last-child td {
      border-bottom: none;
    }

    .tasks-table tr.flagged {
      background: #FFF3E0;
    }

    .tasks-table tr:hover {
      background: var(--bg-greenish);
    }

    .task-info strong {
      display: block;
      margin-bottom: 0.25rem;
    }

    .task-info small {
      color: var(--text-gray);
      font-size: 0.875rem;
    }

    .status-unknown {
  color: #757575;
  font-weight: 500;
  background: #F5F5F5;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

    .creator-info strong {
      display: block;
      margin-bottom: 0.25rem;
    }

    .category-badge {
      background: var(--light-green);
      color: var(--primary-green);
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .budget {
      font-weight: 600;
      color: var(--primary-green);
    }

    .status-open { color: #388E3C; font-weight: 500; }
    .status-in_progress { color: #F57C00; font-weight: 500; }
    .status-completed { color: #1976D2; font-weight: 500; }

    .flagged-indicator {
      color: #F57C00;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn-sm {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .btn-warning {
      background: #F57C00;
      color: white;
    }

    .btn-success {
      background: #388E3C;
      color: white;
    }

    .btn-danger {
      background: #D32F2F;
      color: white;
    }

    .empty-state, .loading-state {
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state .material-icons, .loading-state .material-icons {
      font-size: 4rem;
      color: var(--text-light);
      margin-bottom: 1rem;
    }

    .loading-state .material-icons {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: var(--white);
      border-radius: 1rem;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-large {
      max-width: 800px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .modal-header h3 {
      margin: 0;
    }

    .btn-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-gray);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid var(--border-light);
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .form-group {
      margin-top: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-light);
      border-radius: 0.5rem;
      resize: vertical;
      font-family: inherit;
    }

    .warning-text {
      color: #D32F2F;
      font-weight: 500;
      margin-top: 1rem;
    }

    /* Task Details Styles */
    .task-details-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .task-header {
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .task-title-section h2 {
      margin: 0.5rem 0 1rem 0;
      font-size: 1.75rem;
      color: var(--text-dark);
    }

    .category-badge-large {
      background: var(--light-green);
      color: var(--primary-green);
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 1rem;
      font-weight: 500;
    }

    .task-meta {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .task-budget-large {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary-green);
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .status-open { background: #E8F5E8; color: #388E3C; }
    .status-in_progress { background: #FFF3E0; color: #F57C00; }
    .status-completed { background: #E3F2FD; color: #1976D2; }

    .flagged-badge {
      background: #FFF3E0;
      color: #F57C00;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .detail-section h4 {
      margin: 0 0 1rem 0;
      color: var(--text-dark);
      font-size: 1.1rem;
    }

    .detail-section.full-width {
      grid-column: 1 / -1;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .detail-item .material-icons {
      color: var(--text-gray);
      font-size: 1.25rem;
      margin-top: 0.25rem;
    }

    .detail-item label {
      display: block;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-gray);
      margin-bottom: 0.25rem;
    }

    .detail-item p {
      margin: 0;
      color: var(--text-dark);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
      padding: 1rem;
      background: var(--bg-greenish);
      border-radius: 0.5rem;
    }

    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary-green);
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-gray);
    }

    .task-description, .task-requirements {
      line-height: 1.6;
      color: var(--text-dark);
      white-space: pre-line;
    }

    .flag-info {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: #FFF3E0;
      border-radius: 0.5rem;
      border-left: 4px solid #F57C00;
    }

    .flag-info .material-icons {
      color: #F57C00;
      font-size: 1.5rem;
    }

    .applications-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .application-item {
      padding: 1rem;
      background: var(--bg-greenish);
      border-radius: 0.5rem;
      border: 1px solid var(--border-light);
    }

    .application-user {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .application-date {
      color: var(--text-gray);
      font-size: 0.875rem;
    }

    .application-message {
      margin: 0.5rem 0;
      color: var(--text-dark);
      font-style: italic;
    }

    @media (max-width: 768px) {
      .admin-tasks {
        padding: 1rem;
      }

      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }

      .tasks-table {
        display: block;
        overflow-x: auto;
      }

      .action-buttons {
        flex-direction: column;
      }

      .search-box input {
        width: 100%;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .task-meta {
        flex-direction: column;
        align-items: flex-start;
      }

      .modal {
        width: 95%;
        margin: 1rem;
      }

      .modal-footer {
        flex-direction: column;
      }
    }
  `]
})
export class AdminTasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = true;

  // Filters
  statusFilter = 'all';
  flaggedFilter = 'all';
  searchTerm = '';

  // Modals
  showFlagModal = false;
  showDeleteModal = false;
  showTaskDetailsModal = false;
  selectedTask: Task | null = null;
  selectedTaskDetails: Task | null = null;
  flagReason = '';
  taskStats: any = null;
  taskApplications: any[] = [];

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.adminService.getTasks().subscribe({
      next: (tasks) => {
        // Ensure tasks have valid status values
        this.tasks = tasks.map(task => ({
          ...task,
          status: task.status || 'UNKNOWN' // Provide default value if null
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.notificationService.showError('Failed to load tasks');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const statusMatch = this.statusFilter === 'all' || task.status === this.statusFilter;

      let flaggedMatch = true;
      if (this.flaggedFilter === 'flagged') {
        flaggedMatch = task.flagged === true;
      } else if (this.flaggedFilter === 'not-flagged') {
        flaggedMatch = task.flagged === false;
      }

      const searchMatch = !this.searchTerm ||
        (task.title && task.title.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (task.category && task.category.toLowerCase().includes(this.searchTerm.toLowerCase()));

      return statusMatch && flaggedMatch && searchMatch;
    });
  }

  // Safe method to get status for CSS class
  getStatusClass(status: string | null | undefined): string {
    const safeStatus = (status || 'UNKNOWN').toLowerCase();
    return `status-${safeStatus}`;
  }

  getApplicationStatusClass(status: string | null | undefined): string {
    const safeStatus = (status || 'UNKNOWN').toLowerCase();
    return `status-${safeStatus}`;
  }

  openFlagModal(task: Task): void {
    this.selectedTask = task;
    this.flagReason = '';
    this.showFlagModal = true;
  }

  openFlagModalFromDetails(task: Task): void {
    this.closeTaskDetailsModal();
    setTimeout(() => {
      this.openFlagModal(task);
    }, 300);
  }

  closeFlagModal(): void {
    this.showFlagModal = false;
    this.selectedTask = null;
    this.flagReason = '';
  }

  confirmFlag(): void {
    if (this.selectedTask && this.flagReason.trim()) {
      this.adminService.flagTask(this.selectedTask.id, this.flagReason).subscribe({
        next: () => {
          this.notificationService.showSuccess('Task flagged successfully');
          this.loadTasks();
          this.closeFlagModal();
        },
        error: (error) => {
          console.error('Error flagging task:', error);
          this.notificationService.showError('Failed to flag task');
        }
      });
    } else {
      this.notificationService.showError('Please provide a reason for flagging');
    }
  }

  unflagTask(taskId: number): void {
    this.adminService.unflagTask(taskId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Task unflagged successfully');
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error unflagging task:', error);
        this.notificationService.showError('Failed to unflag task');
      }
    });
  }

  unflagTaskFromDetails(taskId: number): void {
    this.adminService.unflagTask(taskId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Task unflagged successfully');
        this.loadTasks();
        this.closeTaskDetailsModal();
      },
      error: (error) => {
        console.error('Error unflagging task:', error);
        this.notificationService.showError('Failed to unflag task');
      }
    });
  }

  openDeleteModal(task: Task): void {
    this.selectedTask = task;
    this.showDeleteModal = true;
  }

  openDeleteModalFromDetails(task: Task): void {
    this.closeTaskDetailsModal();
    setTimeout(() => {
      this.openDeleteModal(task);
    }, 300);
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedTask = null;
  }

  confirmDelete(): void {
    if (this.selectedTask) {
      this.adminService.deleteTask(this.selectedTask.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Task deleted successfully');
          this.loadTasks();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.notificationService.showError('Failed to delete task');
        }
      });
    }
  }

  viewTaskDetails(task: Task): void {
    this.selectedTaskDetails = {
      ...task,
      status: task.status || 'UNKNOWN' // Ensure status is not null
    };
    this.loadTaskStats(task.id);
    this.loadTaskApplications(task.id);
    this.showTaskDetailsModal = true;
  }

  closeTaskDetailsModal(): void {
    this.showTaskDetailsModal = false;
    this.selectedTaskDetails = null;
    this.taskStats = null;
    this.taskApplications = [];
  }

  loadTaskStats(taskId: number): void {
    this.adminService.getTaskStats(taskId).subscribe({
      next: (stats) => {
        this.taskStats = stats;
      },
      error: (error) => {
        console.error('Error loading task stats:', error);
        this.taskStats = { applications: 0, views: 0, saves: 0 };
      }
    });
  }

  loadTaskApplications(taskId: number): void {
    this.adminService.getTaskApplications(taskId).subscribe({
      next: (applications) => {
        // Ensure applications have valid status values
        this.taskApplications = applications.map(app => ({
          ...app,
          status: app.status || 'UNKNOWN'
        }));
      },
      error: (error) => {
        console.error('Error loading task applications:', error);
        this.taskApplications = [];
      }
    });
  }
}
