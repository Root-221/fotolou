import { Component, inject } from '@angular/core';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-pwa-guide-modal',
  template: `
    @if (pwa.showGuideModal()) {
      <div
        class="pwa-modal-backdrop"
        (click)="close()"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-modal-title"
      >
        <div class="pwa-modal" (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="pwa-modal__header">
            <div class="pwa-modal__badge">
              <img src="icons/icon-192x192.png" alt="Fotolou" class="pwa-modal__app-icon" />
              <div>
                <h2 id="pwa-modal-title" class="pwa-modal__title">
                  @if (pwa.isIos()) {
                    Installer Fotolou sur votre iPhone
                  } @else {
                    Installer Fotolou sur votre téléphone
                  }
                </h2>
                <p class="pwa-modal__subtitle">Accédez à vos salons en 1 clic sans passer par le navigateur</p>
              </div>
            </div>
            <button
              type="button"
              class="pwa-modal__close-btn"
              (click)="close()"
              aria-label="Fermer le guide"
            >
              ✕
            </button>
          </div>

          <!-- Body with Steps -->
          <div class="pwa-modal__body">
            @if (pwa.isIos()) {
              <!-- iOS Specific Steps -->
              <div class="pwa-steps">
                
                <!-- Step 1 -->
                <div class="pwa-step">
                  <div class="pwa-step__num">1</div>
                  <div class="pwa-step__icon-box">
                    <!-- iOS Share Icon -->
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div class="pwa-step__content">
                    <strong class="pwa-step__title">Appuyez sur « Partager »</strong>
                    <span class="pwa-step__desc">Dans la barre de navigation Safari en bas (ou en haut sur iPad).</span>
                  </div>
                </div>

                <!-- Step 2 -->
                <div class="pwa-step">
                  <div class="pwa-step__num">2</div>
                  <div class="pwa-step__icon-box">
                    <!-- Add to Home Screen Icon -->
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="4" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  <div class="pwa-step__content">
                    <strong class="pwa-step__title">Sélectionnez « Sur l'écran d'accueil »</strong>
                    <span class="pwa-step__desc">Faites défiler la liste des options vers le bas puis touchez l'option.</span>
                  </div>
                </div>

                <!-- Step 3 -->
                <div class="pwa-step">
                  <div class="pwa-step__num">3</div>
                  <div class="pwa-step__icon-box pwa-step__icon-box--success">
                    <!-- Check / Add icon -->
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div class="pwa-step__content">
                    <strong class="pwa-step__title">Appuyez sur « Ajouter »</strong>
                    <span class="pwa-step__desc">En haut à droite de l'écran. L'icône Fotolou apparaîtra sur votre téléphone !</span>
                  </div>
                </div>

              </div>
            } @else {
              <!-- Android / Standard Browser Steps -->
              <div class="pwa-steps">
                
                @if (pwa.canPromptNative()) {
                  <div class="pwa-native-callout">
                    <p>L'installation directe est disponible sur votre navigateur.</p>
                    <button
                      type="button"
                      class="pwa-btn-primary pwa-btn-primary--full"
                      (click)="installDirect()"
                    >
                      Installer maintenant
                    </button>
                  </div>
                }

                <!-- Manual instructions for Chrome / Firefox Android -->
                <div class="pwa-step">
                  <div class="pwa-step__num">1</div>
                  <div class="pwa-step__icon-box">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <circle cx="12" cy="19" r="2"/>
                    </svg>
                  </div>
                  <div class="pwa-step__content">
                    <strong class="pwa-step__title">Menu du navigateur (⋮)</strong>
                    <span class="pwa-step__desc">Appuyez sur les 3 points en haut à droite du navigateur.</span>
                  </div>
                </div>

                <div class="pwa-step">
                  <div class="pwa-step__num">2</div>
                  <div class="pwa-step__icon-box pwa-step__icon-box--success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <div class="pwa-step__content">
                    <strong class="pwa-step__title">« Installer l'application »</strong>
                    <span class="pwa-step__desc">Ou « Ajouter à l'écran d'accueil » selon votre navigateur.</span>
                  </div>
                </div>

              </div>
            }

            <!-- Advantages box -->
            <div class="pwa-advantages">
              <div class="pwa-advantage-item">
                <span class="pwa-advantage-icon">⚡</span>
                <span>Lancement instantané</span>
              </div>
              <div class="pwa-advantage-item">
                <span class="pwa-advantage-icon">🔔</span>
                <span>Notifications de tickets</span>
              </div>
              <div class="pwa-advantage-item">
                <span class="pwa-advantage-icon">📱</span>
                <span>Mode plein écran</span>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="pwa-modal__footer">
            <button
              type="button"
              class="pwa-modal__action-btn"
              (click)="close()"
            >
              J'ai compris
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styleUrl: './pwa-guide-modal.scss'
})
export class PwaGuideModal {
  protected readonly pwa = inject(PwaService);

  protected close(): void {
    this.pwa.closeGuideModal();
  }

  protected async installDirect(): Promise<void> {
    await this.pwa.promptInstall();
  }
}
