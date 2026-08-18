import { Injectable, signal, computed } from '@angular/core';
import { Ticket, TicketTab } from '../models/ticket';

const INITIAL_TICKETS: readonly Ticket[] = [
  {
    id: 't-1',
    salonId: 'king-barber',
    salonName: 'King Barber',
    ownerName: 'Moussa Kane',
    ticketNumber: 6,
    status: 'your_turn',
    category: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 't-2',
    salonId: 'salon-beaute',
    salonName: 'Salon de Beauté',
    ownerName: 'Maman',
    ticketNumber: 12,
    status: 'waiting',
    category: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 't-3',
    salonId: 'salon-beaute',
    salonName: 'Salon de Beauté',
    ownerName: 'Moi',
    ticketNumber: 8,
    status: 'waiting',
    category: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 't-4',
    salonId: 'king-barber',
    salonName: 'King Barber',
    ownerName: 'Moi',
    ticketNumber: 15,
    status: 'served',
    category: 'history',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    servedAt: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString()
  },
  {
    id: 't-5',
    salonId: 'salon-nefertiti',
    salonName: 'Salon Nefertiti',
    ownerName: 'Maman',
    ticketNumber: 3,
    status: 'cancelled',
    category: 'history',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    servedAt: new Date(Date.now() - 86400000 * 5 + 1800000).toISOString()
  }
];

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  readonly activeTab = signal<TicketTab>('active');
  readonly tickets = signal<readonly Ticket[]>(INITIAL_TICKETS);

  readonly displayedTickets = computed(() => {
    const tab = this.activeTab();
    return this.tickets().filter((ticket) => ticket.category === tab);
  });

  readonly activeCount = computed(() =>
    this.tickets().filter((t) => t.category === 'active').length
  );

  readonly historyCount = computed(() =>
    this.tickets().filter((t) => t.category === 'history').length
  );

  getTicketById(id: string | null): Ticket {
    return this.tickets().find((t) => t.id === id) ?? this.tickets()[0];
  }

  createTicket(salonId: string, salonName: string, ownerName: string): Ticket {
    const activeCount = this.tickets().filter((t) => t.category === 'active').length;
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      salonId,
      salonName,
      ownerName,
      ticketNumber: activeCount + 1,
      status: 'your_turn',
      category: 'active',
      createdAt: new Date().toISOString()
    };

    this.tickets.update((prev) => [newTicket, ...prev]);
    this.activeTab.set('active');
    return newTicket;
  }

  cancelTicket(id: string): void {
    this.tickets.update((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status: 'cancelled', category: 'history', servedAt: new Date().toISOString() }
          : ticket
      )
    );
  }
}
