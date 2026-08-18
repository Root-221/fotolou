import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { LocationHeader } from '../../../shared/components/location-header/location-header';
import { SearchBar } from '../../../shared/components/search-bar/search-bar';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { SalonListCard } from '../../../shared/components/salon-list-card/salon-list-card';
import { SalonService } from '../../../shared/services/salon.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthSessionService } from '../../auth/auth-session.service';

@Component({
  selector: 'app-client-home-page',
  imports: [
    ClientLayout,
    LocationHeader,
    SearchBar,
    SectionHeading,
    SalonListCard
  ],
  template: `
    <app-client-layout activeNav="home">
      <!-- Standard Location Header -->
      <app-location-header
        slot="header"
        [location]="salonService.currentLocation()"
        [hasNotification]="notificationService.unreadCount() > 0"
        (notificationClick)="goToNotifications()"
      />

      <!-- Scrollable Content -->
      <div class="client-home__content">

        <!-- Fixed Top Zone: Greeting + Search -->
        <div class="client-home__top">
          <!-- Greeting Header -->
          <section class="client-home__greeting">
            <h1>
              Bonjour , <span class="client-home__user-name">{{ userName }}</span>👋
            </h1>
          </section>

          <!-- Search Bar -->
          <section class="client-home__search">
            <app-search-bar
              [value]="salonService.searchQuery()"
              (valueChange)="salonService.searchQuery.set($event)"
              placeholder="Rechercher un salon"
            />
          </section>
        </div>

        <!-- Scrollable Salon List -->
        <section class="client-home__salons">
          <app-section-heading
            title="Salons proches"
            linkLabel="Voir tout"
            linkRoute="/client/home"
          />

          <div class="client-home__list">
            @for (salon of salonService.filteredSalons(); track salon.id) {
              <app-salon-list-card [salon]="salon" />
            } @empty {
              <div class="client-home__empty">
                <p>Aucun salon ne correspond à votre recherche.</p>
              </div>
            }
          </div>
        </section>
      </div>
    </app-client-layout>
  `,
  styleUrl: './client-home-page.scss'
})
export class ClientHomePage {
  private readonly router = inject(Router);
  protected readonly salonService = inject(SalonService);
  protected readonly notificationService = inject(NotificationService);
  protected readonly auth = inject(AuthSessionService);

  protected get userName(): string {
    const user = this.auth.activeUser();
    return user?.name || 'Diassy';
  }

  protected goToNotifications(): void {
    this.router.navigate(['/client/notifications']);
  }
}
