import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { GeoLocationModal } from '../../../shared/components/geolocation-modal/geolocation-modal';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-cart-page',
  imports: [
    ClientLayout,
    PageHeader,
    GeoLocationModal,
    RouterLink
  ],
  template: `
    <app-client-layout [showBottomNav]="false" [hasCustomFooter]="true">
      <!-- Fixed Header Slot -->
      <div slot="header" class="cart-header">
        <app-page-header title="Mon panier" backRoute="/client/boutique" />

        @if (cartService.cartItems().length > 0) {
          <button type="button" class="cart-header__clear-btn" (click)="clearCart()" aria-label="Vider le panier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        }
      </div>

      <!-- Scrollable Main Content -->
      <div class="cart-page__content">
        @if (cartService.cartItems().length > 0) {
          <!-- Cart Items List -->
          <div class="cart-page__list">
            @for (item of cartService.cartItems(); track item.product.id) {
              <div class="cart-item-card">
                <img [src]="item.product.images[0]" [alt]="item.product.title" class="cart-item-card__image" />

                <div class="cart-item-card__details">
                  <strong class="cart-item-card__title">{{ item.product.title }}</strong>
                  <span class="cart-item-card__price">{{ formatPrice(item.product.price) }} FCFA</span>

                  <div class="cart-item-card__stepper">
                    <button
                      type="button"
                      class="cart-item-card__stepper-btn"
                      (click)="cartService.updateQuantity(item.product.id, -1)"
                    >
                      &minus;
                    </button>
                    <span class="cart-item-card__stepper-qty">{{ item.quantity }}</span>
                    <button
                      type="button"
                      class="cart-item-card__stepper-btn"
                      (click)="cartService.updateQuantity(item.product.id, 1)"
                    >
                      &#43;
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  class="cart-item-card__remove-btn"
                  (click)="cartService.removeFromCart(item.product.id)"
                  [attr.aria-label]="'Supprimer ' + item.product.title"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="cart-page__empty-state">
            <div class="cart-page__empty-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <p>Votre panier est vide pour le moment.</p>
            <a routerLink="/client/boutique" class="cart-page__shop-link">Découvrir la boutique</a>
          </div>
        }
      </div>

      <!-- Fixed Footer Slot: Summary & Action Button -->
      @if (cartService.cartItems().length > 0) {
        <div slot="footer" class="cart-page__fixed-footer">
          <!-- Summary Breakdown -->
          <div class="cart-summary">
            <div class="cart-summary__row">
              <span>Sous-total</span>
              <strong>{{ formatPrice(cartService.subtotal()) }} FCFA</strong>
            </div>

            <div class="cart-summary__row">
              <span>Livraison</span>
              <strong>{{ formatPrice(cartService.deliveryFee()) }} FCFA</strong>
            </div>

            <div class="cart-summary__row">
              <span>Réduction</span>
              <strong class="cart-summary__discount">- {{ formatPrice(cartService.discount()) }} FCFA</strong>
            </div>

            <div class="cart-summary__divider"></div>

            <div class="cart-summary__total-row">
              <span class="cart-summary__total-label">TOTAL</span>
              <strong class="cart-summary__total-value">{{ formatPrice(cartService.totalPrice()) }} FCFA</strong>
            </div>
          </div>

          <!-- Checkout Continue Button -->
          <button type="button" class="cart-page__continue-btn" (click)="openGeoModal()">
            Continuer
          </button>
        </div>
      }
    </app-client-layout>

    <!-- Geolocation Permission Modal (Screenshot 4) -->
    <app-geolocation-modal
      [isOpen]="showGeoModal()"
      (authorize)="proceedToConfirmation()"
      (later)="proceedToConfirmation()"
    />
  `,
  styleUrl: './cart-page.scss'
})
export class CartPage {
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);

  protected readonly showGeoModal = signal(false);

  protected formatPrice(val: number): string {
    return val.toLocaleString('fr-FR');
  }

  protected clearCart(): void {
    this.cartService.clearCart();
  }

  protected openGeoModal(): void {
    this.showGeoModal.set(true);
  }

  protected proceedToConfirmation(): void {
    this.showGeoModal.set(false);
    this.router.navigate(['/client/boutique/commande/confirmation']);
  }
}
