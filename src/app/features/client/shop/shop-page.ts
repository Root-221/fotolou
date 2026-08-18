import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { SearchBar } from '../../../shared/components/search-bar/search-bar';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { CartService } from '../../../shared/services/cart.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { PRODUCTS_MOCK, SHOP_CATEGORIES_MOCK } from '../../../shared/data/products.mock';

@Component({
  selector: 'app-shop-page',
  imports: [
    ClientLayout,
    SearchBar,
    ProductCard,
    RouterLink
  ],
  template: `
    <app-client-layout activeNav="shop" [hasHeaderSlot]="true">
      <!-- Fixed Header Slot -->
      <header slot="header" class="shop-header">
        <h1 class="shop-header__title">Fotolou Boutique</h1>

        <!-- Header Actions: Notification Bell + Cart Button -->
        <div class="shop-header__actions">
          <!-- Notification Bell Button -->
          <button
            type="button"
            class="shop-header__icon-btn"
            (click)="goToNotifications()"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            @if (notificationService.unreadCount() > 0) {
              <span class="shop-header__unread-dot"></span>
            }
          </button>

          <!-- Cart button with badge count -->
          <a routerLink="/client/boutique/panier" class="shop-header__cart-btn" aria-label="Mon Panier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            @if (cartService.cartCount() > 0) {
              <span class="shop-header__cart-badge">{{ cartService.cartCount() }}</span>
            }
          </a>
        </div>
      </header>

      <!-- Scrollable Content -->
      <div class="shop-page__content">
        <!-- Search Input -->
        <div class="shop-page__search">
          <app-search-bar
            placeholder="Rechercher un produit..."
            [value]="searchQuery()"
            (valueChange)="searchQuery.set($event)"
          />
        </div>

        <!-- Categories Section -->
        <section class="shop-page__categories-section">
          <h2 class="shop-page__section-title">Catégories</h2>
          <div class="shop-page__categories-scroll">
            @for (cat of categories; track cat.id) {
              <button
                type="button"
                class="shop-page__category-item"
                [class.shop-page__category-item--active]="selectedCategory() === cat.id"
                (click)="toggleCategory(cat.id)"
              >
                <div class="shop-page__category-thumb">
                  <img [src]="cat.image" [alt]="cat.name" loading="lazy" />
                </div>
                <span class="shop-page__category-name">{{ cat.name }}</span>
              </button>
            }
          </div>
        </section>

        <!-- Products Grid Section -->
        <section class="shop-page__products-section">
          <h2 class="shop-page__section-title">Produits</h2>

          <div class="shop-page__products-grid">
            @for (product of filteredProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>

          @if (filteredProducts().length === 0) {
            <p class="shop-page__empty">Aucun produit ne correspond à votre recherche.</p>
          }
        </section>
      </div>
    </app-client-layout>
  `,
  styleUrl: './shop-page.scss'
})
export class ShopPage {
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly notificationService = inject(NotificationService);

  protected readonly categories = SHOP_CATEGORIES_MOCK;
  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal<string | null>(null);

  protected readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    return PRODUCTS_MOCK.filter((p) => {
      const matchesCat = cat ? p.categoryId === cat : true;
      const matchesQuery = query
        ? p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        : true;
      return matchesCat && matchesQuery;
    });
  });

  protected toggleCategory(catId: string): void {
    if (this.selectedCategory() === catId) {
      this.selectedCategory.set(null);
    } else {
      this.selectedCategory.set(catId);
    }
  }

  protected goToNotifications(): void {
    this.router.navigate(['/client/notifications']);
  }
}
