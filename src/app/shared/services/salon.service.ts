import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Salon } from '../models/salon';
import { TicketOwner } from '../models/ticket-owner';
import { API_CONFIG } from '../../core/config/api.config';

export const DEFAULT_TICKET_OWNERS: readonly TicketOwner[] = [
  {
    id: 'self',
    type: 'self',
    name: 'Moi (Awa Diop)',
    subtitle: '+221 70 123 45 67',
    avatarInitials: 'A'
  },
  {
    id: 'maman',
    type: 'relative',
    name: 'Maman',
    subtitle: 'Famille'
  },
  {
    id: 'custom',
    type: 'custom',
    name: 'Autre personne',
    subtitle: 'Saisir un nouveau nom',
    isCustomInput: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class SalonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;

  // ── State Signals ───────────────────────────────────────────
  readonly salons = signal<readonly Salon[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly searchQuery = signal<string>('');
  readonly currentLocation = signal<string>('Dakar, Sénégal');
  readonly selectedOwner = signal<TicketOwner>(DEFAULT_TICKET_OWNERS[0]);
  readonly customOwnerName = signal<string>('');

  // ── Filtered Salons Computed ────────────────────────────────
  readonly filteredSalons = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.salons();
    if (!query) {
      return list;
    }
    return list.filter(
      (salon) =>
        salon.name.toLowerCase().includes(query) ||
        salon.location.toLowerCase().includes(query) ||
        salon.district.toLowerCase().includes(query)
    );
  });

  constructor() {
    this.loadSalons();
  }

  loadSalons(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Salon[]>(`${this.baseUrl}${API_CONFIG.endpoints.salons}`).pipe(
      tap((data) => {
        this.salons.set(data);
        this.loading.set(false);
      }),
      catchError((err) => {
        console.error('[SalonService] Error fetching salons:', err);
        this.error.set('Impossible de charger les salons de coiffure.');
        this.loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  getSalonById(id: string | null): Observable<Salon | null> {
    if (!id) return of(null);
    return this.http.get<Salon>(`${this.baseUrl}${API_CONFIG.endpoints.salons}/${id}`).pipe(
      catchError((err) => {
        console.error(`[SalonService] Error fetching salon ${id}:`, err);
        return of(this.salons().find((s) => s.id === id) || null);
      })
    );
  }

  getTicketOwners(): readonly TicketOwner[] {
    return DEFAULT_TICKET_OWNERS;
  }

  selectOwner(owner: TicketOwner): void {
    this.selectedOwner.set(owner);
  }

  setCustomOwnerName(name: string): void {
    this.customOwnerName.set(name);
  }
}
