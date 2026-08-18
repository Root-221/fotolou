import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { BannerCarousel } from '../../../shared/components/banner-carousel/banner-carousel';
import { ActionTile } from '../../../shared/components/action-tile/action-tile';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { SalonService } from '../../../shared/services/salon.service';
import { Salon } from '../../../shared/models/salon';

@Component({
  selector: 'app-salon-detail-page',
  imports: [
    ClientLayout,
    PageHeader,
    BannerCarousel,
    ActionTile,
    StatCard,
    StatusBadge,
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

      <div class="salon-detail">
        <!-- Top Carousel Banner with Logo Overlay -->
        <app-banner-carousel
          [images]="salon.galleryImages || [salon.coverUrl]"
          [altText]="salon.name"
        />

        <div class="salon-detail__content">
          <!-- Title & Subtitle -->
          <section class="salon-detail__header">
            <h1>{{ salon.name }}</h1>
            <p>{{ salon.location }}</p>
          </section>

          <!-- Quick Action Tiles Grid -->
          <section class="salon-detail__actions">
            @for (action of salon.actions; track action.label) {
              <app-action-tile [action]="action" />
            }
          </section>

          <!-- Stat Cards Row -->
          <section class="salon-detail__stats">
            <app-stat-card label="PERSONNES">
              {{ salon.peopleWaiting }}
            </app-stat-card>

            <app-stat-card label="STATUT">
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
    </app-client-layout>
  `,
  styleUrl: './salon-detail-page.scss'
})
export class SalonDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly salonService = inject(SalonService);

  protected salon!: Salon;

  ngOnInit(): void {
    const salonId = this.route.snapshot.paramMap.get('id');
    this.salon = this.salonService.getSalonById(salonId);
  }
}
