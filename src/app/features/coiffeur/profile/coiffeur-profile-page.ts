import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { LocationHeader } from '../../../shared/components/location-header/location-header';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { ConfirmModal } from '../../../shared/components/confirm-modal/confirm-modal';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-coiffeur-profile-page',
  imports: [
    ClientLayout,
    LocationHeader,
    StatCard,
    ConfirmModal
  ],
  template: `
    <app-client-layout activeNav="profile" role="coiffeur" [hasHeaderSlot]="true">

      <!-- Fixed Header -->
      <app-location-header
        slot="header"
        [showLocation]="false"
        [hasNotification]="notificationService.coiffeurUnreadCount() > 0"
        (notificationClick)="goToNotifications()"
      />

      <!-- Scrollable Body -->
      <div class="profile-page">

        <!-- Avatar & Identity -->
        <section class="profile-page__hero">
          <div class="profile-page__avatar profile-page__avatar--coiffeur" aria-hidden="true">
            KB
          </div>
          <h1 class="profile-page__name">{{ salonName }}</h1>
          <p class="profile-page__role-tag">Coiffeur Pro &bull; {{ barberName }}</p>
          <p class="profile-page__phone">{{ phone }}</p>
        </section>

        <!-- Stats Row -->
        <section class="profile-page__stats">
          <app-stat-card label="CLIENTS SERVIS">
            250
          </app-stat-card>
          <app-stat-card label="NOTE MOYENNE">
            4.9 ★
          </app-stat-card>
        </section>

        <!-- Menu Items -->
        <nav class="profile-page__menu" aria-label="Menu profil coiffeur">
          <!-- Photos du Profil & Salon -->
          <button type="button" class="profile-page__menu-item" (click)="goToPhotos()">
            <span class="profile-page__menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </span>
            <span class="profile-page__menu-label">Photos Profil & Salon</span>
            <span class="profile-page__menu-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </button>

          <div class="profile-page__divider"></div>

          <!-- Gestion de la file -->
          <button type="button" class="profile-page__menu-item" (click)="goToQueue()">
            <span class="profile-page__menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 7h12l1 13H5L6 7Z"/>
                <path d="M9 7a3 3 0 0 1 6 0"/>
              </svg>
            </span>
            <span class="profile-page__menu-label">Gestion de la file en direct</span>
            <span class="profile-page__menu-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </button>

          <div class="profile-page__divider"></div>

          <!-- Mes Commandes Matériel -->
          <button type="button" class="profile-page__menu-item" (click)="goToOrders()">
            <span class="profile-page__menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </span>
            <span class="profile-page__menu-label">Mes Commandes Matériel</span>
            <span class="profile-page__menu-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </button>

          <div class="profile-page__divider"></div>

          <!-- Notifications Pro -->
          <button type="button" class="profile-page__menu-item" (click)="goToNotifications()">
            <span class="profile-page__menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </span>
            <span class="profile-page__menu-label">Notifications Salon</span>
            @if (notificationService.coiffeurUnreadCount() > 0) {
              <span class="profile-page__badge">{{ notificationService.coiffeurUnreadCount() }}</span>
            }
            <span class="profile-page__menu-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </button>

          <div class="profile-page__divider"></div>

          <!-- Paramètres du Salon -->
          <button type="button" class="profile-page__menu-item" (click)="goToSettings()">
            <span class="profile-page__menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
              </svg>
            </span>
            <span class="profile-page__menu-label">Paramètres du Salon</span>
            <span class="profile-page__menu-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </button>

          <div class="profile-page__divider"></div>

          <!-- Aide & Support -->
          <button type="button" class="profile-page__menu-item" (click)="goToSupport()">
            <span class="profile-page__menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </span>
            <span class="profile-page__menu-label">Aide &amp; Support Pro</span>
            <span class="profile-page__menu-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </button>
        </nav>

        <!-- Logout Button -->
        <div class="profile-page__logout-wrap">
          <button type="button" class="profile-page__logout-btn" (click)="showLogoutModal.set(true)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Déconnexion Pro</span>
          </button>
        </div>

      </div>
    </app-client-layout>

    <!-- Logout Confirmation Modal -->
    <app-confirm-modal
      [isOpen]="showLogoutModal()"
      title="Déconnexion"
      message="Êtes-vous sûr de vouloir fermer la session pro du salon ?"
      confirmLabel="Déconnexion"
      cancelLabel="Annuler"
      variant="danger"
      (confirm)="confirmLogout()"
      (cancel)="showLogoutModal.set(false)"
    />
  `,
  styleUrl: '../../client/profile/client-profile-page.scss'
})
export class CoiffeurProfilePage {
  private readonly router = inject(Router);
  protected readonly notificationService = inject(NotificationService);

  protected readonly showLogoutModal = signal(false);
  protected readonly salonName = 'King Barber';
  protected readonly barberName = 'Moussa Kane';
  protected readonly phone = '+221 77 862 70 52';

  protected goToPhotos(): void {
    this.router.navigate(['/coiffeur/settings/photos']);
  }

  protected goToQueue(): void {
    this.router.navigate(['/coiffeur/tickets']);
  }

  protected goToOrders(): void {
    this.router.navigate(['/client/boutique/commandes']);
  }

  protected goToNotifications(): void {
    this.router.navigate(['/coiffeur/notifications']);
  }

  protected goToSettings(): void {
    this.router.navigate(['/coiffeur/settings']);
  }

  protected goToSupport(): void {
    this.router.navigate(['/coiffeur/support']);
  }

  protected confirmLogout(): void {
    this.showLogoutModal.set(false);
    this.router.navigate(['/auth/login']);
  }
}
