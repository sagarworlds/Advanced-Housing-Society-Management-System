import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  hidePassword = true;
  loading = false;
  error = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.authService.setToken(res.token);
          this.loading = false;
          
          if (res.role === 'SuperAdmin') {
            this.router.navigate(['/superadmin/dashboard']);
          } else if (res.role === 'SocietyAdmin') {
            this.router.navigate(['/facility/admin']);
          } else {
            this.router.navigate(['/communication/notice-board']);
          }
        },
        error: (err) => {
          this.error = 'Invalid email or password';
          this.loading = false;
        }
      });
    }
  }
}
