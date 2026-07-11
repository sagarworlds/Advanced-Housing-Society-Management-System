import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MaintenanceService, Invoice } from '../../core/services/maintenance';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule
  ],
  templateUrl: './maintenance.html',
  styleUrls: ['./maintenance.css']
})
export class Maintenance implements OnInit {
  private maintenanceService = inject(MaintenanceService);
  private snackBar = inject(MatSnackBar);

  invoices: Invoice[] = [];
  displayedColumns: string[] = ['invoiceNumber', 'flat', 'amount', 'dueDate', 'status', 'actions'];
  loading = true;

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.loading = true;
    this.maintenanceService.getInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load invoices', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  generateBills() {
    this.loading = true;
    this.maintenanceService.generateInvoices().subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 3000 });
        this.loadInvoices();
      },
      error: () => {
        this.snackBar.open('Failed to generate bills', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  payRazorpay(invoice: Invoice) {
    this.snackBar.open(`Initiating Razorpay for ${invoice.invoiceNumber}...`, 'Close', { duration: 3000 });
    // Note: Add Razorpay checkout logic here
  }

  payUpi(invoice: Invoice) {
    this.snackBar.open(`Initiating UPI payment upload for ${invoice.invoiceNumber}...`, 'Close', { duration: 3000 });
    // Note: Add manual UPI screenshot upload dialog here
  }

  getStatusText(status: number): string {
    switch(status) {
      case 0: return 'Unpaid';
      case 1: return 'Verification Pending';
      case 2: return 'Paid';
      case 3: return 'Overdue';
      default: return 'Unknown';
    }
  }
}
