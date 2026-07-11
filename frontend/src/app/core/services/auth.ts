import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email?: string | null;
  password?: string | null;
}

export interface RegisterRequest {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
  societyCode?: string | null;
  flatNumber?: string | null;
}

export interface SocietyOnboardingRequest {
  societyName: string;
  domain: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  selectedModuleIds: string[];
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  tenantId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  registerResident(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/resident`, data);
  }

  onboardSociety(data: SocietyOnboardingRequest): Observable<any> {
    // Calling the TenantController endpoint
    return this.http.post(`${environment.apiUrl}/tenant/onboard`, data);
  }

  setToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}
