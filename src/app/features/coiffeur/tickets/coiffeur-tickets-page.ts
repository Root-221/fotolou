import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { LocationHeader } from '../../../shared/components/location-header/location-header';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { TicketService } from '../../../shared/services/ticket.service';
import { SalonService } from '../../../shared/services/salon.service';
import { Ticket, TicketStatus } from '../../../shared/models/ticket';

@Component({
  selector: 'app-coiffeur-tickets-page',
  imports: [
    ClientLayout,
    LocationHeader,
    EmptyStateComponent
  ],
  template: `
    <app-client-layout activeNav="tickets" role="coiffeur" [hasHeaderSlot]="true">
      <!-- Fixed Header Slot -->
      <app-location-header
        slot="header"
        [showLocation]="false"
        [hasNotification]="notificationService.coiffeurUnreadCount() > 0"
        (notificationClick)="goToNotifications()"
      />

      <!-- Content -->
      <div class="coiffeur-tickets">
        <!-- Tab Selector -->
        <div class="coiffeur-tickets__tabs" role="tablist">
          <button
            type="button"
            class="coiffeur-tickets__tab"
            [class.coiffeur-tickets__tab--active]="activeTab() === 'active'"
            (click)="activeTab.set('active')"
            role="tab"
          >
            File en direct ({{ activeCount() }})
          </button>
          <button
            type="button"
            class="coiffeur-tickets__tab"
            [class.coiffeur-tickets__tab--active]="activeTab() === 'history'"
            (click)="activeTab.set('history')"
            role="tab"
          >
            Historique ({{ historyCount() }})
          </button>
        </div>

        <!-- Section Title & Actions -->
        <div class="coiffeur-tickets__section-header">
          <h1 class="coiffeur-tickets__title">
            {{ activeTab() === 'active' ? 'Clients dans la file' : 'Historique des passages' }}
          </h1>

          @if (activeTab() === 'active') {
            <button type="button" class="coiffeur-tickets__add-btn" (click)="showAddModal.set(true)">
              + Ajouter un client
            </button>
          }
        </div>

        <!-- Live Queue List -->
        <div class="coiffeur-tickets__list">
          @for (item of displayedTickets(); track item.id) {
            <div class="queue-card">
              <div class="queue-card__top">
                <!-- Position Box -->
                <div class="queue-card__pos-box">
                  #{{ item.ticketNumber }}
                </div>

                <!-- Client Info -->
                <div class="queue-card__info">
                  <strong class="queue-card__name">{{ item.ownerName }}</strong>
                  <span class="queue-card__phone">{{ item.salonName }} &bull; Dakar</span>
                </div>

                <!-- Status Tag -->
                <span
                  class="queue-card__status-tag"
                  [class.queue-card__status-tag--current]="item.status === 'your_turn'"
                  [class.queue-card__status-tag--waiting]="item.status === 'waiting'"
                  [class.queue-card__status-tag--served]="item.status === 'served' || item.status === 'completed'"
                  [class.queue-card__status-tag--cancelled]="item.status === 'cancelled'"
                >
                  {{ getStatusText(item.status) }}
                </span>
              </div>

              <!-- Action Buttons Row (Active tab only) -->
              @if (activeTab() === 'active') {
                <div class="queue-card__actions">
                  <button
                    type="button"
                    class="queue-card__btn queue-card__btn--skip"
                    (click)="skipClient(item.id)"
                  >
                    Sauter / Annuler
                  </button>

                  <button
                    type="button"
                    class="queue-card__btn queue-card__btn--served"
                    (click)="markServed(item.id)"
                  >
                    Marquer Servi
                  </button>
                </div>
              }
            </div>
          } @empty {
            <app-empty-state
              icon="ticket"
              [title]="activeTab() === 'active' ? 'File d\\'attente vide' : 'Aucun historique'"
              [description]="activeTab() === 'active' ? 'Aucun client n\\'est en attente pour le moment.' : 'L\\'historique des tickets servis apparaîtra ici.'"
            />
          }
        </div>
      </div>
    </app-client-layout>

    <!-- Quick Add Walk-in Modal -->
    @if (showAddModal()) {
      <div class="walkin-modal-backdrop" (click)="showAddModal.set(false)">
        <div class="walkin-modal" (click)="$event.stopPropagation()">
          <h2 class="walkin-modal__title">Ajouter un client direct</h2>

          <div class="walkin-modal__field">
            <label>Nom du client *</label>
            <input type="text" #nameInput placeholder="Ex: Ousmane Sow" autofocus />
          </div>

          <div class="walkin-modal__field">
            <label>Salon</label>
            <input type="text" value="King Barber (Mermoz)" readonly disabled />
          </div>

          <div class="walkin-modal__actions">
            <button type="button" class="walkin-modal__cancel-btn" (click)="showAddModal.set(false)">
              Annuler
            </button>
            <button
              type="button"
              class="walkin-modal__submit-btn"
              (click)="addWalkInClient(nameInput.value)"
            >
              Valider l'ajout
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './coiffeur-tickets-page.scss'
})
export class CoiffeurTicketsPage {
  private readonly router = inject(Router);
  protected readonly ticketService = inject(TicketService);
  protected readonly salonService = inject(SalonService);
  protected readonly notificationService = inject(NotificationService);

  protected readonly activeTab = signal<'active' | 'history'>('active');
  protected readonly showAddModal = signal(false);

  protected readonly allTickets = computed(() => this.ticketService.tickets());

  protected readonly activeCount = computed(() =>
    this.allTickets().filter((t) => t.category === 'active').length
  );

  protected readonly historyCount = computed(() =>
    this.allTickets().filter((t) => t.category === 'history').length
  );

  protected readonly displayedTickets = computed(() => {
    const tab = this.activeTab();
    return this.allTickets().filter((t) => t.category === tab);
  });

  protected getStatusText(status: TicketStatus): string {
    switch (status) {
      case 'your_turn':
        return 'En cours / En tête';
      case 'waiting':
        return 'En Attente';
      case 'served':
      case 'completed':
        return 'SERVI';
      case 'cancelled':
        return 'ANNULÉ';
      default:
        return 'En Attente';
    }
  }

  protected skipClient(id: string): void {
    this.ticketService.cancelTicket(id).subscribe();
  }

  protected markServed(id: string): void {
    this.ticketService.serveTicket(id).subscribe();
  }

  protected addWalkInClient(name: string): void {
    if (!name.trim()) return;
    this.ticketService.createTicket('king-barber', 'King Barber', name.trim()).subscribe(() => {
      this.showAddModal.set(false);
    });
  }

  protected goToNotifications(): void {
    this.router.navigate(['/coiffeur/notifications']);
  }
}
