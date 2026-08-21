import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { TicketOwnerCard } from '../../../shared/components/ticket-owner-card/ticket-owner-card';
import { SalonService } from '../../../shared/services/salon.service';
import { TicketService } from '../../../shared/services/ticket.service';
import { RelativeService } from '../../../shared/services/relative.service';
import { TicketOwner } from '../../../shared/models/ticket-owner';

@Component({
  selector: 'app-ticket-owner-page',
  imports: [
    ClientLayout,
    PageHeader,
    TicketOwnerCard
  ],
  template: `
    <app-client-layout [showBottomNav]="false" [hasCustomFooter]="true">
      <!-- Fixed Top Header -->
      <app-page-header
        slot="header"
        title="Prendre des tickets"
        [backRoute]="'/client/salons/' + salonId"
      />

      <!-- Scrollable Body Content -->
      <div class="ticket-owner-page__content">
        <!-- Hero Section -->
        <section class="ticket-owner-page__hero">
          <div class="ticket-owner-page__hero-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>

          <h1>Pour qui prenez-vous un ticket ?</h1>
          <p>Sélectionnez une ou plusieurs personnes en même temps (clic ou appui long).</p>

          <!-- Selection Count Badge -->
          <div class="ticket-owner-page__badge">
            <span class="ticket-owner-page__badge-dot"></span>
            <span>{{ selectedCount() }} ticket(s) sélectionné(s)</span>
          </div>
        </section>

        <!-- Owner Selection List -->
        <section class="ticket-owner-page__options" aria-label="Liste des bénéficiaires">
          @for (owner of allTicketOwners(); track owner.id) {
            @if (owner.type === 'relative' && isFirstRelative(owner)) {
              <div class="ticket-owner-page__section-header">
                <span class="ticket-owner-page__section-label">PROCHES ENREGISTRÉS</span>
              </div>
            }

            <app-ticket-owner-card
              [owner]="owner"
              [isSelected]="isOwnerSelected(owner.id)"
              [customName]="customOwnerName()"
              (cardClick)="toggleOwner(owner)"
              (cardLongPress)="onLongPress(owner)"
              (customNameChange)="onCustomNameChange($event)"
            />
          }
        </section>
      </div>

      <!-- Fixed Bottom Action Bar -->
      <div slot="footer" class="ticket-owner-page__fixed-footer">
        <button
          type="button"
          class="ticket-owner-page__submit-btn"
          [disabled]="selectedCount() === 0"
          (click)="proceedToPayment()"
        >
          <span>{{ submitButtonLabel() }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </app-client-layout>
  `,
  styleUrl: './ticket-owner-page.scss'
})
export class TicketOwnerPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly salonService = inject(SalonService);
  private readonly ticketService = inject(TicketService);
  private readonly relativeService = inject(RelativeService);

  protected salonId = 'king-barber';

  // Multi-selection state
  protected readonly selectedOwnerIds = signal<string[]>(['self']);
  protected readonly customOwnerName = signal<string>('');

  protected readonly selectedCount = computed(() => this.selectedOwnerIds().length);

  // Dynamic list combining Self, Dynamic Relatives, and Custom
  protected readonly allTicketOwners = computed<TicketOwner[]>(() => {
    const defaultSelf: TicketOwner = {
      id: 'self',
      type: 'self',
      name: 'Moi (Awa Diop)',
      subtitle: '+221 70 123 45 67',
      avatarInitials: 'A'
    };

    const relatives = this.relativeService.relatives().map(r => ({
      id: r.id,
      type: 'relative' as const,
      name: r.name,
      subtitle: r.relation
    }));

    // Fallback if no relatives added yet
    const relativesList = relatives.length > 0 ? relatives : [
      { id: 'maman', type: 'relative' as const, name: 'Maman', subtitle: 'Famille' },
      { id: 'papa', type: 'relative' as const, name: 'Papa', subtitle: 'Famille' }
    ];

    const customPerson: TicketOwner = {
      id: 'custom',
      type: 'custom',
      name: 'Autre personne',
      subtitle: 'Saisir un nom personnalisé',
      isCustomInput: true
    };

    return [defaultSelf, ...relativesList, customPerson];
  });

  protected readonly submitButtonLabel = computed(() => {
    const count = this.selectedCount();
    if (count <= 1) {
      return 'Confirmer mon ticket (1 ticket)';
    }
    return `Confirmer les ${count} tickets en même temps`;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.salonId = id;
    }
  }

  protected isFirstRelative(owner: TicketOwner): boolean {
    const list = this.allTicketOwners();
    const firstRel = list.find(o => o.type === 'relative');
    return firstRel?.id === owner.id;
  }

  protected isOwnerSelected(ownerId: string): boolean {
    return this.selectedOwnerIds().includes(ownerId);
  }

  protected toggleOwner(owner: TicketOwner): void {
    const current = this.selectedOwnerIds();
    if (current.includes(owner.id)) {
      // If clicking already selected item, deselect unless it's the only one
      if (current.length > 1) {
        this.selectedOwnerIds.set(current.filter(id => id !== owner.id));
      }
    } else {
      // Add to multi-selection
      this.selectedOwnerIds.set([...current, owner.id]);
    }
  }

  protected onLongPress(owner: TicketOwner): void {
    this.toggleOwner(owner);
  }

  protected onCustomNameChange(name: string): void {
    this.customOwnerName.set(name);
  }

  protected proceedToPayment(): void {
    const selectedIds = this.selectedOwnerIds();
    if (selectedIds.length === 0) return;

    this.salonService.getSalonById(this.salonId).subscribe({
      next: (salon) => {
        const salonName = salon?.name || 'King Barber';
        const allOwners = this.allTicketOwners();

        const targetNames = selectedIds.map(id => {
          if (id === 'custom') {
            return this.customOwnerName().trim() || 'Autre personne';
          }
          const found = allOwners.find(o => o.id === id);
          return found ? found.name : 'Client';
        });

        this.ticketService.createMultipleTickets(this.salonId, salonName, targetNames).subscribe(() => {
          this.router.navigate(['/client/tickets']);
        });
      },
      error: () => {
        this.ticketService.createTicket(this.salonId, 'King Barber', 'Awa Diop').subscribe(() => {
          this.router.navigate(['/client/tickets']);
        });
      }
    });
  }
}
