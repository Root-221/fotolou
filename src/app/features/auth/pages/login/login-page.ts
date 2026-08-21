import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountTypeToggle } from '../../components/account-type-toggle/account-type-toggle';
import { AuthActionButton } from '../../components/auth-action-button/auth-action-button';
import { AuthShell } from '../../components/auth-shell/auth-shell';
import { SocialAuthButton } from '../../components/social-auth-button/social-auth-button';
import { AuthSessionService, SocialProvider } from '../../auth-session.service';

@Component({
  selector: 'app-login-page',
  imports: [AccountTypeToggle, AuthActionButton, AuthShell, SocialAuthButton],
  template: `
    <app-auth-shell>
      <div class="login-page">
        <header class="login-page__header">
          <h1>Bienvenue</h1>
          <p>Connecte-toi pour continuer</p>
        </header>

        <div class="login-page__field-group">
          <label class="login-page__label" for="phone">T&eacute;l&eacute;phone</label>
          <div class="phone-field">
            <button class="phone-field__country" type="button" aria-label="Indicatif S&eacute;n&eacute;gal">
              <span class="country-flag" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span>+221</span>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m6 8 4 4 4-4" />
              </svg>
            </button>

            <span class="phone-field__divider" aria-hidden="true"></span>

            <input
              id="phone"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              [placeholder]="phonePlaceholder()"
              [value]="phoneNumber()"
              (input)="updatePhone($event)"
            />
          </div>
        </div>

        <div class="login-page__separator">
          <span></span>
          <strong>ou</strong>
          <span></span>
        </div>

        <div class="login-page__socials">
          <app-social-auth-button
            provider="google"
            label="Se connecter avec Google"
            (selected)="continueWithSocial($event)"
          />
          <app-social-auth-button
            provider="apple"
            label="Se connecter avec Apple"
            (selected)="continueWithSocial($event)"
          />
        </div>

        <div class="login-page__role">
          <app-account-type-toggle />
        </div>

        <footer class="login-page__footer">
          <app-auth-action-button (pressed)="continueWithPhone()">
            <span>Continuer</span>
            <svg class="auth-action-button__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </app-auth-action-button>
          <p>
            En continuant, tu acceptes nos
            <a href="#" aria-label="Conditions d'utilisation">Conditions d'utilisation</a>
            et notre
            <a href="#" aria-label="Politique de confidentialit&eacute;">Politique de confidentialit&eacute;</a>.
          </p>
        </footer>
      </div>
    </app-auth-shell>
  `,
  styleUrl: './login-page.scss'
})
export class LoginPage {
  private readonly auth = inject(AuthSessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly phoneNumber = signal('');
  protected readonly phonePlaceholder = computed(() => this.auth.activeUser().phone.replace('+221 ', ''));

  constructor() {
    this.auth.selectRole(this.auth.resolveRole(this.route.snapshot.queryParamMap.get('role')));
  }

  protected updatePhone(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.phoneNumber.set(input.value);
  }

  protected continueWithPhone(): void {
    this.auth.startPhoneLogin(this.phoneNumber());
    void this.router.navigateByUrl('/auth/code');
  }

  protected continueWithSocial(provider: SocialProvider): void {
    const user = this.auth.completeSocialLogin(provider);

    void this.router.navigateByUrl(user.homeRoute);
  }
}
