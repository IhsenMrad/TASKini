import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminStats, User, Task } from '../../../../services/admin.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  ArcElement,
  DoughnutController,
  PieController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  ArcElement,
  DoughnutController,
  PieController,
  Title,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  stats: AdminStats | null = null;
  loading = true;
  chartsLoaded = false;

  // Modal states
  showUserModal = false;
  showTaskModal = false;
  showUsersListModal = false;
  showTasksListModal = false;

  // Selected items
  selectedUser: User | null = null;
  selectedTask: Task | null = null;

  // Lists for modals
  allUsers: User[] = [];
  allTasks: Task[] = [];
  filteredUsers: User[] = [];
  filteredTasks: Task[] = [];

  // List titles
  usersListTitle = '';
  tasksListTitle = '';

  // Stats
  userStats: any = null;
  taskStats: any = null;
  taskApplications: any[] = [];

  // Precomputed values for user analysis - initialize with default values
  bannedPercentage: string = '0';
  unbannedPercentage: string = '0';
  unbannedUsers: number = 0;
  activeUsersLast7Days: number = 0;
  activeUsersPercentage: string = '0';

  // Precomputed values for task analysis - initialize with default values
  flaggedPercentage: string = '0';
  completionRate: string = '0';
  openTasksPercentage: string = '0';
  inProgressTasks: number = 0;
  inProgressPercentage: string = '0';

  // Chart data - initialize with proper structure
  userStatusChartData: any = {
    labels: ['Banned Users', 'Unbanned Users'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB']
    }]
  };

  taskStatusChartData: any = {
    labels: ['Open', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#FF6384'],
      hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#FF6384']
    }]
  };

  taskFlaggedChartData: any = {
    labels: ['Flagged Tasks', 'Normal Tasks'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB']
    }]
  };

  revenueChartData: any = {
    labels: [],
    datasets: [{
      label: 'Revenue ($)',
      data: [],
      borderColor: '#388E3C',
      backgroundColor: 'rgba(56, 142, 60, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  platformActivityChartData: any = {
    labels: [],
    datasets: [
      {
        label: 'Tasks Created',
        data: [],
        borderColor: '#1976D2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Applications',
        data: [],
        borderColor: '#F57C00',
        backgroundColor: 'rgba(245, 124, 0, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  budgetChartData: any = {
    labels: [],
    datasets: [{
      label: 'Number of Tasks',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Chart options
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      }
    }
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      }
    }
  };

  recentActivities = [
    {
      icon: 'flag',
      description: 'Task "Help with moving" was flagged for review',
      timestamp: '2 hours ago'
    },
    {
      icon: 'block',
      description: 'User john_doe was banned for violating terms',
      timestamp: '5 hours ago'
    },
    {
      icon: 'check_circle',
      description: 'Task "Garden maintenance" was completed successfully',
      timestamp: '1 day ago'
    },
    {
      icon: 'person_add',
      description: 'New user sarah_wilson registered on the platform',
      timestamp: '1 day ago'
    },
    {
      icon: 'warning',
      description: 'System maintenance completed successfully',
      timestamp: '2 days ago'
    },
    {
      icon: 'trending_up',
      description: 'Platform reached 1000 total tasks milestone',
      timestamp: '3 days ago'
    }
  ];

  constructor(
    private adminService: AdminService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.stats = null;
    this.allUsers = [];
    this.allTasks = [];

    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.precomputeValues();
        this.loadChartData();

        this.adminService.getUsers().subscribe({
          next: (users) => {
            this.allUsers = users;

            this.adminService.getTasks().subscribe({
              next: (tasks) => {
                // Ensure tasks have valid status values
                this.allTasks = tasks.map(task => ({
                  ...task,
                  status: task.status || 'UNKNOWN'
                }));
                this.loading = false;
                this.chartsLoaded = true;
                // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                  this.cdRef.markForCheck();
                });
              },
              error: (error) => {
                console.error('Error loading tasks:', error);
                this.loading = false;
                this.chartsLoaded = true;
                setTimeout(() => {
                  this.cdRef.markForCheck();
                });
              }
            });
          },
          error: (error) => {
            console.error('Error loading users:', error);
            this.loading = false;
            setTimeout(() => {
              this.cdRef.markForCheck();
            });
          }
        });
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
        this.chartsLoaded = true;
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      }
    });
  }

  // Auto reload method
  reloadAllData(): void {
    this.loading = true;
    // Reset all data to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.stats = null;
    this.allUsers = [];
    this.allTasks = [];
    this.filteredUsers = [];
    this.filteredTasks = [];

    setTimeout(() => {
      this.loadData();

      // If modals are open, reload their data too
      if (this.selectedUser) {
        this.loadUserStats(this.selectedUser.id);
      }
      if (this.selectedTask) {
        this.loadTaskStats(this.selectedTask.id);
        this.loadTaskApplications(this.selectedTask.id);
      }
    });
  }

  private precomputeValues(): void {
    if (!this.stats) return;

    // User analysis calculations
    this.bannedPercentage = this.getPercentage(this.stats.banned_users, this.stats.total_users);
    this.unbannedUsers = this.stats.total_users - this.stats.banned_users;
    this.unbannedPercentage = this.getPercentage(this.unbannedUsers, this.stats.total_users);

    // Use actual data from stats if available, otherwise calculate
    this.activeUsersLast7Days = this.stats.active_users_last_7_days || Math.floor(this.stats.total_users * 0.3);
    this.activeUsersPercentage = this.getPercentage(this.activeUsersLast7Days, this.stats.total_users);

    // Task analysis calculations
    this.flaggedPercentage = this.getPercentage(this.stats.flagged_tasks, this.stats.total_tasks);
    this.completionRate = this.getPercentage(this.stats.completed_tasks, this.stats.total_tasks);

    // Calculate other task statuses (these would ideally come from the backend)
    const openTasks = Math.floor(this.stats.total_tasks * 0.4); // 40% open
    this.openTasksPercentage = this.getPercentage(openTasks, this.stats.total_tasks);

    this.inProgressTasks = this.stats.total_tasks - this.stats.completed_tasks - openTasks;
    this.inProgressPercentage = this.getPercentage(this.inProgressTasks, this.stats.total_tasks);
  }

  loadChartData(): void {
    if (!this.stats) return;

    // Update the chart data with actual values
    this.updateUserStatusChart();
    this.updateTaskStatusChart();
    this.updateTaskFlaggedChart();

    // Load async chart data
    this.loadRevenueData();
    this.loadPlatformActivityData();
    this.loadBudgetData();
  }

  updateUserStatusChart(): void {
    if (!this.stats) return;

    this.userStatusChartData = {
      ...this.userStatusChartData,
      datasets: [{
        ...this.userStatusChartData.datasets[0],
        data: [this.stats.banned_users, this.unbannedUsers]
      }]
    };
  }

  updateTaskStatusChart(): void {
    if (!this.stats) return;

    // Calculate task status distribution
    const openTasks = Math.floor(this.stats.total_tasks * 0.4);
    const cancelledTasks = Math.floor(this.stats.total_tasks * 0.1);

    this.taskStatusChartData = {
      ...this.taskStatusChartData,
      datasets: [{
        ...this.taskStatusChartData.datasets[0],
        data: [
          openTasks,
          this.inProgressTasks,
          this.stats.completed_tasks,
          cancelledTasks
        ]
      }]
    };
  }

  updateTaskFlaggedChart(): void {
    if (!this.stats) return;

    const unflaggedTasks = this.stats.total_tasks - this.stats.flagged_tasks;

    this.taskFlaggedChartData = {
      ...this.taskFlaggedChartData,
      datasets: [{
        ...this.taskFlaggedChartData.datasets[0],
        data: [this.stats.flagged_tasks, unflaggedTasks]
      }]
    };
  }

  loadRevenueData(): void {
    this.adminService.getRevenueOverview().subscribe({
      next: (data) => {
        this.revenueChartData = {
          labels: data.labels,
          datasets: [{
            label: 'Revenue ($)',
            data: data.data,
            borderColor: '#388E3C',
            backgroundColor: 'rgba(56, 142, 60, 0.1)',
            tension: 0.4,
            fill: true
          }]
        };
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      },
      error: (error) => {
        console.error('Error loading revenue data:', error);
        // Set fallback data
        this.revenueChartData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue ($)',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: '#388E3C',
            backgroundColor: 'rgba(56, 142, 60, 0.1)',
            tension: 0.4,
            fill: true
          }]
        };
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      }
    });
  }

  loadPlatformActivityData(): void {
    this.adminService.getPlatformActivity().subscribe({
      next: (data) => {
        this.platformActivityChartData = {
          labels: data.labels,
          datasets: [
            {
              label: 'Tasks Created',
              data: data.tasks,
              borderColor: '#1976D2',
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Applications',
              data: data.applications,
              borderColor: '#F57C00',
              backgroundColor: 'rgba(245, 124, 0, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        };
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      },
      error: (error) => {
        console.error('Error loading platform activity data:', error);
        // Set fallback data
        this.platformActivityChartData = {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Tasks Created',
              data: [12, 19, 15, 25, 22, 30, 18],
              borderColor: '#1976D2',
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Applications',
              data: [28, 35, 42, 38, 45, 52, 40],
              borderColor: '#F57C00',
              backgroundColor: 'rgba(245, 124, 0, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        };
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      }
    });
  }

  loadBudgetData(): void {
    this.adminService.getBudgetDistribution().subscribe({
      next: (data) => {
        this.budgetChartData = {
          labels: data.labels,
          datasets: [{
            label: 'Number of Tasks',
            data: data.data,
            backgroundColor: data.colors || [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: data.colors?.map((color: string) => color.replace('0.6', '1')) || [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        };
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      },
      error: (error) => {
        console.error('Error loading budget data:', error);
        // Set fallback data
        this.budgetChartData = {
          labels: ['$0-50', '$51-100', '$101-200', '$201-500', '$500+'],
          datasets: [{
            label: 'Number of Tasks',
            data: [15, 35, 25, 18, 7],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        };
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      }
    });
  }

getStatusClass(status: string | null | undefined): string {
  const safeStatus = (status || 'UNKNOWN').toLowerCase();
  return `status-${safeStatus}`;
}

  // User Modal Methods
  viewAllUsers(): void {
    this.filteredUsers = this.allUsers;
    this.usersListTitle = 'All Users';
    this.showUsersListModal = true;
  }

  viewBannedUsers(): void {
    this.filteredUsers = this.allUsers.filter(user => user.banned);
    this.usersListTitle = 'Banned Users';
    this.showUsersListModal = true;
  }

  viewActiveUsers(): void {
    this.filteredUsers = this.allUsers.filter(user => !user.banned);
    this.usersListTitle = 'Active Users';
    this.showUsersListModal = true;
  }

  viewUserDetails(user: User): void {
    this.selectedUser = user;
    this.loadUserStats(user.id);
    this.showUsersListModal = false;
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
    this.userStats = null;
  }

  closeUsersListModal(): void {
    this.showUsersListModal = false;
    this.filteredUsers = [];
  }

  // Task Modal Methods
  viewAllTasks(): void {
    this.filteredTasks = this.allTasks;
    this.tasksListTitle = 'All Tasks';
    this.showTasksListModal = true;
  }

  viewFlaggedTasks(): void {
    this.filteredTasks = this.allTasks.filter(task => task.flagged);
    this.tasksListTitle = 'Flagged Tasks';
    this.showTasksListModal = true;
  }

  viewCompletedTasks(): void {
    this.filteredTasks = this.allTasks.filter(task => task.status === 'COMPLETED');
    this.tasksListTitle = 'Completed Tasks';
    this.showTasksListModal = true;
  }

  viewInProgressTasks(): void {
    this.filteredTasks = this.allTasks.filter(task => task.status === 'IN_PROGRESS');
    this.tasksListTitle = 'In Progress Tasks';
    this.showTasksListModal = true;
  }

  viewTaskDetails(task: Task): void {
    this.selectedTask = {
      ...task,
      status: task.status || 'UNKNOWN'
    };
    this.loadTaskStats(task.id);
    this.loadTaskApplications(task.id);
    this.showTasksListModal = false;
    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.selectedTask = null;
    this.taskStats = null;
    this.taskApplications = [];
  }

  closeTasksListModal(): void {
    this.showTasksListModal = false;
    this.filteredTasks = [];
  }

  // User Actions with null checks and auto-reload
  banUser(user: User): void {
    const reason = prompt('Enter ban reason:');
    if (reason && this.selectedUser) {
      this.adminService.banUser(this.selectedUser.id, reason).subscribe({
        next: () => {
          // Auto-reload after successful ban
          setTimeout(() => {
            this.reloadAllData();
          });
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
        // Auto-reload after successful unban
        setTimeout(() => {
          this.reloadAllData();
        });
      },
      error: (error) => {
        console.error('Error unbanning user:', error);
      }
    });
  }

  // Task Actions with null checks and auto-reload
  flagTask(task: Task): void {
    const reason = prompt('Enter flag reason:');
    if (reason && this.selectedTask) {
      this.adminService.flagTask(this.selectedTask.id, reason).subscribe({
        next: () => {
          // Auto-reload after successful flag
          setTimeout(() => {
            this.reloadAllData();
          });
        },
        error: (error) => {
          console.error('Error flagging task:', error);
        }
      });
    }
  }

  unflagTask(taskId: number): void {
    this.adminService.unflagTask(taskId).subscribe({
      next: () => {
        // Auto-reload after successful unflag
        setTimeout(() => {
          this.reloadAllData();
        });
      },
      error: (error) => {
        console.error('Error unflagging task:', error);
      }
    });
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.adminService.deleteTask(taskId).subscribe({
        next: () => {
          // Auto-reload after successful deletion
          setTimeout(() => {
            this.reloadAllData();
            this.closeTaskModal();
          });
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  // Stats Loading Methods
  loadUserStats(userId: number): void {
    this.adminService.getUserStats(userId).subscribe({
      next: (stats) => {
        this.userStats = stats;
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
        this.userStats = { tasksPosted: 0, tasksCompleted: 0, applications: 0 };
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      }
    });
  }

  loadTaskStats(taskId: number): void {
    this.adminService.getTaskStats(taskId).subscribe({
      next: (stats) => {
        this.taskStats = stats;
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      },
      error: (error) => {
        console.error('Error loading task stats:', error);
        this.taskStats = { applications: 0, views: 0, saves: 0 };
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      }
    });
  }

  loadTaskApplications(taskId: number): void {
    this.adminService.getTaskApplications(taskId).subscribe({
      next: (applications) => {
        this.taskApplications = applications;
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      },
      error: (error) => {
        console.error('Error loading task applications:', error);
        this.taskApplications = [];
        setTimeout(() => {
          this.cdRef.markForCheck();
        });
      }
    });
  }

  // Helper Methods
  getActivityIconClass(icon: string): string {
    switch (icon) {
      case 'flag': return 'warning';
      case 'block': return 'danger';
      case 'check_circle': return 'success';
      case 'person_add': return 'primary';
      case 'warning': return 'warning';
      case 'trending_up': return 'success';
      default: return 'primary';
    }
  }

  getUserAvatar(user: User): string {
    if (user.avatar) {
      return user.avatar;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=4CAF50&color=fff`;
  }

  getUserTaskStats(userId: number): any {
    // In a real app, you'd fetch this from the service
    return { tasksPosted: Math.floor(Math.random() * 10) };
  }

  getTaskStats(taskId: number): any {
    // In a real app, you'd fetch this from the service
    return { applications: Math.floor(Math.random() * 5) };
  }

  // Helper methods for calculations
  private getPercentage(part: number, total: number): string {
    if (!total || total === 0) return '0';
    return ((part / total) * 100).toFixed(1);
  }
}
