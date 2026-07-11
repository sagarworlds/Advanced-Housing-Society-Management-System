import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Flat {
  id: string;
  block: string;
  flatNumber: string;
  floor: number;
  flatType: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  occupancyStatus: string;
  maintenanceAreaSqFt: number;
}

export interface FlatRequest {
  block: string;
  flatNumber: string;
  floor: number;
  flatType: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  occupancyStatus: string;
  maintenanceAreaSqFt: number;
}

export interface Invoice {
  id: string;
  flatId: string;
  flat?: Flat;
  invoiceNumber: string;
  amount: number;
  penalty: number;
  dueDate: string;
  status: number; // 0=Unpaid, 1=PendingVerification, 2=Paid, 3=Overdue
  paymentReference?: string;
  screenshotUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/maintenance`;

  // Flat CRUD
  getFlats(): Observable<Flat[]> {
    return this.http.get<Flat[]>(`${this.apiUrl}/flats`);
  }

  getFlat(id: string): Observable<Flat> {
    return this.http.get<Flat>(`${this.apiUrl}/flats/${id}`);
  }

  createFlat(data: FlatRequest): Observable<Flat> {
    return this.http.post<Flat>(`${this.apiUrl}/flats`, data);
  }

  updateFlat(id: string, data: FlatRequest): Observable<Flat> {
    return this.http.put<Flat>(`${this.apiUrl}/flats/${id}`, data);
  }

  deleteFlat(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/flats/${id}`);
  }

  // Invoices
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`);
  }

  generateInvoices(): Observable<any> {
    return this.http.post(`${this.apiUrl}/invoices/generate`, {});
  }
}
