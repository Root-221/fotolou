import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'fotolou-app-theme';
  readonly theme = signal<AppTheme>(this.readInitialTheme());

  constructor() {
    effect(() => {
      const activeTheme = this.theme();
      this.applyThemeToDOM(activeTheme);
      globalThis.localStorage?.setItem(this.storageKey, activeTheme);
    });
  }

  setTheme(newTheme: AppTheme): void {
    this.theme.set(newTheme);
  }

  private applyThemeToDOM(themeMode: AppTheme): void {
    let isDark = false;

    if (themeMode === 'dark') {
      isDark = true;
    } else if (themeMode === 'system') {
      isDark = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }

    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  private readInitialTheme(): AppTheme {
    const saved = globalThis.localStorage?.getItem(this.storageKey) as AppTheme | null;
    return saved || 'light';
  }
}
