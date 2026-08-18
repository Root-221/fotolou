import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-location-header',
  template: `
    <header class="location-header">
      @if (showLocation) {
        <button class="location-header__selector" (click)="locationClick.emit()" type="button">
          <span class="location-header__pin-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </span>
          <span class="location-header__text">{{ location }}</span>
          <span class="location-header__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </span>
        </button>
      } @else {
        <div class="location-header__spacer"></div>
      }

      <button class="location-header__notification-btn" (click)="notificationClick.emit()" type="button" aria-label="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        @if (hasNotification) {
          <span class="location-header__unread-dot"></span>
        }
      </button>
    </header>
  `,
  styleUrl: './location-header.scss'
})
export class LocationHeader {
  @Input() location = 'Dakar, Sénégal';
  @Input() showLocation = true;
  @Input() hasNotification = true;

  @Output() locationClick = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
}
