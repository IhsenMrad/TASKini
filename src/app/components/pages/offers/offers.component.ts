import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { Task } from '../../../models/task.model';
import { BadgeComponent } from '../../shared/badge/badge.component';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-offers',
    standalone: true,
    imports: [CommonModule, RouterModule, BadgeComponent],
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
    myTasksWithApplications: any[] = [];
    loading = true;

    constructor(
        private taskService: TaskService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.loadOffers();
    }

    loadOffers(): void {
        const user = this.userService.getCurrentUser();
        if (!user || !user.id) return;

        this.loading = true;
        // 1. Get all tasks created by the user
        this.taskService.getTasksByUser(Number(user.id)).subscribe({
            next: (tasks) => {
                if (tasks.length === 0) {
                    this.loading = false;
                    return;
                }

                // 2. For each task, get its applications
                const observables = tasks.map(task =>
                    this.taskService.getApplications(task.id).toPromise()
                        .then(apps => ({ task, applications: apps || [] }))
                        .catch(() => ({ task, applications: [] }))
                );

                Promise.all(observables).then(async results => {
                    // Filter out tasks with no applications
                    const tasksWithApps = results.filter(item => item.applications.length > 0);

                    // 3. Fetch user details for each applicant
                    for (const item of tasksWithApps) {
                        for (const app of item.applications) {
                            try {
                                const applicantUser = await this.userService.getUserById(app.applicantId).toPromise();
                                // Use fullName from backend, fallback to name (legacy) or ID
                                app.userName = applicantUser?.fullName || applicantUser?.name || `User #${app.applicantId}`;
                            } catch (err) {
                                console.error(`Failed to fetch user ${app.applicantId}`, err);
                                app.userName = `User #${app.applicantId}`;
                            }
                        }
                    }

                    this.myTasksWithApplications = tasksWithApps;
                    this.loading = false;
                });
            },
            error: (err) => {
                console.error('Failed to load user tasks', err);
                this.loading = false;
            }
        });
    }

    acceptApplication(task: Task, app: any): void {
        if (!confirm('Are you sure you want to accept this application?')) return;

        this.taskService.acceptApplication(task.id, app.id).subscribe({
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

    rejectApplication(task: Task, app: any): void {
        if (!confirm('Are you sure you want to reject this application?')) return;

        this.taskService.rejectApplication(task.id, app.id).subscribe({
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
