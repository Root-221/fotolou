import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { LocationHeader } from '../../../shared/components/location-header/location-header';
import { TicketService } from '../../../shared/services/ticket.service';
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

      <!-- Content Body -->
      <div class="coiffeur-home">
        <!-- Hero Card -->
        <section class="coiffeur-hero">
          <div class="coiffeur-hero__overlay"></div>

          <div class="coiffeur-hero__content">
            <span class="coiffeur-hero__label">CLIENTS EN ATTENTE</span>
            <div class="coiffeur-hero__main-row">
              <span class="coiffeur-hero__count">{{ ticketService.activeCount() }}</span>

              <div class="coiffeur-hero__right">
                <span class="coiffeur-hero__trend">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  File active
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
            <span class="coiffeur-stat-card__label">EN ATTENTE</span>
            <span class="coiffeur-stat-card__val">{{ ticketService.activeCount() }}</span>
            <div class="coiffeur-stat-card__bar-track">
              <div class="coiffeur-stat-card__bar-fill coiffeur-stat-card__bar-fill--current" [style.width.%]="ticketService.activeCount() * 20"></div>
            </div>
          </div>

          <div class="coiffeur-stat-card">
            <span class="coiffeur-stat-card__label">SERVIS</span>
            <span class="coiffeur-stat-card__val">{{ ticketService.historyCount() }}</span>
            <div class="coiffeur-stat-card__bar-track">
              <div class="coiffeur-stat-card__bar-fill coiffeur-stat-card__bar-fill--served" [style.width.%]="ticketService.historyCount() * 20"></div>
            </div>
          </div>
        </section>

        <!-- Recent Activity Section -->
        <section class="coiffeur-activity">
          <h2 class="coiffeur-activity__title">Activité récente du salon</h2>

          <div class="coiffeur-activity__list">
            @for (item of recentActivities(); track item.id) {
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
  protected readonly ticketService = inject(TicketService);
  protected readonly notificationService = inject(NotificationService);

  protected readonly isQueueOpen = signal(true);

  private readonly avatarColors = ['#eef2ff', '#fee2e2', '#fef3c7', '#f1f5f9', '#e0e7ff'];

  protected readonly recentActivities = computed<RecentActivity[]>(() => {
    const historyTickets = this.ticketService.tickets().filter((t) => t.category === 'history');
    if (historyTickets.length > 0) {
      return historyTickets.slice(0, 5).map((t, idx) => ({
        id: t.id,
        initial: (t.ownerName || 'C').charAt(0).toUpperCase(),
        name: t.ownerName || 'Client',
        date: t.servedAt || t.createdAt || 'Aujourd\'hui',
        status: (t.status === 'served' || t.status === 'completed' ? 'SERVI' : 'ANNULÉ') as 'SERVI' | 'ANNULÉ',
        avatarBg: this.avatarColors[idx % this.avatarColors.length]
      }));
    }

    return [
      {
        id: 'act-1',
        initial: 'K',
        name: 'Karim Fall',
        date: 'Aujourd\'hui, 13h15',
        status: 'SERVI',
        avatarBg: '#eef2ff'
      },
      {
        id: 'act-2',
        initial: 'S',
        name: 'Saliou Ndiaye',
        date: 'Hier, 16h40',
        status: 'ANNULÉ',
        avatarBg: '#fee2e2'
      }
    ];
  });

  protected toggleQueue(): void {
    this.isQueueOpen.update((v) => !v);
  }

  protected goToNotifications(): void {
    this.router.navigate(['/coiffeur/notifications']);
  }
}
