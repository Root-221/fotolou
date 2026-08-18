import { Injectable, signal, computed } from '@angular/core';
import { AppNotification } from '../models/notification';

const INITIAL_NOTIFICATIONS: readonly AppNotification[] = [
  // Client Notifications
  {
    id: 'n-client-1',
    title: "C'est bientôt votre tour !",
    message: 'Votre ticket #6 chez King Barber approche. Merci de vous présenter au salon.',
    type: 'ticket',
    recipientRole: 'client',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    isRead: false,
    targetRoute: '/client/tickets/t-1'
  },
  {
    id: 'n-client-2',
    title: 'Commande en cours de livraison',
    message: 'Votre commande CMD-2026-012 a été expédiée et sera livrée sous peu.',
    type: 'order',
    recipientRole: 'client',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isRead: false,
    targetRoute: '/client/boutique/commandes/ord-101'
  },
  {
    id: 'n-client-3',
    title: 'Offre spéciale Kérastase !',
    message: 'Profitez d\'une réduction exclusive sur les produits Kérastase dans la boutique Fotolou.',
    type: 'promo',
    recipientRole: 'client',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    targetRoute: '/client/boutique/produits/p-elixir'
  },

  // Coiffeur Notifications (Strictly /coiffeur/... routes)
  {
    id: 'n-coiffeur-1',
    title: 'Nouveau client dans la file !',
    message: 'Amadou Koulibaly vient de prendre le ticket #01 dans votre salon.',
    type: 'ticket',
    recipientRole: 'coiffeur',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isRead: false,
    targetRoute: '/coiffeur/tickets'
  },
  {
    id: 'n-coiffeur-2',
    title: 'Ticket Annulé',
    message: 'Le client Saliou a annulé son passage pour aujourd\'hui.',
    type: 'ticket',
    recipientRole: 'coiffeur',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isRead: false,
    targetRoute: '/coiffeur/tickets'
  },
  {
    id: 'n-coiffeur-3',
    title: 'Matériel livré 📦',
    message: 'Votre commande de tondeuse Wahl Magic Clip est bien arrivée au salon.',
    type: 'order',
    recipientRole: 'coiffeur',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    targetRoute: '/coiffeur/home'
  },
  {
    id: 'n-coiffeur-4',
    title: 'Bilan de la journée',
    message: 'Félicitations ! Vous avez servi 25 clients aujourd\'hui (+18% par rapport à hier).',
    type: 'system',
    recipientRole: 'coiffeur',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isRead: true,
    targetRoute: '/coiffeur/home'
  }
];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly notifications = signal<readonly AppNotification[]>(INITIAL_NOTIFICATIONS);

  readonly clientNotifications = computed(() =>
    this.notifications().filter((n) => n.recipientRole === 'client')
  );

  readonly coiffeurNotifications = computed(() =>
    this.notifications().filter((n) => n.recipientRole === 'coiffeur')
  );

  readonly clientUnreadCount = computed(() =>
    this.clientNotifications().filter((n) => !n.isRead).length
  );

  readonly coiffeurUnreadCount = computed(() =>
    this.coiffeurNotifications().filter((n) => !n.isRead).length
  );

  // Backward compatibility alias for client unread count
  readonly unreadCount = computed(() => this.clientUnreadCount());

  markAsRead(id: string): void {
    this.notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  markAllAsRead(role: 'client' | 'coiffeur' = 'client'): void {
    this.notifications.update((list) =>
      list.map((n) => (n.recipientRole === role ? { ...n, isRead: true } : n))
    );
  }

  markAllAsReadByRole(role: 'client' | 'coiffeur'): void {
    this.markAllAsRead(role);
  }

  deleteNotification(id: string): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }
}
