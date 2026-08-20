import { Component, inject } from '@angular/core';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-install-banner',
  template: `
    @if (pwa.showBanner()) {
      <div
        class="install-popup-backdrop"
        (click)="dismiss()"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-popup-title"
      >
        <div class="install-popup" (click)="$event.stopPropagation()">
          
          <!-- App Header -->
          <div class="install-popup__header">
            <img class="install-popup__icon" src="icons/icon-192x192.png" alt="Fotolou" />
            <div class="install-popup__title-wrap">
              <h2 id="install-popup-title" class="install-popup__title">
                @if (pwa.isIos()) {
                  Installer Fotolou sur iPhone
                } @else {
                  Installer l'application Fotolou
                }
              </h2>
              <span class="install-popup__tag">Application officielle &bull; Gratuit</span>
            </div>
            <button
              type="button"
              class="install-popup__close-btn"
              (click)="dismiss()"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <!-- Content / Instructions -->
          <div class="install-popup__body">
            @if (pwa.isIos()) {
              <p class="install-popup__desc">
                Installez Fotolou sur votre écran d'accueil pour y accéder en un clic comme une vraie application :
              </p>
              
              <div class="install-popup__ios-steps">
                <div class="install-popup__ios-step">
                  <span class="install-popup__ios-num">1</span>
                  <div class="install-popup__ios-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </div>
                  <span class="install-popup__ios-text">Appuyez sur le bouton <strong>Partager</strong> en bas de Safari</span>
                </div>

                <div class="install-popup__ios-step">
                  <span class="install-popup__ios-num">2</span>
                  <div class="install-popup__ios-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="4" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  <span class="install-popup__ios-text">Faites défiler et choisissez <strong>« Sur l'écran d'accueil »</strong></span>
                </div>

                <div class="install-popup__ios-step">
                  <span class="install-popup__ios-num">3</span>
                  <div class="install-popup__ios-icon install-popup__ios-icon--check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span class="install-popup__ios-text">Touchez <strong>« Ajouter »</strong> en haut à droite</span>
                </div>
              </div>
            } @else {
              <p class="install-popup__desc">
                Installez l'application Fotolou sur votre téléphone pour profiter d'une expérience fluide, rapide et recevoir vos alertes de ticket en direct.
              </p>
            }
          </div>

          <!-- Actions -->
          <div class="install-popup__actions">
            @if (pwa.isIos()) {
              <button
                type="button"
                class="install-popup__btn install-popup__btn--primary"
                (click)="dismiss()"
              >
                J'ai compris
              </button>
            } @else {
              <button
                type="button"
                class="install-popup__btn install-popup__btn--secondary"
                (click)="dismiss()"
              >
                Plus tard
              </button>
              <button
                type="button"
                class="install-popup__btn install-popup__btn--primary"
                (click)="install()"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Installer maintenant</span>
              </button>
            }
          </div>

        </div>
      </div>
    }
  `,
  styleUrl: './install-banner.scss'
})
export class InstallBanner {
  protected readonly pwa = inject(PwaService);

  protected dismiss(): void {
    this.pwa.dismissBanner();
  }

  protected async install(): Promise<void> {
    await this.pwa.promptInstall();
  }
}
