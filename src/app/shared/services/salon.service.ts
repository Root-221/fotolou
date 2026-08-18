import { Injectable, signal, computed } from '@angular/core';
import { Salon } from '../models/salon';
import { TicketOwner } from '../models/ticket-owner';
import { SALONS, DEFAULT_TICKET_OWNERS, findSalonById } from '../data/salons.mock';

@Injectable({
  providedIn: 'root'
})
export class SalonService {
  readonly searchQuery = signal<string>('');
  readonly currentLocation = signal<string>('Dakar, Sénégal');
  readonly selectedOwner = signal<TicketOwner>(DEFAULT_TICKET_OWNERS[0]);
  readonly customOwnerName = signal<string>('');

  readonly salons = signal<readonly Salon[]>(SALONS);

  readonly filteredSalons = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.salons();
    }
    return this.salons().filter(
      (salon) =>
        salon.name.toLowerCase().includes(query) ||
        salon.location.toLowerCase().includes(query) ||
        salon.district.toLowerCase().includes(query)
    );
  });

  getSalonById(id: string | null): Salon {
    return findSalonById(id);
  }

  getTicketOwners(): readonly TicketOwner[] {
    return DEFAULT_TICKET_OWNERS;
  }

  selectOwner(owner: TicketOwner): void {
    this.selectedOwner.set(owner);
  }

  setCustomOwnerName(name: string): void {
    this.customOwnerName.set(name);
  }
}
