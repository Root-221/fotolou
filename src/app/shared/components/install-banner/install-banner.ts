import { Component, inject } from '@angular/core';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-install-banner',
  template: `
    @if (pwa.showBanner()) {
      <aside
        class="install-banner"
        role="complementary"
        aria-label="Installer l'application Fotolou"
      >
        <div class="install-banner__main">
          <!-- App Icon & Description -->
          <div class="install-banner__header">
            <img class="install-banner__icon" src="icons/icon-192x192.png" alt="Fotolou" />
            <div class="install-banner__text">
              <strong class="install-banner__title">📱 Installez Fotolou</strong>
              <p class="install-banner__desc">
                Accédez rapidement à vos salons et gérez vos tickets comme une vraie application.
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="install-banner__actions">
            <button
              id="install-banner-dismiss-btn"
              class="install-banner__btn install-banner__btn--dismiss"
              type="button"
              (click)="dismiss()"
              aria-label="Fermer la bannière d'installation"
              title="Fermer"
            >
              ✕
            </button>
            <button
              id="install-banner-install-btn"
              class="install-banner__btn install-banner__btn--install"
              type="button"
              (click)="install()"
            >
              Installer Fotolou
            </button>
          </div>
        </div>
      </aside>
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
