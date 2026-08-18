import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TicketOwner } from '../../models/ticket-owner';

@Component({
  selector: 'app-ticket-owner-card',
  imports: [FormsModule],
  template: `
    <article
      class="ticket-owner-card"
      [class.ticket-owner-card--selected]="isSelected"
      (click)="cardClick.emit()"
    >
      <div class="ticket-owner-card__content">
        <div class="ticket-owner-card__avatar" [class.ticket-owner-card__avatar--blue]="owner.type === 'self'">
          @switch (owner.type) {
            @case ('self') {
              <span>{{ owner.avatarInitials || 'B' }}</span>
            }
            @case ('relative') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            }
            @case ('custom') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            }
          }
        </div>

        <div class="ticket-owner-card__info">
          <strong class="ticket-owner-card__name">{{ owner.name }}</strong>
          @if (owner.subtitle) {
            <span class="ticket-owner-card__subtitle">{{ owner.subtitle }}</span>
          }
        </div>
      </div>

      @if (isSelected && owner.isCustomInput) {
        <div class="ticket-owner-card__input-wrapper" (click)="$event.stopPropagation()">
          <input
            type="text"
            class="ticket-owner-card__input"
            placeholder="Entrez le nom et prénom"
            [ngModel]="customName"
            (ngModelChange)="customNameChange.emit($event)"
          />
        </div>
      }
    </article>
  `,
  styleUrl: './ticket-owner-card.scss'
})
export class TicketOwnerCard {
  @Input({ required: true }) owner!: TicketOwner;
  @Input() isSelected = false;
  @Input() customName = '';

  @Output() cardClick = new EventEmitter<void>();
  @Output() customNameChange = new EventEmitter<string>();
}
