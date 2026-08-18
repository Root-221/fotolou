import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/product';
import { PRODUCTS_MOCK } from '../data/products.mock';

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    product: PRODUCTS_MOCK.find(p => p.id === 'p-magic-clip') ?? PRODUCTS_MOCK[3],
    quantity: 1
  },
  {
    product: PRODUCTS_MOCK.find(p => p.id === 'p-huile-tondeuse') ?? PRODUCTS_MOCK[4],
    quantity: 1
  },
  {
    product: PRODUCTS_MOCK.find(p => p.id === 'p-blade-ice') ?? PRODUCTS_MOCK[5],
    quantity: 1
  }
];

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly cartItems = signal<readonly CartItem[]>(INITIAL_CART_ITEMS);
  readonly deliveryFee = signal(2000);
  readonly discount = signal(0);

  readonly cartCount = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  });

  readonly totalPrice = computed(() => {
    return Math.max(0, this.subtotal() + this.deliveryFee() - this.discount());
  });

  addToCart(product: Product, quantity = 1): void {
    this.cartItems.update((items) => {
      const existingIndex = items.findIndex((i) => i.product.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [...items, { product, quantity }];
    });
  }

  updateQuantity(productId: string, delta: number): void {
    this.cartItems.update((items) => {
      return items
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  }

  removeFromCart(productId: string): void {
    this.cartItems.update((items) => items.filter((i) => i.product.id !== productId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
