import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { VisitorService, Visitor } from '../../../core/services/visitor';
import { MaintenanceService, Flat } from '../../../core/services/maintenance';

@Component({
  selector: 'app-guard',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, 
    MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule, 
    MatSnackBarModule, MatListModule
  ],
  templateUrl: './guard.html',
  styleUrls: ['./guard.css']
})
export class Guard implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private visitorService = inject(VisitorService);
  private maintenanceService = inject(MaintenanceService);
  private snackBar = inject(MatSnackBar);

  flats: Flat[] = [];
  recentVisitors: Visitor[] = [];
  loading = false;

  visitorForm = this.fb.group({
    name: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    flatId: ['', Validators.required],
    purpose: ['', Validators.required]
  });

  ngOnInit() {
    this.visitorService.startConnection();

    this.maintenanceService.getFlats().subscribe({
      next: (data) => this.flats = data,
      error: () => this.snackBar.open('Error loading flats', 'Close')
    });

    this.loadVisitors();

    this.visitorService.visitorStatusUpdated$.subscribe((v) => {
      this.snackBar.open(`Visitor ${v.name} status updated to ${this.getStatusText(v.status)}`, 'Close', { duration: 5000 });
      this.loadVisitors();
    });
  }

  ngOnDestroy() {
    this.visitorService.stopConnection();
  }

  loadVisitors() {
    this.visitorService.getVisitors().subscribe(data => this.recentVisitors = data.slice(0, 5));
  }

  onSubmit() {
    if (this.visitorForm.valid) {
      this.loading = true;
      const formValue = this.visitorForm.value;
      const visitor: Visitor = {
        name: formValue.name!,
        phoneNumber: formValue.phoneNumber!,
        flatId: formValue.flatId!,
        purpose: formValue.purpose!,
        status: 0 // Pending
      };

      this.visitorService.logVisitorArrival(visitor).subscribe({
        next: () => {
          this.snackBar.open('Visitor logged! Awaiting resident approval...', 'Close', { duration: 5000 });
          this.visitorForm.reset();
          this.loading = false;
          this.loadVisitors();
        },
        error: () => {
          this.snackBar.open('Error logging visitor', 'Close');
          this.loading = false;
        }
      });
    }
  }

  getStatusText(status: number): string {
    switch(status) {
      case 0: return 'Pending Approval';
      case 1: return 'Approved';
      case 2: return 'Denied';
      case 3: return 'Entered';
      case 4: return 'Exited';
      default: return 'Unknown';
    }
  }
}
