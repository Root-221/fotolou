import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderStatus, OrderType } from '../models/order';
import { CartItem } from '../models/product';
import { PRODUCTS_MOCK } from '../data/products.mock';

const INITIAL_ORDERS_MOCK: readonly Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'CMD-2026-012',
    items: [
      {
        product: PRODUCTS_MOCK[0], // Elixir Ultime
        quantity: 1
      }
    ],
    subtotal: 32000,
    deliveryFee: 2000,
    totalPrice: 34000,
    status: 'en_cours',
    orderType: 'whatsapp',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ord-100',
    orderNumber: 'CMD-2026-008',
    items: [
      {
        product: PRODUCTS_MOCK[3], // Wahl Magic Clip
        quantity: 1
      },
      {
        product: PRODUCTS_MOCK[4], // Huile
        quantity: 1
      }
    ],
    subtotal: 84000,
    deliveryFee: 2000,
    totalPrice: 86000,
    status: 'livre',
    orderType: 'whatsapp',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  readonly orders = signal<readonly Order[]>(INITIAL_ORDERS_MOCK);
  readonly phoneNumber = '+221 77 862 70 52';
  readonly whatsappPhone = '221778627052';

  readonly activeOrders = computed(() =>
    this.orders().filter((o) => o.status === 'en_cours')
  );

  readonly historyOrders = computed(() =>
    this.orders().filter((o) => o.status === 'livre' || o.status === 'annule')
  );

  createOrder(
    items: readonly CartItem[],
    subtotal: number,
    deliveryFee: number,
    totalPrice: number,
    orderType: OrderType
  ): Order {
    const nextSeq = this.orders().length + 13;
    const orderNum = `CMD-2026-${nextSeq.toString().padStart(3, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      items: [...items],
      subtotal,
      deliveryFee,
      totalPrice,
      status: 'en_cours',
      orderType,
      createdAt: new Date().toISOString()
    };

    this.orders.update((prev) => [newOrder, ...prev]);
    return newOrder;
  }

  /**
   * Message WhatsApp pour PASSER une nouvelle commande
   */
  getNewOrderWhatsAppUrl(order: Order): string {
    const itemListText = order.items
      .map((item) => `• ${item.product.title} (x${item.quantity}) - ${(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA`)
      .join('\n');

    const message = `Bonjour Fotolou ! 🛍️\nJe souhaite passer une nouvelle commande n° *${order.orderNumber}* :\n\n${itemListText}\n\n*Sous-total :* ${order.subtotal.toLocaleString('fr-FR')} FCFA\n*Livraison :* ${order.deliveryFee.toLocaleString('fr-FR')} FCFA\n*TOTAL :* ${order.totalPrice.toLocaleString('fr-FR')} FCFA\n\nMerci de me confirmer la prise en charge de ma commande !`;

    return `https://wa.me/${this.whatsappPhone}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Message WhatsApp pour FAIRE LE SUIVI d'une commande existante
   */
  getOrderTrackingWhatsAppUrl(order: Order): string {
    const statusText = order.status === 'en_cours' ? 'En cours de livraison' : order.status === 'livre' ? 'Livré' : 'Annulé';

    const message = `Bonjour Fotolou ! 📦\nJe souhaite faire le suivi de ma commande n° *${order.orderNumber}* (Statut : ${statusText}).\n\n*Montant total :* ${order.totalPrice.toLocaleString('fr-FR')} FCFA\n\nPourriez-vous m'informer de l'avancement de ma livraison s'il vous plaît ? Merci !`;

    return `https://wa.me/${this.whatsappPhone}?text=${encodeURIComponent(message)}`;
  }

  getCallUrl(): string {
    return `tel:+${this.whatsappPhone}`;
  }
}
