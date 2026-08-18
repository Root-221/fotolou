import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { Product } from '../../../shared/models/product';
import { PRODUCTS_MOCK } from '../../../shared/data/products.mock';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-product-detail-page',
  imports: [
    ClientLayout,
    PageHeader,
    RouterLink
  ],
  template: `
    <app-client-layout [showBottomNav]="false" [hasCustomFooter]="true">
      <!-- Fixed Header Slot -->
      <div slot="header" class="product-detail-header">
        <app-page-header title="" backRoute="/client/boutique" />

        <a routerLink="/client/boutique/panier" class="product-detail-header__cart-btn" aria-label="Mon Panier">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          @if (cartService.cartCount() > 0) {
            <span class="product-detail-header__cart-badge">{{ cartService.cartCount() }}</span>
          }
        </a>
      </div>

      <!-- Scrollable Main Content -->
      <div class="product-detail-page__content">
        <!-- Gallery -->
        <section class="product-detail-page__gallery">
          <div class="product-detail-page__main-image-wrap">
            <img [src]="selectedImage()" [alt]="product.title" class="product-detail-page__main-image" />
          </div>

          @if (product.images.length > 1) {
            <div class="product-detail-page__thumbnails">
              @for (img of product.images; track img) {
                <button
                  type="button"
                  class="product-detail-page__thumb-btn"
                  [class.product-detail-page__thumb-btn--active]="selectedImage() === img"
                  (click)="selectedImage.set(img)"
                >
                  <img [src]="img" [alt]="product.title" loading="lazy" />
                </button>
              }
            </div>
          }
        </section>

        <!-- Product Summary -->
        <section class="product-detail-page__info">
          <h1 class="product-detail-page__title">{{ product.title }}</h1>
          <p class="product-detail-page__description">{{ product.description }}</p>

          <!-- Price Row -->
          <div class="product-detail-page__price-row">
            <strong class="product-detail-page__price">{{ formattedPrice }}</strong>
            @if (product.oldPrice) {
              <span class="product-detail-page__old-price">{{ formattedOldPrice }}</span>
            }
          </div>

          <div class="product-detail-page__divider"></div>

          <!-- Quantity Stepper & Stock Status -->
          <div class="product-detail-page__qty-row">
            <span class="product-detail-page__qty-label">Quantité</span>

            <div class="product-detail-page__stepper">
              <button
                type="button"
                class="product-detail-page__stepper-btn"
                [disabled]="quantity() <= 1"
                (click)="decreaseQty()"
                aria-label="Diminuer"
              >
                &minus;
              </button>
              <span class="product-detail-page__stepper-value">{{ quantity() }}</span>
              <button
                type="button"
                class="product-detail-page__stepper-btn"
                (click)="increaseQty()"
                aria-label="Augmenter"
              >
                &#43;
              </button>
            </div>

            <span class="product-detail-page__stock-status">
              <span class="product-detail-page__stock-dot"></span>
              En stock
            </span>
          </div>
        </section>
      </div>

      <!-- Fixed Footer Slot -->
      <div slot="footer" class="product-detail-page__fixed-footer">
        <button type="button" class="product-detail-page__add-btn" (click)="addToCart()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span>Ajouter au panier</span>
        </button>
      </div>
    </app-client-layout>
  `,
  styleUrl: './product-detail-page.scss'
})
export class ProductDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);

  protected product!: Product;
  protected readonly selectedImage = signal('');
  protected readonly quantity = signal(1);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const found = PRODUCTS_MOCK.find(p => p.id === id) ?? PRODUCTS_MOCK[0];
    this.product = found;
    this.selectedImage.set(found.images[0]);
  }

  protected get formattedPrice(): string {
    return `${this.product.price.toLocaleString('fr-FR')}Fcfa`;
  }

  protected get formattedOldPrice(): string {
    return this.product.oldPrice ? `${this.product.oldPrice.toLocaleString('fr-FR')}Fcfa` : '';
  }

  protected decreaseQty(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  protected increaseQty(): void {
    this.quantity.update(q => q + 1);
  }

  protected addToCart(): void {
    this.cartService.addToCart(this.product, this.quantity());
    this.router.navigate(['/client/boutique/panier']);
  }
}
