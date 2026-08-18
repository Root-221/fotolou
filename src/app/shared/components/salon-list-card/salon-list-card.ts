import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Salon } from '../../models/salon';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-salon-list-card',
  imports: [RouterLink, StatusBadge],
  template: `
    <a class="salon-list-card" [routerLink]="['/client/salons', salon.id]">
      <img class="salon-list-card__image" [src]="salon.avatarUrl" [alt]="salon.name" />

      <div class="salon-list-card__body">
        <div class="salon-list-card__title-row">
          <strong>{{ salon.name }}</strong>
          <app-status-badge [status]="salon.status" />
        </div>
        <span class="salon-list-card__location">{{ salon.location }}</span>
        <div class="salon-list-card__queue">
          <strong>{{ salon.peopleWaiting }}</strong> personnes
        </div>
      </div>
    </a>
  `,
  styleUrl: './salon-list-card.scss'
})
export class SalonListCard {
  @Input({ required: true }) salon!: Salon;
}
