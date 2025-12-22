import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'app-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _theme = signal<Theme>(this.getInitialTheme());
  theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      this.applyTheme(this.theme());
    });
  }

  private getInitialTheme(): Theme {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    return saved ?? 'light';
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(THEME_KEY, theme);
    this._theme.set(theme);
  }

  toggleTheme(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  private applyTheme(theme: Theme): void {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}
