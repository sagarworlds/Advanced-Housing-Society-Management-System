import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Flat } from './maintenance';

export interface Visitor {
  id?: string;
  name: string;
  phoneNumber: string;
  flatId: string;
  flat?: Flat;
  purpose: string;
  passCode?: string;
  status: number; // 0=Pending, 1=Approved, 2=Denied, 3=Entered, 4=Exited
  arrivalTime?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/visitor`;
  private hubConnection: signalR.HubConnection | undefined;

  public visitorArrived$ = new Subject<Visitor>();
  public visitorStatusUpdated$ = new Subject<Visitor>();

  startConnection(flatId?: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/visitor`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR Connection Started');
        if (flatId) {
          this.hubConnection?.invoke('JoinFlatGroup', flatId);
        }
      })
      .catch(err => console.error('Error while starting SignalR connection: ' + err));

    this.hubConnection.on('VisitorArrived', (visitor: Visitor) => {
      this.visitorArrived$.next(visitor);
    });

    this.hubConnection.on('VisitorStatusUpdated', (visitor: Visitor) => {
      this.visitorStatusUpdated$.next(visitor);
    });
  }

  stopConnection(flatId?: string) {
    if (this.hubConnection) {
      if (flatId) {
         this.hubConnection.invoke('LeaveFlatGroup', flatId).catch(console.error);
      }
      this.hubConnection.stop();
    }
  }

  getVisitors(): Observable<Visitor[]> {
    return this.http.get<Visitor[]>(this.apiUrl);
  }

  logVisitorArrival(visitor: Visitor): Observable<Visitor> {
    return this.http.post<Visitor>(`${this.apiUrl}/arrive`, visitor);
  }

  updateVisitorStatus(id: string, status: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/status`, { status });
  }
}
