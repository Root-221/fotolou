import { Salon } from '../models/salon';
import { TicketOwner } from '../models/ticket-owner';

export const SALONS: readonly Salon[] = [
  {
    id: 'king-barber',
    name: 'King Barber',
    location: 'Mermoz, Dakar',
    district: 'Mermoz',
    status: 'open',
    peopleWaiting: 5,
    avatarUrl: 'images/salons/king-barber-avatar.png',
    coverUrl: 'images/salons/king-barber-cover.png',
    galleryImages: [
      'images/salons/king-barber-cover.png',
      'images/salons/king-barber-cover.png',
      'images/salons/king-barber-cover.png',
      'images/salons/king-barber-cover.png'
    ],
    phone: '+221 77 862 70 52',
    actions: [
      { label: 'Site Web', icon: 'globe', href: 'https://kingbarber.sn' },
      { label: 'Appeler', icon: 'phone', href: 'tel:+221778627052' },
      { label: 'Direction', icon: 'navigation', href: 'https://maps.google.com' },
      { label: 'Partager', icon: 'share', href: '#' }
    ]
  },
  {
    id: 'king-barber-2',
    name: 'King Barber Almadies',
    location: 'Almadies, Dakar',
    district: 'Almadies',
    status: 'open',
    peopleWaiting: 15,
    avatarUrl: 'images/salons/king-barber-avatar.png',
    coverUrl: 'images/salons/king-barber-cover.png',
    actions: [
      { label: 'Site Web', icon: 'globe', href: '#' },
      { label: 'Appeler', icon: 'phone', href: 'tel:+221771234567' },
      { label: 'Direction', icon: 'navigation', href: '#' },
      { label: 'Partager', icon: 'share', href: '#' }
    ]
  },
  {
    id: 'king-barber-3',
    name: 'King Barber Plateau',
    location: 'Plateau, Dakar',
    district: 'Plateau',
    status: 'open',
    peopleWaiting: 8,
    avatarUrl: 'images/salons/king-barber-avatar.png',
    coverUrl: 'images/salons/king-barber-cover.png',
    actions: [
      { label: 'Site Web', icon: 'globe', href: '#' },
      { label: 'Appeler', icon: 'phone', href: 'tel:+221771234567' },
      { label: 'Direction', icon: 'navigation', href: '#' },
      { label: 'Partager', icon: 'share', href: '#' }
    ]
  },
  {
    id: 'king-barber-4',
    name: 'King Barber Point E',
    location: 'Point E, Dakar',
    district: 'Point E',
    status: 'open',
    peopleWaiting: 12,
    avatarUrl: 'images/salons/king-barber-avatar.png',
    coverUrl: 'images/salons/king-barber-cover.png',
    actions: [
      { label: 'Site Web', icon: 'globe', href: '#' },
      { label: 'Appeler', icon: 'phone', href: 'tel:+221771234567' },
      { label: 'Direction', icon: 'navigation', href: '#' },
      { label: 'Partager', icon: 'share', href: '#' }
    ]
  }
];

export const DEFAULT_TICKET_OWNERS: readonly TicketOwner[] = [
  {
    id: 'self',
    type: 'self',
    name: 'Moi (Bakary)',
    subtitle: '+221 77 862 70 52',
    avatarInitials: 'B'
  },
  {
    id: 'maman',
    type: 'relative',
    name: 'Maman',
    subtitle: 'Famille'
  },
  {
    id: 'custom',
    type: 'custom',
    name: 'Autre personne',
    subtitle: 'Saisir un nouveau nom',
    isCustomInput: true
  }
];

export function findSalonById(id: string | null): Salon {
  return SALONS.find((salon) => salon.id === id) ?? SALONS[0];
}
