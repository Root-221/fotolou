import { computed, Injectable, signal } from '@angular/core';

export type UserRole = 'client' | 'coiffeur';
export type AuthProvider = 'phone' | 'google' | 'apple';
export type SocialProvider = Exclude<AuthProvider, 'phone'>;

export interface SimulatedUser {
  readonly role: UserRole;
  readonly label: string;
  readonly name: string;
  readonly phone: string;
  readonly homeRoute: string;
}

const SIMULATED_USERS: Record<UserRole, SimulatedUser> = {
  client: {
    role: 'client',
    label: 'Client',
    name: 'Awa Diop',
    phone: '+221 70 123 45 67',
    homeRoute: '/client/home'
  },
  coiffeur: {
    role: 'coiffeur',
    label: 'Coiffeur',
    name: 'Mamadou Fall',
    phone: '+221 77 456 78 90',
    homeRoute: '/coiffeur/home'
  }
};

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly storageKey = 'fotolou-active-role';
  private readonly activeRoleSignal = signal<UserRole>(this.readStoredRole());
  private readonly pendingPhoneSignal = signal<string>(SIMULATED_USERS[this.activeRoleSignal()].phone);
  private readonly providerSignal = signal<AuthProvider>('phone');

  readonly users = Object.values(SIMULATED_USERS);
  readonly activeRole = this.activeRoleSignal.asReadonly();
  readonly pendingPhone = this.pendingPhoneSignal.asReadonly();
  readonly provider = this.providerSignal.asReadonly();
  readonly activeUser = computed(() => SIMULATED_USERS[this.activeRoleSignal()]);

  selectRole(role: UserRole): void {
    this.activeRoleSignal.set(role);
    this.pendingPhoneSignal.set(SIMULATED_USERS[role].phone);
  }

  resolveRole(value: string | null): UserRole {
    return value === 'coiffeur' ? 'coiffeur' : 'client';
  }

  startPhoneLogin(rawPhone: string): void {
    const formattedPhone = this.formatPhone(rawPhone);

    this.providerSignal.set('phone');
    this.pendingPhoneSignal.set(formattedPhone || this.activeUser().phone);
  }

  completeSocialLogin(provider: SocialProvider): SimulatedUser {
    this.providerSignal.set(provider);
    this.pendingPhoneSignal.set(this.activeUser().phone);
    this.persistActiveRole();

    return this.activeUser();
  }

  verifyOtp(code: string): boolean {
    const isValidCode = code === '123456';

    if (isValidCode) {
      this.persistActiveRole();
    }

    return isValidCode;
  }

  getHomeRoute(role: UserRole = this.activeRoleSignal()): string {
    return SIMULATED_USERS[role].homeRoute;
  }

  private formatPhone(rawPhone: string): string {
    const localDigits = rawPhone.replace(/\D/g, '').replace(/^221/, '').slice(0, 9);

    if (localDigits.length !== 9) {
      return '';
    }

    return `+221 ${localDigits.slice(0, 2)} ${localDigits.slice(2, 5)} ${localDigits.slice(
      5,
      7
    )} ${localDigits.slice(7)}`;
  }

  private persistActiveRole(): void {
    globalThis.localStorage?.setItem(this.storageKey, this.activeRoleSignal());
  }

  private readStoredRole(): UserRole {
    const storedRole = globalThis.localStorage?.getItem(this.storageKey);

    return storedRole === 'coiffeur' ? 'coiffeur' : 'client';
  }
}
