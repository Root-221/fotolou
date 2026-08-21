import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { BannerCarousel } from '../../../shared/components/banner-carousel/banner-carousel';
import { ActionTile } from '../../../shared/components/action-tile/action-tile';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { SalonService } from '../../../shared/services/salon.service';
import { Salon } from '../../../shared/models/salon';

import { FavoritesService } from '../../../shared/services/favorites.service';

@Component({
  selector: 'app-salon-detail-page',
  imports: [
    ClientLayout,
    PageHeader,
    BannerCarousel,
    ActionTile,
    StatCard,
    StatusBadge,
    SkeletonLoaderComponent,
    ErrorStateComponent,
    RouterLink
  ],
  template: `
    <app-client-layout [bleedHeader]="true" [hasHeaderSlot]="true" activeNav="home">

      <!-- Header with back arrow only — transparent over banner -->
      <app-page-header
        slot="header"
        title=""
        backRoute="/client/home"
        [transparent]="true"
      />

      @if (loading()) {
        <div class="salon-detail-loading">
          <app-skeleton-loader type="card" [count]="3" />
        </div>
      } @else if (error() || !salon) {
        <div class="salon-detail-error">
          <app-error-state
            [message]="error() || 'Salon introuvable.'"
            (retry)="loadSalon()"
          />
        </div>
      } @else {
        <div class="salon-detail">
          <!-- Top Carousel Banner with Logo Overlay -->
          <app-banner-carousel
            [images]="salon.galleryImages || [salon.coverUrl]"
            [altText]="salon.name"
          />

          <div class="salon-detail__content">
            <!-- Title & Subtitle + Favorite Toggle -->
            <section class="salon-detail__header">
              <div class="salon-detail__header-title-row">
                <div>
                  <h1>{{ salon.name }}</h1>
                  <p>{{ salon.location }}</p>
                </div>
                <button
                  type="button"
                  class="salon-detail__fav-btn"
                  [class.salon-detail__fav-btn--active]="isFav()"
                  (click)="toggleFav()"
                  [attr.aria-label]="isFav() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                >
                  <svg viewBox="0 0 24 24" [attr.fill]="isFav() ? '#ef4444' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </section>

            <!-- Quick Action Tiles Grid -->
            <section class="salon-detail__actions">
              @for (action of salon.actions; track action.label) {
                <app-action-tile [action]="action" />
              }
            </section>

            <!-- Stat Cards Row -->
            <section class="salon-detail__stats">
              <app-stat-card label="PERSONNES EN ATTENTE">
                {{ salon.peopleWaiting }}
              </app-stat-card>

              <app-stat-card label="STATUT DU SALON">
                <app-status-badge [status]="salon.status" />
              </app-stat-card>
            </section>

            <!-- Primary CTA Button -->
            <section class="salon-detail__cta">
              <a [routerLink]="['/client/salons', salon.id, 'ticket']" class="salon-detail__btn">
                <span>Prendre mon ticket</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            </section>
          </div>
        </div>
      }
    </app-client-layout>
  `,
  styleUrl: './salon-detail-page.scss'
})
export class SalonDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly salonService = inject(SalonService);
  private readonly favoritesService = inject(FavoritesService);

  protected salon: Salon | null = null;
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected isFav(): boolean {
    return this.salon ? this.favoritesService.isFavorite(this.salon.id) : false;
  }

  protected toggleFav(): void {
    if (this.salon) {
      this.favoritesService.toggleFavorite(this.salon);
    }
  }

  ngOnInit(): void {
    this.loadSalon();
  }

  loadSalon(): void {
    this.loading.set(true);
    this.error.set(null);
    const salonId = this.route.snapshot.paramMap.get('id');

    this.salonService.getSalonById(salonId).subscribe({
      next: (data) => {
        this.salon = data;
        this.loading.set(false);
        if (!data) {
          this.error.set('Salon introuvable');
        }
      },
      error: (err) => {
        console.error('[SalonDetailPage] Error loading salon:', err);
        this.error.set('Impossible de charger les informations du salon.');
        this.loading.set(false);
      }
    });
  }
}
