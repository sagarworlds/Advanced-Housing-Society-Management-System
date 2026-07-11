import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { VisitorService, Visitor } from '../../../core/services/visitor';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-resident',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatSnackBarModule, MatBadgeModule
  ],
  templateUrl: './resident.html',
  styleUrls: ['./resident.css']
})
export class Resident implements OnInit, OnDestroy {
  private visitorService = inject(VisitorService);
  private snackBar = inject(MatSnackBar);

  pendingVisitors: Visitor[] = [];
  
  // Mock Flat ID for testing real-time WebSockets
  // In reality, this comes from the JWT Auth Token claims
  mockFlatId = '11111111-1111-1111-1111-111111111111';

  ngOnInit() {
    this.visitorService.startConnection(this.mockFlatId);

    this.visitorService.visitorArrived$.subscribe((visitor) => {
      this.pendingVisitors.push(visitor);
      
      // Try HTML5 Notifications
      if (Notification.permission === "granted") {
        new Notification(`Visitor Alert: ${visitor.name}`, {
          body: `${visitor.name} is at the gate for ${visitor.purpose}.`,
          icon: '/assets/icons/icon-192x192.png'
        });
      }
      this.snackBar.open(`New Visitor at Gate: ${visitor.name}`, 'Close', { duration: 10000 });
    });
    
    // Request permission for push notifications
    if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }

  ngOnDestroy() {
    this.visitorService.stopConnection(this.mockFlatId);
  }

  respondToVisitor(visitor: Visitor, status: number) {
    if (!visitor.id) return;
    
    this.visitorService.updateVisitorStatus(visitor.id, status).subscribe({
      next: () => {
        this.pendingVisitors = this.pendingVisitors.filter(v => v.id !== visitor.id);
        const statusText = status === 1 ? 'Approved' : 'Denied';
        this.snackBar.open(`Visitor ${statusText}`, 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error responding to visitor', 'Close');
      }
    });
  }
}
