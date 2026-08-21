import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Salon } from '../models/salon';
import { SalonService } from './salon.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly salonService = inject(SalonService);
  private readonly STORAGE_KEY = 'fotolou_favorite_salons';

  // ── Reactive Signals ─────────────────────────────────────────
  readonly favoriteIds = signal<string[]>([]);

  readonly count = computed(() => this.favoriteIds().length);
  readonly hasFavorites = computed(() => this.favoriteIds().length > 0);

  // Computes the full Salon objects for all favorited IDs
  readonly favoriteSalons = computed<Salon[]>(() => {
    const ids = new Set(this.favoriteIds());
    const all = this.salonService.salons();
    return all.filter((s) => ids.has(s.id));
  });

  constructor() {
    this.loadFavoritesFromStorage();
  }

  private loadFavoritesFromStorage(): void {
    if (!this.isBrowser) return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.favoriteIds.set(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('[FavoritesService] Failed to load favorites from localStorage', e);
    }

    // Default mock favorites if none exist for nice initial discovery
    this.favoriteIds.set(['king-barber', 'king-barber-2']);
    this.saveFavoritesToStorage();
  }

  private saveFavoritesToStorage(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favoriteIds()));
    } catch (e) {
      console.warn('[FavoritesService] Failed to save favorites to localStorage', e);
    }
  }

  isFavorite(salonId: string): boolean {
    return this.favoriteIds().includes(salonId);
  }

  toggleFavorite(salon: Salon): boolean {
    const current = this.favoriteIds();
    const exists = current.includes(salon.id);
    let updated: string[];

    if (exists) {
      updated = current.filter((id) => id !== salon.id);
    } else {
      updated = [salon.id, ...current];
    }

    this.favoriteIds.set(updated);
    this.saveFavoritesToStorage();
    return !exists;
  }

  addFavorite(salonId: string): void {
    if (!this.favoriteIds().includes(salonId)) {
      this.favoriteIds.update((prev) => [salonId, ...prev]);
      this.saveFavoritesToStorage();
    }
  }

  removeFavorite(salonId: string): void {
    this.favoriteIds.update((prev) => prev.filter((id) => id !== salonId));
    this.saveFavoritesToStorage();
  }

  clearAll(): void {
    this.favoriteIds.set([]);
    this.saveFavoritesToStorage();
  }
}
