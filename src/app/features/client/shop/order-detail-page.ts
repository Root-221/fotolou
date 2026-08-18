import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { OrderService } from '../../../shared/services/order.service';
import { Order } from '../../../shared/models/order';

@Component({
  selector: 'app-order-detail-page',
  imports: [
    ClientLayout,
    PageHeader
  ],
  template: `
    <app-client-layout [showBottomNav]="false" [hasCustomFooter]="true">
      <!-- Fixed Header Slot -->
      <app-page-header
        slot="header"
        title=""
        backRoute="/client/boutique/commandes"
      />

      <!-- Scrollable Content -->
      @if (order) {
        <div class="order-detail-page__content">
          <!-- Order Header Section -->
          <section class="order-detail-page__hero">
            <div class="order-detail-page__title-group">
              <span class="order-detail-page__label">COMMANDE</span>
              <h1 class="order-detail-page__number">#{{ formattedOrderNumber }}</h1>
            </div>

            <span class="order-detail-page__status">{{ statusLabel }}</span>
          </section>

          <!-- Items List -->
          <section class="order-detail-page__items-list">
            @for (item of order.items; track item.product.id) {
              <div class="order-detail-item">
                <img [src]="item.product.images[0]" [alt]="item.product.title" class="order-detail-item__img" />

                <div class="order-detail-item__info">
                  <strong class="order-detail-item__title">{{ item.product.title }}</strong>
                  <span class="order-detail-item__price">{{ formatPrice(item.product.price * item.quantity) }} FCFA</span>
                </div>

                <span class="order-detail-item__qty">x{{ item.quantity }}</span>
              </div>
            }
          </section>
        </div>
      }

      <!-- Fixed Bottom Summary Footer Slot -->
      @if (order) {
        <div slot="footer" class="order-detail-page__fixed-footer">
          <section class="order-detail-page__summary">
            <div class="order-detail-page__summary-row">
              <span>Sous-total</span>
              <strong>{{ formatPrice(order.subtotal) }} FCFA</strong>
            </div>

            <div class="order-detail-page__summary-row">
              <span>Livraison</span>
              <strong>{{ formatPrice(order.deliveryFee) }} FCFA</strong>
            </div>

            <div class="order-detail-page__divider"></div>

            <div class="order-detail-page__total-row">
              <span class="order-detail-page__total-label">TOTAL</span>
              <strong class="order-detail-page__total-value">{{ formatPrice(order.totalPrice) }} FCFA</strong>
            </div>
          </section>
        </div>
      }
    </app-client-layout>
  `,
  styleUrl: './order-detail-page.scss'
})
export class OrderDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  protected order: Order | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const found = this.orderService.orders().find((o) => o.id === id) ?? this.orderService.orders()[0];
    this.order = found;
  }

  protected get formattedOrderNumber(): string {
    if (!this.order) return 'COM_0001';
    return this.order.orderNumber.replace('CMD-2026-', 'COM_');
  }

  protected get statusLabel(): string {
    if (!this.order) return 'En livraison';
    switch (this.order.status) {
      case 'en_cours':
        return 'En livraison';
      case 'livre':
        return 'Livré';
      case 'annule':
        return 'Annulé';
      default:
        return 'En livraison';
    }
  }

  protected formatPrice(val: number): string {
    return val.toLocaleString('fr-FR');
  }
}
