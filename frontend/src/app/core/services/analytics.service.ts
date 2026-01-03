import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CompletionRate {
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  period: string;
}

export interface TrendData {
  labels: string[];
  completionRates: number[];
  taskCounts: number[];
}

export interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  criticalTasks: number;
  averageCompletionTime: number;
}

export interface ProductivityStreak {
  currentStreak: number;
  longestStreak?: number;
  lastActivityDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly API_URL = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getCompletionRate(dateFrom?: string, dateTo?: string): Observable<{ success: boolean; data: CompletionRate }> {
    let params = new HttpParams();
    if (dateFrom) params = params.set('dateFrom', dateFrom);
    if (dateTo) params = params.set('dateTo', dateTo);

    return this.http.get<{ success: boolean; data: CompletionRate }>(
      `${this.API_URL}/completion`,
      { params }
    );
  }

  getProductivityTrends(period: string = 'week'): Observable<{ success: boolean; data: TrendData }> {
    return this.http.get<{ success: boolean; data: TrendData }>(
      `${this.API_URL}/trends`,
      { params: { period } }
    );
  }

  getStreakData(): Observable<{ success: boolean; data: { currentStreak: number } }> {
    return this.http.get<{ success: boolean; data: { currentStreak: number } }>(
      `${this.API_URL}/streaks`
    );
  }

  getTaskStatistics(): Observable<{ success: boolean; data: TaskStatistics }> {
    return this.http.get<{ success: boolean; data: TaskStatistics }>(
      `${this.API_URL}/statistics`
    );
  }
}
