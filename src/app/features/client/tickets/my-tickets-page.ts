import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { LocationHeader } from '../../../shared/components/location-header/location-header';
import { TicketCard } from '../../../shared/components/ticket-card/ticket-card';
import { TicketService } from '../../../shared/services/ticket.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TicketTab } from '../../../shared/models/ticket';

@Component({
  selector: 'app-my-tickets-page',
  imports: [
    ClientLayout,
    LocationHeader,
    TicketCard
  ],
  template: `
    <app-client-layout activeNav="tickets">
      <!-- Header Slot with notification icon only (Location hidden) -->
      <app-location-header
        slot="header"
        [showLocation]="false"
        [hasNotification]="notificationService.unreadCount() > 0"
        (notificationClick)="goToNotifications()"
      />

      <!-- Scrollable Content Body -->
      <div class="my-tickets-page__content">
        <!-- Segmented Tab Selector -->
        <div class="my-tickets-page__tabs">
          <button
            type="button"
            class="my-tickets-page__tab"
            [class.my-tickets-page__tab--active]="activeTab() === 'active'"
            (click)="selectTab('active')"
          >
            Actuel ({{ ticketService.activeCount() }})
          </button>
          <button
            type="button"
            class="my-tickets-page__tab"
            [class.my-tickets-page__tab--active]="activeTab() === 'history'"
            (click)="selectTab('history')"
          >
            Historiques ({{ ticketService.historyCount() }})
          </button>
        </div>

        <!-- Ticket Cards List -->
        <div class="my-tickets-page__list">
          @for (ticket of ticketService.displayedTickets(); track ticket.id) {
            <app-ticket-card [ticket]="ticket" />
          } @empty {
            <div class="my-tickets-page__empty">
              <p>Aucun ticket dans cette section.</p>
            </div>
          }
        </div>
      </div>
    </app-client-layout>
  `,
  styleUrl: './my-tickets-page.scss'
})
export class MyTicketsPage {
  private readonly router = inject(Router);
  protected readonly ticketService = inject(TicketService);
  protected readonly notificationService = inject(NotificationService);
  protected readonly activeTab = this.ticketService.activeTab;

  protected selectTab(tab: TicketTab): void {
    this.ticketService.activeTab.set(tab);
  }

  protected goToNotifications(): void {
    this.router.navigate(['/client/notifications']);
  }
}
