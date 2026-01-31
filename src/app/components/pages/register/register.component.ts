import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']   // ✔ تم الإصلاح
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { fullName, location, phone, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    const data = { fullName, location, phone, email, password };

    this.userService.register(data).subscribe({
      next: res => {
        console.log("REGISTER SUCCESS:", res);
        alert("Compte créé avec succès !");
        this.router.navigate(['/login']);
      },
      error: err => {
        console.log("REGISTER ERROR:", err);
        alert("Erreur lors de l'inscription !");
      }
    });
  }

  get fullName() { return this.registerForm.get('fullName'); }
  get location() { return this.registerForm.get('location'); }
  get phone() { return this.registerForm.get('phone'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  passwordsMatch(): boolean {
    return this.password?.value === this.confirmPassword?.value;
  }
}
