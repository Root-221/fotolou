import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClientLayout } from '../../../../shared/components/client-layout/client-layout';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { AuthActionButton } from '../../components/auth-action-button/auth-action-button';
import { OtpCodeInput } from '../../components/otp-code-input/otp-code-input';
import { AuthSessionService } from '../../auth-session.service';

@Component({
  selector: 'app-otp-page',
  imports: [
    ClientLayout,
    PageHeader,
    AuthActionButton,
    OtpCodeInput
  ],
  template: `
    <app-client-layout [showBottomNav]="false" [hasCustomFooter]="true">
      <!-- Fixed Header Slot -->
      <app-page-header
        slot="header"
        title="Entrez le code"
        backRoute="/auth/login"
      />

      <!-- Scrollable Main Content -->
      <div class="otp-page__content">
        <header class="otp-page__header">
          <p>Nous avons envoyé un code OTP</p>
          <strong>au {{ auth.pendingPhone() }}</strong>
        </header>

        <app-otp-code-input code="123456" (codeChange)="verificationCode.set($event)" />

        <p class="otp-page__resend">Renvoyer le code dans {{ countdown() }}</p>

        @if (errorMessage()) {
          <p class="otp-page__error" role="alert">{{ errorMessage() }}</p>
        }
      </div>

      <!-- Fixed Footer Slot -->
      <div slot="footer" class="otp-page__fixed-footer">
        <app-auth-action-button variant="outline" (pressed)="verifyCode()">
          verifier
          <span aria-hidden="true">&#8594;</span>
        </app-auth-action-button>
      </div>
    </app-client-layout>
  `,
  styleUrl: './otp-page.scss'
})
export class OtpPage {
  protected readonly auth = inject(AuthSessionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal('');
  protected readonly remainingSeconds = signal(45);
  protected readonly verificationCode = signal('123456');
  protected readonly countdown = computed(() => {
    const seconds = this.remainingSeconds().toString().padStart(2, '0');
    return `00:${seconds}`;
  });

  constructor() {
    const timer = globalThis.setInterval(() => {
      this.remainingSeconds.update((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    this.destroyRef.onDestroy(() => {
      globalThis.clearInterval(timer);
    });
  }

  protected verifyCode(): void {
    if (!this.auth.verifyOtp(this.verificationCode())) {
      this.errorMessage.set('Code incorrect. Utilise 123456 pour la simulation.');
      return;
    }

    void this.router.navigateByUrl(this.auth.getHomeRoute());
  }
}
