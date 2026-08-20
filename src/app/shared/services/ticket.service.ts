import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { Ticket, TicketTab } from '../models/ticket';
import { API_CONFIG } from '../../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;

  // ── State Signals ───────────────────────────────────────────
  readonly activeTab = signal<TicketTab>('active');
  readonly tickets = signal<readonly Ticket[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // ── Computed Lists ──────────────────────────────────────────
  readonly displayedTickets = computed(() => {
    const tab = this.activeTab();
    return this.tickets().filter((ticket) => ticket.category === tab);
  });

  readonly activeCount = computed(() =>
    this.tickets().filter((t) => t.category === 'active').length
  );

  readonly historyCount = computed(() =>
    this.tickets().filter((t) => t.category === 'history').length
  );

  constructor() {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Ticket[]>(`${this.baseUrl}${API_CONFIG.endpoints.tickets}`).pipe(
      tap((data) => {
        this.tickets.set(data);
        this.loading.set(false);
      }),
      catchError((err) => {
        console.error('[TicketService] Error fetching tickets:', err);
        this.error.set('Impossible de charger vos tickets.');
        this.loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  getTicketById(id: string | null): Observable<Ticket | null> {
    if (!id) return of(null);
    return this.http.get<Ticket>(`${this.baseUrl}${API_CONFIG.endpoints.tickets}/${id}`).pipe(
      catchError((err) => {
        console.error(`[TicketService] Error fetching ticket ${id}:`, err);
        return of(this.tickets().find((t) => t.id === id) || null);
      })
    );
  }

  createTicket(salonId: string, salonName: string, ownerName: string): Observable<Ticket> {
    const activeCount = this.tickets().filter((t) => t.category === 'active').length;
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      salonId,
      salonName,
      ownerName,
      ticketNumber: activeCount + 1,
      status: 'your_turn',
      category: 'active',
      createdAt: new Date().toISOString()
    };

    // Optimistic UI update
    this.tickets.update((prev) => [newTicket, ...prev]);
    this.activeTab.set('active');

    return this.http.post<Ticket>(`${this.baseUrl}${API_CONFIG.endpoints.tickets}`, newTicket).pipe(
      tap((savedTicket) => {
        this.tickets.update((prev) =>
          prev.map((t) => (t.id === newTicket.id ? savedTicket : t))
        );
      }),
      catchError((err) => {
        console.warn('[TicketService] API post failed, keeping local ticket:', err);
        return of(newTicket);
      })
    );
  }

  cancelTicket(id: string): Observable<Ticket | null> {
    const now = new Date().toISOString();
    this.tickets.update((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status: 'cancelled', category: 'history', servedAt: now }
          : ticket
      )
    );

    return this.http.patch<Ticket>(`${this.baseUrl}${API_CONFIG.endpoints.tickets}/${id}`, {
      status: 'cancelled',
      category: 'history',
      servedAt: now
    }).pipe(
      catchError((err) => {
        console.warn(`[TicketService] Failed to patch cancel ticket ${id}:`, err);
        return of(null);
      })
    );
  }

  serveTicket(id: string): Observable<Ticket | null> {
    const now = new Date().toISOString();
    this.tickets.update((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status: 'served', category: 'history', servedAt: now }
          : ticket
      )
    );

    return this.http.patch<Ticket>(`${this.baseUrl}${API_CONFIG.endpoints.tickets}/${id}`, {
      status: 'served',
      category: 'history',
      servedAt: now
    }).pipe(
      catchError((err) => {
        console.warn(`[TicketService] Failed to patch serve ticket ${id}:`, err);
        return of(null);
      })
    );
  }
}
