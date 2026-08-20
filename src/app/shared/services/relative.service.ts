import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { Relative, RelativeRelation, RELATION_LABELS } from '../models/relative';
import { API_CONFIG } from '../../core/config/api.config';

@Injectable({ providedIn: 'root' })
export class RelativeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;

  readonly relatives = signal<readonly Relative[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadRelatives();
  }

  getRelativeLabel(relation: RelativeRelation): string {
    return RELATION_LABELS[relation];
  }

  loadRelatives(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Relative[]>(`${this.baseUrl}${API_CONFIG.endpoints.relatives}`).pipe(
      tap((data) => {
        this.relatives.set(data);
        this.loading.set(false);
      }),
      catchError((err) => {
        console.error('[RelativeService] Error loading relatives:', err);
        this.error.set('Impossible de charger vos proches.');
        this.loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  getRelativeById(id: string | null): Observable<Relative | null> {
    if (!id) return of(null);
    return this.http.get<Relative>(`${this.baseUrl}${API_CONFIG.endpoints.relatives}/${id}`).pipe(
      catchError((err) => {
        console.error(`[RelativeService] Error loading relative ${id}:`, err);
        return of(this.relatives().find((r) => r.id === id) || null);
      })
    );
  }

  addRelative(name: string, relation: RelativeRelation, phone?: string): Observable<Relative> {
    const newRelative: Relative = {
      id: `r-${Date.now()}`,
      name: name.trim(),
      relation,
      phone: phone?.trim() || undefined
    };

    this.relatives.update((prev) => [...prev, newRelative]);

    return this.http.post<Relative>(`${this.baseUrl}${API_CONFIG.endpoints.relatives}`, newRelative).pipe(
      tap((saved) => {
        this.relatives.update((prev) =>
          prev.map((r) => (r.id === newRelative.id ? saved : r))
        );
      }),
      catchError((err) => {
        console.warn('[RelativeService] API post failed, keeping local relative:', err);
        return of(newRelative);
      })
    );
  }

  updateRelative(id: string, name: string, relation: RelativeRelation, phone?: string): Observable<Relative | null> {
    const updated: Relative = {
      id,
      name: name.trim(),
      relation,
      phone: phone?.trim() || undefined
    };

    this.relatives.update((prev) =>
      prev.map((r) => (r.id === id ? updated : r))
    );

    return this.http.put<Relative>(`${this.baseUrl}${API_CONFIG.endpoints.relatives}/${id}`, updated).pipe(
      catchError((err) => {
        console.warn(`[RelativeService] API put failed for ${id}:`, err);
        return of(updated);
      })
    );
  }

  removeRelative(id: string): Observable<boolean> {
    this.relatives.update((prev) => prev.filter((r) => r.id !== id));

    return this.http.delete(`${this.baseUrl}${API_CONFIG.endpoints.relatives}/${id}`).pipe(
      map(() => true),
      catchError((err) => {
        console.warn(`[RelativeService] API delete failed for ${id}:`, err);
        return of(true);
      })
    );
  }
}
