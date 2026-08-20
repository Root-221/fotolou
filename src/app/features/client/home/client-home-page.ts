import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { LocationHeader } from '../../../shared/components/location-header/location-header';
import { SearchBar } from '../../../shared/components/search-bar/search-bar';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { SalonListCard } from '../../../shared/components/salon-list-card/salon-list-card';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
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
    SalonListCard,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    ErrorStateComponent
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

      <!-- Main Content -->
      <div class="client-home__content">

        <!-- Top Zone: Greeting + Search -->
        <div class="client-home__top">
          <section class="client-home__greeting">
            <h1>
              Bonjour, <span class="client-home__user-name">{{ userName }}</span> 👋
            </h1>
            <p class="client-home__subtitle">Prenez votre place dans votre salon préféré en 1 clic.</p>
          </section>

          <!-- Search Bar -->
          <section class="client-home__search">
            <app-search-bar
              [value]="salonService.searchQuery()"
              (valueChange)="salonService.searchQuery.set($event)"
              placeholder="Rechercher un salon, un quartier..."
            />
          </section>
        </div>

        <!-- Salon List Section -->
        <section class="client-home__salons">
          <app-section-heading
            title="Salons recommandés"
            linkLabel="Voir tout"
            linkRoute="/client/home"
          />

          <!-- Loading Skeleton -->
          @if (salonService.loading()) {
            <div class="client-home__list">
              <app-skeleton-loader type="salon" [count]="4" />
            </div>
          } @else if (salonService.error()) {
            <!-- Error State with Retry -->
            <app-error-state
              [message]="salonService.error()!"
              (retry)="salonService.loadSalons()"
            />
          } @else {
            <!-- Normal List / Empty State -->
            <div class="client-home__list">
              @for (salon of salonService.filteredSalons(); track salon.id) {
                <app-salon-list-card [salon]="salon" />
              } @empty {
                <app-empty-state
                  icon="search"
                  title="Aucun salon trouvé"
                  description="Essayez une autre recherche ou réinitialisez vos filtres."
                  actionLabel="Effacer la recherche"
                  (action)="salonService.searchQuery.set('')"
                />
              }
            </div>
          }
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
  private readonly auth = inject(AuthSessionService);

  protected get userName(): string {
    return this.auth.activeUser()?.name.split(' ')[0] ?? 'Amadou';
  }

  protected goToNotifications(): void {
    this.router.navigate(['/client/notifications']);
  }
}
