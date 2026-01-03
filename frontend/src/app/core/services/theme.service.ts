import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'custom';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app_theme';
  private currentThemeSubject = new BehaviorSubject<Theme>(this.getStoredTheme());
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {}

  loadTheme(): void {
    const theme = this.getStoredTheme();
    this.applyTheme(theme);
  }

  setTheme(theme: Theme): void {
    this.applyTheme(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.currentThemeSubject.next(theme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  private applyTheme(theme: Theme): void {
    document.body.setAttribute('data-theme', theme);
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_KEY);
    return (stored as Theme) || 'light';
  }
}
