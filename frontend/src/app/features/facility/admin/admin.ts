import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { FacilityService, Facility, FacilityBooking } from '../../../core/services/facility';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatListModule, MatTabsModule
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  private facilityService = inject(FacilityService);
  
  facilities: Facility[] = [];
  recentBookings: FacilityBooking[] = [];

  ngOnInit() {
    this.facilityService.getFacilities().subscribe(f => this.facilities = f);
    this.facilityService.getBookings().subscribe(b => {
      // Sort by start time descending for admin overview
      this.recentBookings = b.sort((x, y) => new Date(y.startTime).getTime() - new Date(x.startTime).getTime());
    });
  }

  getStatusText(status?: number): string {
    switch(status) {
      case 0: return 'Pending';
      case 1: return 'Confirmed';
      case 2: return 'Cancelled';
      case 3: return 'Completed';
      default: return 'Unknown';
    }
  }
}
