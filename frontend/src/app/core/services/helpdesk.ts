import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Ticket {
  id?: string;
  title: string;
  description: string;
  category: number; // 0=Plumbing, 1=Electrical, 2=Cleaning, 3=Security, 4=Other
  status?: number; // 0=Open, 1=Assigned, 2=InProgress, 3=Resolved, 4=Closed
  priority: number; // 0=Low, 1=Medium, 2=High, 3=Critical
  createdByUserId?: string;
  assignedToUserId?: string;
  attachmentUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HelpdeskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ticket`;

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  createTicket(formData: FormData): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, formData);
  }

  updateTicketStatus(id: string, status: number): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}/status`, { status });
  }
}
