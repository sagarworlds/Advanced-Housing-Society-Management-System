import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Facility {
  id?: string;
  name: string;
  description: string;
  hourlyRate: number;
  maxCapacity: number;
}

export interface FacilityBooking {
  id?: string;
  facilityId: string;
  facility?: Facility;
  flatId?: string; // mock
  startTime: string; // ISO 8601 string
  endTime: string;   // ISO 8601 string
  status?: number; // 0=Pending, 1=Confirmed, 2=Cancelled, 3=Completed
  bookedByUserId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/facility`;

  getFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(this.apiUrl);
  }

  getBookings(facilityId?: string, date?: string): Observable<FacilityBooking[]> {
    let params = new HttpParams();
    if (facilityId) params = params.set('facilityId', facilityId);
    if (date) params = params.set('date', date);
    
    return this.http.get<FacilityBooking[]>(`${this.apiUrl}/bookings`, { params });
  }

  bookFacility(booking: FacilityBooking): Observable<FacilityBooking> {
    return this.http.post<FacilityBooking>(`${this.apiUrl}/book`, booking);
  }
}
