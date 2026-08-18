import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { LocationHeader } from '../../../shared/components/location-header/location-header';
import { NotificationService } from '../../../shared/services/notification.service';

interface RecentActivity {
  readonly id: string;
  readonly initial: string;
  readonly name: string;
  readonly date: string;
  readonly status: 'SERVI' | 'ANNULÉ';
  readonly avatarBg: string;
}

@Component({
  selector: 'app-coiffeur-home-page',
  imports: [
    ClientLayout,
    LocationHeader
  ],
  template: `
    <app-client-layout activeNav="home" role="coiffeur" [hasHeaderSlot]="true">
      <!-- Fixed Header Slot -->
      <app-location-header
        slot="header"
        [showLocation]="false"
        [hasNotification]="notificationService.coiffeurUnreadCount() > 0"
        (notificationClick)="goToNotifications()"
      />

      <!-- Scrollable Main Content Body -->
      <div class="coiffeur-home">
        <!-- Hero Card (Screenshot 1) -->
        <section class="coiffeur-hero">
          <div class="coiffeur-hero__overlay"></div>

          <div class="coiffeur-hero__content">
            <span class="coiffeur-hero__label">CLIENTS EN ATTENTE</span>
            <div class="coiffeur-hero__main-row">
              <span class="coiffeur-hero__count">12</span>

              <div class="coiffeur-hero__right">
                <span class="coiffeur-hero__trend">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  +18% vs hier
                </span>

                <!-- Toggle Switch -->
                <button
                  type="button"
                  class="coiffeur-toggle"
                  [class.coiffeur-toggle--active]="isQueueOpen()"
                  (click)="toggleQueue()"
                  [attr.aria-label]="isQueueOpen() ? 'Fermer la file' : 'Ouvrir la file'"
                >
                  <span class="coiffeur-toggle__thumb"></span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Stats Row Cards -->
        <section class="coiffeur-stats">
          <div class="coiffeur-stat-card">
            <span class="coiffeur-stat-card__label">EN COURS</span>
            <span class="coiffeur-stat-card__val">5</span>
            <div class="coiffeur-stat-card__bar-track">
              <div class="coiffeur-stat-card__bar-fill coiffeur-stat-card__bar-fill--current" style="width: 40%;"></div>
            </div>
          </div>

          <div class="coiffeur-stat-card">
            <span class="coiffeur-stat-card__label">SERVIS</span>
            <span class="coiffeur-stat-card__val">25</span>
            <div class="coiffeur-stat-card__bar-track">
              <div class="coiffeur-stat-card__bar-fill coiffeur-stat-card__bar-fill--served" style="width: 80%;"></div>
            </div>
          </div>
        </section>

        <!-- Recent Activity Section -->
        <section class="coiffeur-activity">
          <h2 class="coiffeur-activity__title">Activité récente</h2>

          <div class="coiffeur-activity__list">
            @for (item of recentActivities; track item.id) {
              <div class="activity-card">
                <div class="activity-card__avatar" [style.background]="item.avatarBg">
                  {{ item.initial }}
                </div>

                <div class="activity-card__info">
                  <strong class="activity-card__name">{{ item.name }}</strong>
                  <span class="activity-card__date">{{ item.date }}</span>
                </div>

                <span
                  class="activity-card__badge"
                  [class.activity-card__badge--served]="item.status === 'SERVI'"
                  [class.activity-card__badge--cancelled]="item.status === 'ANNULÉ'"
                >
                  {{ item.status }}
                </span>
              </div>
            }
          </div>
        </section>
      </div>
    </app-client-layout>
  `,
  styleUrl: './coiffeur-home-page.scss'
})
export class CoiffeurHomePage {
  private readonly router = inject(Router);
  protected readonly notificationService = inject(NotificationService);

  protected readonly isQueueOpen = signal(true);

  protected readonly recentActivities: readonly RecentActivity[] = [
    {
      id: 'act-1',
      initial: 'K',
      name: 'Karim Fall',
      date: 'Hier, 14h36',
      status: 'SERVI',
      avatarBg: '#fef3c7'
    },
    {
      id: 'act-2',
      initial: 'S',
      name: 'Saliou',
      date: '11 Oct, 16h14',
      status: 'ANNULÉ',
      avatarBg: '#e0e7ff'
    }
  ];

  protected toggleQueue(): void {
    this.isQueueOpen.update((v) => !v);
  }

  protected goToNotifications(): void {
    this.router.navigate(['/coiffeur/notifications']);
  }
}
