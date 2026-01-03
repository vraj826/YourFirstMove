import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface UserPreferences {
  id: number;
  user_id: number;
  theme: string;
  notification_enabled: boolean;
  notification_timing: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<{ success: boolean; data: { user: User } }> {
    return this.http.get<{ success: boolean; data: { user: User } }>(`${this.API_URL}/profile`);
  }

  updateProfile(data: { name?: string; phoneNumber?: string }): Observable<{ success: boolean; data: { user: User } }> {
    return this.http.put<{ success: boolean; data: { user: User } }>(`${this.API_URL}/profile`, data);
  }

  getPreferences(): Observable<{ success: boolean; data: { preferences: UserPreferences } }> {
    return this.http.get<{ success: boolean; data: { preferences: UserPreferences } }>(`${this.API_URL}/preferences`);
  }

  updatePreferences(preferences: Partial<UserPreferences>): Observable<{ success: boolean; data: { preferences: UserPreferences } }> {
    return this.http.put<{ success: boolean; data: { preferences: UserPreferences } }>(`${this.API_URL}/preferences`, preferences);
  }
}
