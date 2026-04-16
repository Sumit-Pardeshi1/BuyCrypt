import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api';
import { DashboardResponse } from '../../core/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getDashboard(userId: string): Observable<DashboardResponse> {
    return this.apiService.get<DashboardResponse>(`dashboard/${userId}`);
  }
}