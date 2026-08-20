import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { LocationHeader } from '../../../shared/components/location-header/location-header';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { NotificationService } from '../../../shared/services/notification.service';

export interface QueueItem {
  id: string;
  position: string;
  clientName: string;
  phone: string;
  status: 'en_cours' | 'en_attente' | 'servi' | 'annule';
  category: 'active' | 'history';
  time?: string;
}

const INITIAL_QUEUE: QueueItem[] = [
  {
    id: 'q-1',
    position: '01',
    clientName: 'Amadou Koulibaly',
    phone: '+221 77 862 70 52',
    status: 'en_cours',
    category: 'active'
  },
  {
    id: 'q-2',
    position: '02',
    clientName: 'Fallou Gaye',
    phone: '+221 77 111 11 11',
    status: 'en_attente',
    category: 'active'
  },
  {
    id: 'q-3',
    position: '03',
    clientName: 'Amy Diop',
    phone: '+221 77 111 11 11',
    status: 'en_attente',
    category: 'active'
  },
  {
    id: 'q-4',
    position: '00',
    clientName: 'Karim Fall',
    phone: '+221 77 999 88 77',
    status: 'servi',
    category: 'history',
    time: 'Hier, 14h36'
  },
  {
    id: 'q-5',
    position: '00',
    clientName: 'Saliou Ndiaye',
    phone: '+221 77 444 33 22',
    status: 'annule',
    category: 'history',
    time: '11 Oct, 16h14'
  }
];

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

        <!-- Section Title & Filter -->
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
          @for (item of displayedQueue(); track item.id) {
            <div class="queue-card">
              <div class="queue-card__top">
                <!-- Position Box -->
                <div class="queue-card__pos-box">
                  {{ item.position }}
                </div>

                <!-- Client Info -->
                <div class="queue-card__info">
                  <strong class="queue-card__name">{{ item.clientName }}</strong>
                  <span class="queue-card__phone">{{ item.phone }}</span>
                </div>

                <!-- Status Tag -->
                <span
                  class="queue-card__status-tag"
                  [class.queue-card__status-tag--current]="item.status === 'en_cours'"
                  [class.queue-card__status-tag--waiting]="item.status === 'en_attente'"
                  [class.queue-card__status-tag--served]="item.status === 'servi'"
                  [class.queue-card__status-tag--cancelled]="item.status === 'annule'"
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
                    Sauter
                  </button>

                  <button
                    type="button"
                    class="queue-card__btn queue-card__btn--served"
                    (click)="markServed(item.id)"
                  >
                    Marquer Servi
                  </button>

                  <button
                    type="button"
                    class="queue-card__btn queue-card__btn--more"
                    (click)="openOptions(item.id)"
                    aria-label="Annuler"
                    title="Annuler le ticket"
                  >
                    ✕
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
            <label>Téléphone (Optionnel)</label>
            <input type="tel" #phoneInput placeholder="Ex: +221 77 123 45 67" />
          </div>

          <div class="walkin-modal__actions">
            <button type="button" class="walkin-modal__cancel-btn" (click)="showAddModal.set(false)">
              Annuler
            </button>
            <button
              type="button"
              class="walkin-modal__submit-btn"
              (click)="addWalkInClient(nameInput.value, phoneInput.value)"
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
  protected readonly notificationService = inject(NotificationService);

  protected readonly activeTab = signal<'active' | 'history'>('active');
  protected readonly queue = signal<QueueItem[]>(INITIAL_QUEUE);
  protected readonly showAddModal = signal(false);

  protected readonly activeCount = computed(() =>
    this.queue().filter((q) => q.category === 'active').length
  );

  protected readonly historyCount = computed(() =>
    this.queue().filter((q) => q.category === 'history').length
  );

  protected readonly displayedQueue = computed(() => {
    const tab = this.activeTab();
    return this.queue().filter((q) => q.category === tab);
  });

  protected getStatusText(status: QueueItem['status']): string {
    switch (status) {
      case 'en_cours':
        return 'En cours';
      case 'en_attente':
        return 'En Attente';
      case 'servi':
        return 'SERVI';
      case 'annule':
        return 'ANNULÉ';
      default:
        return 'En Attente';
    }
  }

  protected skipClient(id: string): void {
    this.queue.update((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(idx + 1, 0, item);
      return copy.map((q, i) => ({ ...q, position: (i + 1).toString().padStart(2, '0') }));
    });
  }

  protected markServed(id: string): void {
    this.queue.update((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: 'servi', category: 'history' }
          : q
      )
    );
  }

  protected openOptions(id: string): void {
    this.queue.update((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: 'annule', category: 'history' }
          : q
      )
    );
  }

  protected addWalkInClient(name: string, phone: string): void {
    if (!name.trim()) return;
    const nextPos = (this.queue().filter((q) => q.category === 'active').length + 1).toString().padStart(2, '0');
    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      position: nextPos,
      clientName: name.trim(),
      phone: phone.trim() || '+221 77 000 00 00',
      status: 'en_attente',
      category: 'active'
    };

    this.queue.update((prev) => [...prev, newItem]);
    this.showAddModal.set(false);
  }

  protected goToNotifications(): void {
    this.router.navigate(['/coiffeur/notifications']);
  }
}
