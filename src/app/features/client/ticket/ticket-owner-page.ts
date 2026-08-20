import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { TicketOwnerCard } from '../../../shared/components/ticket-owner-card/ticket-owner-card';
import { SalonService } from '../../../shared/services/salon.service';
import { TicketService } from '../../../shared/services/ticket.service';
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
        title="Prendre mon ticket"
        [backRoute]="'/client/salons/' + salonId"
      />

      <!-- Scrollable Body Content -->
      <div class="ticket-owner-page__content">
        <!-- Hero Section -->
        <section class="ticket-owner-page__hero">
          <div class="ticket-owner-page__hero-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="17" y1="11" x2="23" y2="11"/>
            </svg>
          </div>

          <h1>Pour qui ?</h1>
          <p>Sélectionnez la personne pour qui vous prenez ce ticket.</p>
        </section>

        <!-- Owner Selection List -->
        <section class="ticket-owner-page__options">
          @for (owner of ticketOwners; track owner.id) {
            @if (owner.type === 'relative' && isFirstRelative(owner)) {
              <span class="ticket-owner-page__section-label">PROCHES ENREGISTRÉS</span>
            }

            <app-ticket-owner-card
              [owner]="owner"
              [isSelected]="selectedOwner().id === owner.id"
              [customName]="customOwnerName()"
              (cardClick)="selectOwner(owner)"
              (customNameChange)="onCustomNameChange($event)"
            />
          }
        </section>
      </div>

      <!-- Fixed Bottom Action Bar -->
      <div slot="footer" class="ticket-owner-page__fixed-footer">
        <button type="button" class="ticket-owner-page__submit-btn" (click)="proceedToPayment()">
          <span>Confirmer mon ticket</span>
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

  protected salonId = 'king-barber';
  protected readonly ticketOwners = this.salonService.getTicketOwners();
  protected readonly selectedOwner = this.salonService.selectedOwner;
  protected readonly customOwnerName = this.salonService.customOwnerName;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.salonId = id;
    }
  }

  protected isFirstRelative(owner: TicketOwner): boolean {
    return owner.id === 'maman';
  }

  protected selectOwner(owner: TicketOwner): void {
    this.salonService.selectOwner(owner);
  }

  protected onCustomNameChange(name: string): void {
    this.salonService.setCustomOwnerName(name);
  }

  protected proceedToPayment(): void {
    this.salonService.getSalonById(this.salonId).subscribe({
      next: (salon) => {
        const salonName = salon?.name || 'King Barber';
        const owner = this.selectedOwner();
        const targetName = owner.isCustomInput
          ? this.customOwnerName() || 'Autre personne'
          : owner.name;

        this.ticketService.createTicket(this.salonId, salonName, targetName).subscribe(() => {
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
