import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { HelpdeskService, Ticket } from '../../../core/services/helpdesk';

@Component({
  selector: 'app-resident',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, 
    MatButtonModule, MatFormFieldModule, MatSelectModule, MatIconModule, 
    MatSnackBarModule, MatListModule
  ],
  templateUrl: './resident.html',
  styleUrls: ['./resident.css']
})
export class Resident implements OnInit {
  private fb = inject(FormBuilder);
  private helpdeskService = inject(HelpdeskService);
  private snackBar = inject(MatSnackBar);

  tickets: Ticket[] = [];
  loading = false;
  selectedFile: File | null = null;

  ticketForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: [4, Validators.required],
    priority: [1, Validators.required]
  });

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.helpdeskService.getTickets().subscribe(data => {
      // For demo, just showing all tickets as resident's tickets
      this.tickets = data;
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      this.loading = true;
      const formValue = this.ticketForm.value;
      
      const formData = new FormData();
      formData.append('title', formValue.title!);
      formData.append('description', formValue.description!);
      formData.append('category', formValue.category!.toString());
      formData.append('priority', formValue.priority!.toString());
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.helpdeskService.createTicket(formData).subscribe({
        next: () => {
          this.snackBar.open('Ticket raised successfully!', 'Close', { duration: 3000 });
          this.ticketForm.reset({ category: 4, priority: 1 });
          this.selectedFile = null;
          this.loading = false;
          this.loadTickets();
        },
        error: () => {
          this.snackBar.open('Error raising ticket.', 'Close');
          this.loading = false;
        }
      });
    }
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
