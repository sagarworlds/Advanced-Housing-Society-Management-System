import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FacilityService, Facility, FacilityBooking } from '../../../core/services/facility';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, 
    MatSelectModule, MatIconModule, MatSnackBarModule
  ],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class Booking implements OnInit {
  private facilityService = inject(FacilityService);
  private snackBar = inject(MatSnackBar);

  facilities: Facility[] = [];
  selectedFacilityId: string | null = null;
  selectedDate: Date = new Date();
  
  bookings: FacilityBooking[] = [];
  
  // Generating simple 1-hour time slots from 6 AM to 10 PM (6 to 22)
  timeSlots: number[] = Array.from({length: 17}, (_, i) => i + 6);

  ngOnInit() {
    this.facilityService.getFacilities().subscribe(data => {
      this.facilities = data;
      if (data.length > 0) {
        this.selectedFacilityId = data[0].id!;
        this.loadBookings();
      }
    });
  }

  loadBookings() {
    if (!this.selectedFacilityId) return;
    const dateStr = this.selectedDate.toISOString();
    this.facilityService.getBookings(this.selectedFacilityId, dateStr).subscribe(data => {
      this.bookings = data;
    });
  }

  onFacilityChange() {
    this.loadBookings();
  }

  onDateChange(offset: number) {
    this.selectedDate.setDate(this.selectedDate.getDate() + offset);
    this.selectedDate = new Date(this.selectedDate); // trigger change detection
    this.loadBookings();
  }

  getSlotStatus(hour: number): 'available' | 'booked' | 'my-booking' {
    const booking = this.bookings.find(b => {
      const start = new Date(b.startTime).getHours();
      return start === hour && b.status !== 2; // Not cancelled
    });
    
    if (!booking) return 'available';
    if (booking.bookedByUserId === 'Resident_1') return 'my-booking'; // Mock auth logic
    return 'booked';
  }

  bookSlot(hour: number) {
    if (!this.selectedFacilityId) return;
    if (this.getSlotStatus(hour) !== 'available') return;

    const start = new Date(this.selectedDate);
    start.setHours(hour, 0, 0, 0);
    
    const end = new Date(start);
    end.setHours(hour + 1, 0, 0, 0);

    const booking: FacilityBooking = {
      facilityId: this.selectedFacilityId,
      startTime: start.toISOString(),
      endTime: end.toISOString()
    };

    this.facilityService.bookFacility(booking).subscribe({
      next: () => {
        this.snackBar.open('Booking Confirmed!', 'Close', { duration: 3000 });
        this.loadBookings();
      },
      error: (err) => {
        // Concurrency Error Handling (409 Conflict)
        this.snackBar.open(err.error?.message || 'Error booking slot. It may have just been taken!', 'Close', { duration: 5000 });
        this.loadBookings(); // refresh slots to show it's taken
      }
    });
  }

  formatHour(hour: number): string {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
  }
}
