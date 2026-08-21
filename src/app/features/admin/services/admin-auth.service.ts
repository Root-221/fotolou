import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'manager';
  avatar?: string;
}

const ADMIN_STORAGE_KEY = 'fotolou_admin_session';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly currentAdmin = signal<AdminUser | null>(this.loadSession());
  readonly isAuthenticated = computed(() => this.currentAdmin() !== null);

  private loadSession(): AdminUser | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  login(email: string, pass: string): { success: boolean; message?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Default administrator credentials
    if (
      (cleanEmail === 'admin@fotolou.sn' || cleanEmail === 'admin') &&
      (cleanPass === 'fotolou2026' || cleanPass === 'admin' || cleanPass === 'password')
    ) {
      const user: AdminUser = {
        id: 'admin-01',
        name: 'Direction Fotolou',
        email: 'admin@fotolou.sn',
        role: 'super_admin'
      };

      this.currentAdmin.set(user);
      if (this.isBrowser) {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
      }
      return { success: true };
    }

    return {
      success: false,
      message: 'Identifiants invalides. Utilisez admin@fotolou.sn / fotolou2026'
    };
  }

  logout(): void {
    this.currentAdmin.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    this.router.navigate(['/admin/login']);
  }
}

export const adminAuthGuard: CanActivateFn = () => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};
