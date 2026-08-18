import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { ConfirmModal } from '../../../shared/components/confirm-modal/confirm-modal';
import { TicketService } from '../../../shared/services/ticket.service';
import { Ticket } from '../../../shared/models/ticket';

@Component({
  selector: 'app-ticket-detail-page',
  imports: [
    ClientLayout,
    PageHeader,
    StatCard,
    StatusBadge,
    ConfirmModal,
    RouterLink
  ],
  template: `
    <app-client-layout [showBottomNav]="false" [hasCustomFooter]="true">
      <!-- Fixed Top Header -->
      <app-page-header
        slot="header"
        title="Ticket"
        backRoute="/client/tickets"
      />

      <!-- Scrollable Main Content -->
      <div class="ticket-detail-page__content">
        <!-- Status & Title -->
        <section class="ticket-detail-page__hero">
          <span
            class="ticket-detail-page__status-tag"
            [class.ticket-detail-page__status-tag--completed]="isServed"
            [class.ticket-detail-page__status-tag--cancelled]="ticket.status === 'cancelled'"
          >
            {{ statusTagText }}
          </span>

          <h1>Ticket pour: {{ ticket.ownerName }}</h1>
          <p>{{ ticket.salonName }} &bull; Mermoz, Dakar</p>

          <!-- Circular Ring Progress (100% full for historical tickets) -->
          <div class="ticket-detail-page__ring-container">
            <svg class="ticket-detail-page__ring-svg" viewBox="0 0 200 200">
              <!-- Background Track -->
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#e2e8f0"
                stroke-width="12"
              />
              <!-- Dynamic Ring Stroke (100% full when served/completed/cancelled) -->
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                [attr.stroke]="ringColor"
                stroke-width="12"
                stroke-linecap="round"
                stroke-dasharray="502"
                [attr.stroke-dashoffset]="dashOffset"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div class="ticket-detail-page__number-display">
              {{ ticket.ticketNumber }}
            </div>
          </div>
        </section>

        <!-- Stats Row (Displayed only for active tickets) -->
        @if (!isHistory) {
          <section class="ticket-detail-page__stats">
            <app-stat-card label="NUMERO EN COURS">
              {{ queueNumberDisplay }}
            </app-stat-card>

            <app-stat-card label="STATUT">
              <app-status-badge [status]="salonStatus" />
            </app-stat-card>
          </section>
        }

        <!-- SMS / Completion Info Card -->
        <section
          class="ticket-detail-page__sms-card"
          [class.ticket-detail-page__sms-card--completed]="isServed"
          [class.ticket-detail-page__sms-card--cancelled]="ticket.status === 'cancelled'"
        >
          <div class="ticket-detail-page__sms-icon" aria-hidden="true">
            @if (isHistory) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            }
          </div>
          <div class="ticket-detail-page__sms-content">
            @switch (ticket.status) {
              @case ('served') {
                <p>Ce ticket a été <strong>servi avec succès</strong>. Merci d'utiliser Fotolou !</p>
              }
              @case ('completed') {
                <p>Ce ticket a été <strong>servi avec succès</strong>. Merci d'utiliser Fotolou !</p>
              }
              @case ('cancelled') {
                <p>Ce ticket a été <strong>annulé</strong>.</p>
              }
              @default {
                <p>Un SMS sera envoyé à <strong>+221 77 862 70 52</strong> dès que votre tour approchera.</p>
              }
            }
            @if (isHistory && formattedServedAt) {
              <span class="ticket-detail-page__served-date">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ formattedServedAt }}
              </span>
            }
          </div>
        </section>
      </div>

      <!-- Fixed Bottom Action Bar -->
      <div slot="footer" class="ticket-detail-page__fixed-footer">
        @if (isHistory) {
          <a routerLink="/client/home" class="ticket-detail-page__new-ticket-btn">
            <span>Prendre un nouveau ticket</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        } @else {
          <button type="button" class="ticket-detail-page__cancel-btn" (click)="showCancelModal.set(true)">
            <span class="ticket-detail-page__cancel-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </span>
            <span>Quitter la file</span>
          </button>
        }
      </div>
    </app-client-layout>

    <!-- Confirmation Modal -->
    <app-confirm-modal
      [isOpen]="showCancelModal()"
      title="Quitter la file d'attente ?"
      message="Êtes-vous sûr de vouloir annuler ce ticket et quitter la file ?"
      confirmLabel="Quitter la file"
      cancelLabel="Retour"
      variant="danger"
      (confirm)="confirmLeaveQueue()"
      (cancel)="showCancelModal.set(false)"
    />
  `,
  styleUrl: './ticket-detail-page.scss'
})
export class TicketDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ticketService = inject(TicketService);

  protected ticket!: Ticket;
  protected readonly showCancelModal = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.ticket = this.ticketService.getTicketById(id);
  }

  protected get isHistory(): boolean {
    return (
      this.ticket.category === 'history' ||
      this.ticket.status === 'served' ||
      this.ticket.status === 'completed' ||
      this.ticket.status === 'cancelled'
    );
  }

  protected get isServed(): boolean {
    return this.ticket.status === 'served' || this.ticket.status === 'completed';
  }

  protected get formattedServedAt(): string {
    if (!this.ticket.servedAt) return '';
    const date = new Date(this.ticket.servedAt);
    return date.toLocaleDateString('fr-SN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  protected get statusTagText(): string {
    switch (this.ticket.status) {
      case 'served':
      case 'completed':
        return 'SERVI';
      case 'cancelled':
        return 'ANNULÉ';
      case 'your_turn':
        return 'MON TOUR';
      case 'waiting':
      default:
        return 'EN ATTENTE';
    }
  }

  protected get ringColor(): string {
    switch (this.ticket.status) {
      case 'served':
      case 'completed':
        return '#16a34a'; // Vibrant Green for served
      case 'cancelled':
        return '#ef4444'; // Red for cancelled
      case 'your_turn':
      case 'waiting':
      default:
        return '#2563eb'; // Vibrant Blue for active
    }
  }

  protected get dashOffset(): number {
    if (this.isHistory) {
      return 0; // 100% Full ring
    }
    return 140; // Active ring arc
  }

  protected get queueNumberDisplay(): string {
    if (this.isServed) {
      return 'Servi';
    }
    if (this.ticket.status === 'cancelled') {
      return 'Annulé';
    }
    return '3';
  }

  protected get salonStatus(): 'open' | 'closed' {
    return this.isHistory ? 'closed' : 'open';
  }

  protected confirmLeaveQueue(): void {
    this.showCancelModal.set(false);
    this.ticketService.cancelTicket(this.ticket.id);
    this.router.navigate(['/client/tickets']);
  }
}
