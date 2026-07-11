import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notice {
  id?: string;
  title: string;
  content: string;
  expiryDate?: string;
  isUrgent: boolean;
  createdAt?: string;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface Poll {
  id: string;
  question: string;
  expiryDate: string;
  isClosed: boolean;
  options: PollOption[];
}

export interface PollVote {
  pollOptionId: string;
  flatId?: string; // Will be set to empty/mock in backend if not provided
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/communication`;

  getNotices(): Observable<Notice[]> {
    return this.http.get<Notice[]>(`${this.apiUrl}/notices`);
  }

  getPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.apiUrl}/polls`);
  }

  castVote(pollId: string, vote: PollVote): Observable<any> {
    return this.http.post(`${this.apiUrl}/polls/${pollId}/vote`, vote);
  }
}
