import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    this.userService.login(email, password).subscribe({
      next: (response: any) => {
        console.log("LOGIN SUCCESS:", response);
        this.loading = false;

        // Handle different response formats
        const user = response.user || response;

        if (user && user.id) {
          // Set user in service
          this.userService.setCurrentUser(user);


          // Role-based navigation
if (user.role === 'ADMIN') {
  this.router.navigate(['/admin']);
} else {
  this.router.navigate(['/dashboard']);
}
        } else {
          this.error = 'Invalid response from server';
        }
      },
      error: (err) => {
        console.error("LOGIN ERROR:", err);
        this.loading = false;

        // More specific error handling
        if (err.status === 403) {
          this.error = 'Access forbidden - check your credentials or contact administrator';
        } else if (err.status === 401) {
          this.error = 'Invalid email or password';
        } else if (err.status === 0) {
          this.error = 'Cannot connect to server - make sure backend is running';
        } else {
          this.error = err.error?.message || 'Login failed. Please try again.';
        }
      }
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
