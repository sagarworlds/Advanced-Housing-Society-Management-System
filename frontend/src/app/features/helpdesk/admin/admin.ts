import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { HelpdeskService, Ticket } from '../../../core/services/helpdesk';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatMenuModule, MatSnackBarModule
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  private helpdeskService = inject(HelpdeskService);
  private snackBar = inject(MatSnackBar);

  tickets: Ticket[] = [];

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.helpdeskService.getTickets().subscribe({
      next: (data) => this.tickets = data,
      error: () => this.snackBar.open('Failed to load tickets', 'Close')
    });
  }

  updateStatus(ticket: Ticket, newStatus: number) {
    if (!ticket.id) return;
    this.helpdeskService.updateTicketStatus(ticket.id, newStatus).subscribe({
      next: () => {
        this.snackBar.open('Ticket status updated!', 'Close', { duration: 3000 });
        this.loadTickets();
      },
      error: () => {
        this.snackBar.open('Failed to update status', 'Close');
      }
    });
  }

  getCategoryText(cat: number): string {
    const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Security', 'Other'];
    return categories[cat] || 'Unknown';
  }

  getPriorityText(pri: number): string {
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    return priorities[pri] || 'Unknown';
  }

  getStatusText(status?: number): string {
    switch(status) {
      case 0: return 'Open';
      case 1: return 'Assigned';
      case 2: return 'In Progress';
      case 3: return 'Resolved';
      case 4: return 'Closed';
      default: return 'Unknown';
    }
  }
}
