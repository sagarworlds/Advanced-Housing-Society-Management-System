import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Society {
  id: string;
  name: string;
  domain: string;
  isActive: boolean;
  createdAt: string;
  selectedModuleIds: string[];
}

export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tenant`;

  getSocieties(): Observable<Society[]> {
    return this.http.get<Society[]>(this.apiUrl);
  }

  toggleSocietyStatus(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/toggle`, {});
  }

  updateSocietyModules(id: string, moduleNames: string[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/modules`, moduleNames);
  }

  getAvailableModules(): Observable<ModuleInfo[]> {
    return this.http.get<ModuleInfo[]>(`${this.apiUrl}/modules`);
  }
}
