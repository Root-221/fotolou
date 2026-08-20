import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { AppNotification } from '../models/notification';
import { API_CONFIG } from '../../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;

  readonly notifications = signal<readonly AppNotification[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly clientNotifications = computed(() =>
    this.notifications().filter((n) => n.recipientRole === 'client')
  );

  readonly coiffeurNotifications = computed(() =>
    this.notifications().filter((n) => n.recipientRole === 'coiffeur')
  );

  readonly clientUnreadCount = computed(() =>
    this.clientNotifications().filter((n) => !n.isRead).length
  );

  readonly coiffeurUnreadCount = computed(() =>
    this.coiffeurNotifications().filter((n) => !n.isRead).length
  );

  readonly unreadCount = computed(() => this.clientUnreadCount());

  constructor() {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<AppNotification[]>(`${this.baseUrl}${API_CONFIG.endpoints.notifications}`).pipe(
      tap((data) => {
        this.notifications.set(data);
        this.loading.set(false);
      }),
      catchError((err) => {
        console.error('[NotificationService] Error loading notifications:', err);
        this.error.set('Impossible de charger les notifications.');
        this.loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  markAsRead(id: string): Observable<AppNotification | null> {
    this.notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    return this.http.patch<AppNotification>(`${this.baseUrl}${API_CONFIG.endpoints.notifications}/${id}`, {
      isRead: true
    }).pipe(
      catchError((err) => {
        console.warn(`[NotificationService] API patch failed for ${id}:`, err);
        return of(null);
      })
    );
  }

  markAllAsRead(role: 'client' | 'coiffeur' = 'client'): void {
    this.notifications.update((list) =>
      list.map((n) => (n.recipientRole === role ? { ...n, isRead: true } : n))
    );
  }

  markAllAsReadByRole(role: 'client' | 'coiffeur'): void {
    this.markAllAsRead(role);
  }

  deleteNotification(id: string): Observable<boolean> {
    this.notifications.update((list) => list.filter((n) => n.id !== id));

    return this.http.delete(`${this.baseUrl}${API_CONFIG.endpoints.notifications}/${id}`).pipe(
      map(() => true),
      catchError((err) => {
        console.warn(`[NotificationService] API delete failed for ${id}:`, err);
        return of(true);
      })
    );
  }
}
