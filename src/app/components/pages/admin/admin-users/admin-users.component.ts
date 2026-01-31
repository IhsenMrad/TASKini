import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, User } from '../../../../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-users">
      <div class="page-header">
        <h1>User Management</h1>
        <p>Manage and moderate platform users</p>
      </div>

      <div class="users-table-container">
        <table class="users-table" *ngIf="users.length > 0">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users" [class.banned]="user.banned">
              <td>
                <div class="user-info">
                  <strong>{{ user.fullName }}</strong>
                  <small>{{ user.email }}</small>
                </div>
              </td>
              <td>
                <div class="contact-info">
                  <div>{{ user.phone || 'No phone' }}</div>
                  <small>{{ user.location || 'No location' }}</small>
                </div>
              </td>
              <td>
                <span class="role-badge">{{ user.role }}</span>
              </td>
              <td>
                <span [class]="user.banned ? 'status-banned' : 'status-active'">
                  {{ user.banned ? 'Banned' : 'Active' }}
                </span>
              </td>
              <td>
                {{ user.createdAt | date: 'MMM d, yyyy' }}
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    *ngIf="!user.banned"
                    (click)="openBanModal(user)"
                    class="btn btn-danger btn-sm">
                    Ban
                  </button>
                  <button
                    *ngIf="user.banned"
                    (click)="unbanUser(user.id)"
                    class="btn btn-success btn-sm">
                    Unban
                  </button>
                  <button
                    (click)="viewUserDetails(user)"
                    class="btn btn-outline btn-sm">
                    Details
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="users.length === 0" class="empty-state">
          <span class="material-icons">people</span>
          <p>No users found</p>
        </div>
      </div>

      <!-- Ban User Modal -->
      <div *ngIf="showBanModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3>Ban User</h3>
            <button (click)="closeBanModal()" class="btn-close">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to ban <strong>{{ selectedUser?.fullName }}</strong>?</p>
            <div class="form-group">
              <label for="banReason">Reason for banning:</label>
              <textarea
                id="banReason"
                [(ngModel)]="banReason"
                placeholder="Enter reason for banning this user..."
                rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeBanModal()" class="btn btn-outline">Cancel</button>
            <button (click)="confirmBan()" class="btn btn-danger">Ban User</button>
          </div>
        </div>
      </div>

      <!-- User Details Modal -->
      <div *ngIf="showUserDetailsModal" class="modal-overlay">
        <div class="modal modal-large">
          <div class="modal-header">
            <h3>User Details</h3>
            <button (click)="closeUserDetailsModal()" class="btn-close">
              <span class="material-icons">close</span>
            </button>
          </div>

          <div *ngIf="selectedUserDetails">
            <div class="modal-body">
              <div class="user-details-content">
                <div class="user-profile-header">
                  <div class="user-avatar">
                    <img [src]="getUserAvatar(selectedUserDetails)" [alt]="selectedUserDetails.fullName">
                  </div>
                  <div class="user-basic-info">
                    <h2>{{ selectedUserDetails.fullName }}</h2>
                    <p class="user-email">{{ selectedUserDetails.email }}</p>
                    <div class="user-status">
                      <span [class]="selectedUserDetails.banned ? 'status-banned' : 'status-active'">
                        {{ selectedUserDetails.banned ? 'Banned' : 'Active' }}
                      </span>
                      <span class="role-badge">{{ selectedUserDetails.role }}</span>
                    </div>
                  </div>
                </div>

                <div class="details-grid">
                  <div class="detail-section">
                    <h4>Contact Information</h4>
                    <div class="detail-item">
                      <span class="material-icons">phone</span>
                      <div>
                        <label>Phone</label>
                        <p>{{ selectedUserDetails.phone || 'Not provided' }}</p>
                      </div>
                    </div>
                    <div class="detail-item">
                      <span class="material-icons">location_on</span>
                      <div>
                        <label>Location</label>
                        <p>{{ selectedUserDetails.location || 'Not provided' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="detail-section">
                    <h4>Account Information</h4>
                    <div class="detail-item">
                      <span class="material-icons">person</span>
                      <div>
                        <label>User ID</label>
                        <p>#{{ selectedUserDetails.id }}</p>
                      </div>
                    </div>
                    <div class="detail-item">
                      <span class="material-icons">calendar_today</span>
                      <div>
                        <label>Member Since</label>
                        <p>{{ selectedUserDetails.createdAt | date: 'MMM d, yyyy' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="detail-section" *ngIf="userStats">
                    <h4>Activity Stats</h4>
                    <div class="stats-grid">
                      <div class="stat-item">
                        <span class="stat-number">{{ userStats.tasksPosted || 0 }}</span>
                        <span class="stat-label">Tasks Posted</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">{{ userStats.tasksCompleted || 0 }}</span>
                        <span class="stat-label">Tasks Completed</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">{{ userStats.applications || 0 }}</span>
                        <span class="stat-label">Applications</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button (click)="closeUserDetailsModal()" class="btn btn-outline">Close</button>
              <button
                *ngIf="!selectedUserDetails.banned"
                (click)="openBanModalFromDetails(selectedUserDetails)"
                class="btn btn-danger">
                Ban User
              </button>
              <button
                *ngIf="selectedUserDetails.banned"
                (click)="unbanUserFromDetails(selectedUserDetails.id)"
                class="btn btn-success">
                Unban User
              </button>
            </div>
          </div>

          <div *ngIf="!selectedUserDetails" class="modal-body">
            <div class="loading-state">
              <span class="material-icons">refresh</span>
              <p>Loading user details...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-users {
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

    .users-table-container {
      background: var(--white);
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 16px var(--shadow-light);
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table th {
      background: var(--bg-greenish);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-dark);
      border-bottom: 1px solid var(--border-light);
    }

    .users-table td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-light);
    }

    .users-table tr:last-child td {
      border-bottom: none;
    }

    .users-table tr.banned {
      background: #FFF5F5;
    }

    .users-table tr:hover {
      background: var(--bg-greenish);
    }

    .user-info strong {
      display: block;
      margin-bottom: 0.25rem;
    }

    .user-info small {
      color: var(--text-gray);
    }

    .contact-info div {
      margin-bottom: 0.25rem;
    }

    .role-badge {
      background: var(--light-green);
      color: var(--primary-green);
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-active {
      color: #388E3C;
      font-weight: 500;
    }

    .status-banned {
      color: #D32F2F;
      font-weight: 500;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .btn-danger {
      background: #D32F2F;
      color: white;
    }

    .btn-success {
      background: #388E3C;
      color: white;
    }

    .empty-state {
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state .material-icons {
      font-size: 4rem;
      color: var(--text-light);
      margin-bottom: 1rem;
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
    }

    /* User Details Styles */
    .user-details-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .user-profile-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-basic-info h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .user-email {
      color: var(--text-gray);
      margin: 0 0 1rem 0;
    }

    .user-status {
      display: flex;
      gap: 0.5rem;
      align-items: center;
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

    .user-bio {
      line-height: 1.6;
      color: var(--text-dark);
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-tag {
      background: var(--light-green);
      color: var(--primary-green);
      padding: 0.375rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .admin-users {
        padding: 1rem;
      }

      .users-table {
        display: block;
        overflow-x: auto;
      }

      .action-buttons {
        flex-direction: column;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .user-profile-header {
        flex-direction: column;
        text-align: center;
      }

      .modal {
        width: 95%;
        margin: 1rem;
      }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  showBanModal = false;
  showUserDetailsModal = false;
  selectedUser: User | null = null;
  selectedUserDetails: User | null = null;
  banReason = '';
  userStats: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  openBanModal(user: User): void {
    this.selectedUser = user;
    this.banReason = ''; // Reset ban reason
    this.showBanModal = true;
  }

  // New method to open ban modal from details modal
  openBanModalFromDetails(user: User): void {
    this.closeUserDetailsModal(); // Close details modal first
    setTimeout(() => {
      this.openBanModal(user); // Then open ban modal
    }, 300); // Small delay to ensure smooth transition
  }

  closeBanModal(): void {
    this.showBanModal = false;
    this.selectedUser = null;
    this.banReason = '';
  }

  confirmBan(): void {
    if (this.selectedUser && this.banReason.trim()) {
      this.adminService.banUser(this.selectedUser.id, this.banReason).subscribe({
        next: () => {
          this.loadUsers();
          this.closeBanModal();
        },
        error: (error) => {
          console.error('Error banning user:', error);
        }
      });
    }
  }

  unbanUser(userId: number): void {
    this.adminService.unbanUser(userId).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error unbanning user:', error);
      }
    });
  }

  // New method to unban from details modal
  unbanUserFromDetails(userId: number): void {
    this.adminService.unbanUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.closeUserDetailsModal(); // Close details modal after unban
      },
      error: (error) => {
        console.error('Error unbanning user:', error);
      }
    });
  }

  viewUserDetails(user: User): void {
    this.selectedUserDetails = user;
    this.loadUserStats(user.id);
    this.showUserDetailsModal = true;
  }

  closeUserDetailsModal(): void {
    this.showUserDetailsModal = false;
    this.selectedUserDetails = null;
    this.userStats = null;
  }

  loadUserStats(userId: number): void {
    this.adminService.getUserStats(userId).subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
        this.userStats = { tasksPosted: 0, tasksCompleted: 0, applications: 0 };
      }
    });
  }

  getUserAvatar(user: User): string {
    if (user.avatar) {
      return user.avatar;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=4CAF50&color=fff`;
  }
}
