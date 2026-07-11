import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-onboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './onboard.html',
  styleUrls: ['./onboard.css']
})
export class Onboard {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  onboardForm = this.fb.group({
    societyName: ['', Validators.required],
    domain: ['', Validators.required],
    adminFirstName: ['', Validators.required],
    adminLastName: ['', Validators.required],
    adminEmail: ['', [Validators.required, Validators.email]],
    adminPassword: ['', [Validators.required, Validators.minLength(8)]],
    modules: this.fb.group({
      maintenance: [true],
      visitors: [false],
      amenities: [false],
      helpdesk: [true]
    })
  });

  hidePassword = true;
  loading = false;
  error = '';

  onSubmit() {
    if (this.onboardForm.valid) {
      this.loading = true;
      this.error = '';

      const formValue = this.onboardForm.value;
      const selectedModules = [];
      if (formValue.modules?.maintenance) selectedModules.push('maintenance');
      if (formValue.modules?.visitors) selectedModules.push('visitors');
      if (formValue.modules?.amenities) selectedModules.push('amenities');
      if (formValue.modules?.helpdesk) selectedModules.push('helpdesk');

      const payload = {
        societyName: formValue.societyName!,
        domain: formValue.domain!,
        adminFirstName: formValue.adminFirstName!,
        adminLastName: formValue.adminLastName!,
        adminEmail: formValue.adminEmail!,
        adminPassword: formValue.adminPassword!,
        selectedModuleIds: selectedModules
      };

      this.authService.onboardSociety(payload).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Society Onboarded Successfully!', 'Close', { duration: 5000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Onboarding failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}
