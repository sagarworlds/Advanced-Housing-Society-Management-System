import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Flat {
  id: string;
  block: string;
  flatNumber: string;
  ownerName: string;
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

  getFlats(): Observable<Flat[]> {
    return this.http.get<Flat[]>(`${this.apiUrl}/flats`);
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`);
  }

  generateInvoices(): Observable<any> {
    return this.http.post(`${this.apiUrl}/invoices/generate`, {});
  }
}
