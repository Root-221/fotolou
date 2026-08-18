import { Component, OnInit, OnDestroy, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Typage de l'événement natif beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}

@Component({
  selector: 'app-install-banner',
  template: `
    @if (showBanner()) {
      <div class="install-banner" role="complementary" aria-label="Installer l'application">
        <div class="install-banner__content">
          <img class="install-banner__icon" src="icons/icon-192x192.png" alt="Fotolou" />
          <div class="install-banner__text">
            <strong>Installer Fotolou</strong>
            <span>Accès rapide depuis votre écran d'accueil</span>
          </div>
        </div>
        <div class="install-banner__actions">
          <button
            id="install-banner-dismiss-btn"
            class="install-banner__btn install-banner__btn--dismiss"
            type="button"
            (click)="dismiss()"
            aria-label="Fermer"
          >
            ✕
          </button>
          <button
            id="install-banner-install-btn"
            class="install-banner__btn install-banner__btn--install"
            type="button"
            (click)="install()"
          >
            Installer
          </button>
        </div>
      </div>
    }
  `,
  styleUrl: './install-banner.scss'
})
export class InstallBanner implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly showBanner = signal(false);
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  private readonly onBeforeInstallPrompt = (event: Event) => {
    event.preventDefault();
    this.deferredPrompt = event as BeforeInstallPromptEvent;

    // Ne pas afficher si l'utilisateur a déjà refusé récemment
    const dismissed = sessionStorage.getItem('fotolou-install-dismissed');
    if (!dismissed) {
      // Léger délai pour ne pas afficher immédiatement au chargement
      setTimeout(() => this.showBanner.set(true), 3000);
    }
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Vérifier si déjà installée (mode standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    window.addEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);
  }

  protected dismiss(): void {
    this.showBanner.set(false);
    // Mémoriser le refus pour la session en cours
    sessionStorage.setItem('fotolou-install-dismissed', '1');
  }

  protected async install(): Promise<void> {
    if (!this.deferredPrompt) return;

    await this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      this.showBanner.set(false);
    }

    this.deferredPrompt = null;
  }
}
