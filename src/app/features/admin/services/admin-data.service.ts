import { Injectable, signal, computed, inject } from '@angular/core';
import { SalonService } from '../../../shared/services/salon.service';
import { TicketService } from '../../../shared/services/ticket.service';
import { ProductService } from '../../../shared/services/product.service';
import { Salon } from '../../../shared/models/salon';
import { Ticket, TicketStatus } from '../../../shared/models/ticket';
import { Product, ProductCategory } from '../../../shared/models/product';
import { Order, OrderStatus } from '../../../shared/models/order';

export interface AdminCoiffeur {
  id: string;
  name: string;
  phone: string;
  salonId: string;
  salonName: string;
  specialty: string;
  active: boolean;
  avatarUrl: string;
  ticketsServedCount: number;
}

export interface AdminClientUser {
  id: string;
  name: string;
  phone: string;
  district: string;
  ticketsCount: number;
  relativesCount: number;
  createdAt: string;
}

export interface AdminCategoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
}

export interface PlatformSettings {
  appName: string;
  contactEmail: string;
  contactPhone: string;
  commissionRate: number; // percentage
  openingTime: string;
  closingTime: string;
  allowRelativeBooking: boolean;
  maintenanceMode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private readonly salonService = inject(SalonService);
  private readonly ticketService = inject(TicketService);
  private readonly productService = inject(ProductService);

  // ── Salons State (10+ realistic Dakar salons) ──────────────
  readonly salons = signal<Salon[]>([
    {
      id: 'king-barber',
      name: 'King Barber',
      location: 'Mermoz, Dakar',
      district: 'Mermoz',
      status: 'open',
      peopleWaiting: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      phone: '+221 77 123 45 67',
      actions: [
        { label: 'Site web', icon: 'globe', href: '#' },
        { label: 'Appeler', icon: 'phone', href: 'tel:+221771234567' },
        { label: 'Itinéraire', icon: 'navigation', href: '#' },
        { label: 'Partager', icon: 'share', href: '#' }
      ]
    },
    {
      id: 'prestige-barbershop',
      name: 'Prestige Barbershop',
      location: 'Route des Almadies, Dakar',
      district: 'Almadies',
      status: 'open',
      peopleWaiting: 3,
      avatarUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
      phone: '+221 78 234 56 78',
      actions: [
        { label: 'Site web', icon: 'globe', href: '#' },
        { label: 'Appeler', icon: 'phone', href: 'tel:+221782345678' },
        { label: 'Itinéraire', icon: 'navigation', href: '#' },
        { label: 'Partager', icon: 'share', href: '#' }
      ]
    },
    {
      id: 'elegance-coiffure',
      name: 'Élégance Coiffure & Spa',
      location: 'Avenue Cheikh Anta Diop, Point E',
      district: 'Point E',
      status: 'open',
      peopleWaiting: 2,
      avatarUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      phone: '+221 76 345 67 89',
      actions: [
        { label: 'Site web', icon: 'globe', href: '#' },
        { label: 'Appeler', icon: 'phone', href: 'tel:+221763456789' },
        { label: 'Itinéraire', icon: 'navigation', href: '#' },
        { label: 'Partager', icon: 'share', href: '#' }
      ]
    },
    {
      id: 'dakar-lounge',
      name: 'Dakar Barber Lounge',
      location: 'Rue Vincens, Plateau',
      district: 'Plateau',
      status: 'open',
      peopleWaiting: 4,
      avatarUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
      phone: '+221 77 456 78 90',
      actions: [
        { label: 'Site web', icon: 'globe', href: '#' },
        { label: 'Appeler', icon: 'phone', href: 'tel:+221774567890' },
        { label: 'Itinéraire', icon: 'navigation', href: '#' },
        { label: 'Partager', icon: 'share', href: '#' }
      ]
    },
    {
      id: 'golden-scissors',
      name: 'Golden Scissors',
      location: 'Route de Ngor, Ngor',
      district: 'Ngor',
      status: 'closed',
      peopleWaiting: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
      phone: '+221 77 567 89 01',
      actions: [
        { label: 'Appeler', icon: 'phone', href: 'tel:+221775678901' },
        { label: 'Partager', icon: 'share', href: '#' }
      ]
    },
    {
      id: 'studio-221',
      name: 'Studio 221 Coiffure',
      location: 'Rond-point Liberté 6, Dakar',
      district: 'Liberté 6',
      status: 'open',
      peopleWaiting: 3,
      avatarUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
      phone: '+221 78 678 90 12',
      actions: [
        { label: 'Appeler', icon: 'phone', href: 'tel:+221786789012' },
        { label: 'Itinéraire', icon: 'navigation', href: '#' }
      ]
    },
    {
      id: 'royal-fade',
      name: 'Royal Fade Barbershop',
      location: 'Sacré-Cœur 3, Dakar',
      district: 'Sacré-Cœur',
      status: 'open',
      peopleWaiting: 1,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      phone: '+221 77 789 01 23',
      actions: [
        { label: 'Appeler', icon: 'phone', href: 'tel:+221777890123' },
        { label: 'Itinéraire', icon: 'navigation', href: '#' }
      ]
    },
    {
      id: 'teranga-barber',
      name: 'Teranga Barber Studio',
      location: 'Virage Yoff, Dakar',
      district: 'Yoff',
      status: 'open',
      peopleWaiting: 2,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      phone: '+221 76 890 12 34',
      actions: [
        { label: 'Appeler', icon: 'phone', href: 'tel:+221768901234' },
        { label: 'Partager', icon: 'share', href: '#' }
      ]
    }
  ]);

  // ── Coiffeurs State (10+ realistic Dakar barbers) ──────────
  readonly coiffeurs = signal<AdminCoiffeur[]>([
    {
      id: 'c-1',
      name: 'Moussa Ndiaye',
      phone: '+221 77 123 45 67',
      salonId: 'king-barber',
      salonName: 'King Barber',
      specialty: 'Dégradé américain, Barbe, Soin',
      active: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      ticketsServedCount: 142
    },
    {
      id: 'c-2',
      name: 'Ibrahima Diallo',
      phone: '+221 78 234 56 78',
      salonId: 'king-barber',
      salonName: 'King Barber',
      specialty: 'Coupe classique, Tresses',
      active: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      ticketsServedCount: 98
    },
    {
      id: 'c-3',
      name: 'Cheikh Sarr',
      phone: '+221 76 345 67 89',
      salonId: 'elegance-coiffure',
      salonName: 'Élégance Coiffure & Spa',
      specialty: 'Coiffure dames, Lissage, Teinture',
      active: true,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      ticketsServedCount: 87
    },
    {
      id: 'c-4',
      name: 'Ousmane Ba',
      phone: '+221 77 456 78 90',
      salonId: 'prestige-barbershop',
      salonName: 'Prestige Barbershop',
      specialty: 'Sculpture barbe, Coupe enfant',
      active: true,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      ticketsServedCount: 115
    },
    {
      id: 'c-5',
      name: 'Alioune Diop',
      phone: '+221 77 567 89 01',
      salonId: 'dakar-lounge',
      salonName: 'Dakar Barber Lounge',
      specialty: 'Fade, Waves, Contours nets',
      active: true,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      ticketsServedCount: 76
    },
    {
      id: 'c-6',
      name: 'Babacar Sy',
      phone: '+221 78 678 90 12',
      salonId: 'studio-221',
      salonName: 'Studio 221 Coiffure',
      specialty: 'Afro styling, Dreadlocks',
      active: true,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      ticketsServedCount: 64
    },
    {
      id: 'c-7',
      name: 'Modou Fall',
      phone: '+221 76 789 01 23',
      salonId: 'royal-fade',
      salonName: 'Royal Fade Barbershop',
      specialty: 'Coloration, Rasage traditionnel',
      active: true,
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      ticketsServedCount: 89
    },
    {
      id: 'c-8',
      name: 'Abdoulaye Wade',
      phone: '+221 77 890 12 34',
      salonId: 'teranga-barber',
      salonName: 'Teranga Barber Studio',
      specialty: 'Taper Fade, Traitement kératine',
      active: true,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      ticketsServedCount: 52
    }
  ]);

  // ── Categories State ──────────────────────────────────────
  readonly categories = signal<AdminCategoryItem[]>([
    {
      id: 'tondeuses',
      name: 'Tondeuses Professionnelles',
      description: 'Tondeuses de coupe et de finition haute précision.',
      image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80',
      icon: 'tondeuses'
    },
    {
      id: 'soins',
      name: 'Soins & Huiles Capillaires',
      description: 'Huiles nourrissantes, sérums et élixirs fortifiants.',
      image: 'https://images.unsplash.com/photo-1608248597359-251f49e49631?auto=format&fit=crop&w=400&q=80',
      icon: 'soins'
    },
    {
      id: 'cires',
      name: 'Cires, Gels & Pommades',
      description: 'Produits de fixation, brillance et coiffage.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
      icon: 'cires'
    },
    {
      id: 'shampoings',
      name: 'Shampoings & Après-Shampoings',
      description: 'Formules nettoyantes douces antipelliculaires et hydratantes.',
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
      icon: 'shampoings'
    },
    {
      id: 'barbe',
      name: 'Entretien de la Barbe',
      description: 'Baumes, brosses en poils de sanglier et rasoirs de précision.',
      image: 'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=400&q=80',
      icon: 'barbe'
    },
    {
      id: 'accessoires',
      name: 'Accessoires & Peignes',
      description: 'Peignes en carbone, ciseaux japonais et capes de barbier.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80',
      icon: 'accessoires'
    }
  ]);

  // ── Global Live Tickets State ──────────────────────────────
  readonly tickets = signal<Ticket[]>([
    {
      id: 't-1',
      salonId: 'king-barber',
      salonName: 'King Barber',
      ownerName: 'Mamadou Diop',
      ticketNumber: 6,
      status: 'your_turn',
      category: 'active',
      createdAt: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
      id: 't-2',
      salonId: 'king-barber',
      salonName: 'King Barber',
      ownerName: 'Amadou Sow',
      ticketNumber: 7,
      status: 'waiting',
      category: 'active',
      createdAt: new Date(Date.now() - 10 * 60000).toISOString()
    },
    {
      id: 't-3',
      salonId: 'prestige-barbershop',
      salonName: 'Prestige Barbershop',
      ownerName: 'Pape Ndiaye',
      ticketNumber: 12,
      status: 'waiting',
      category: 'active',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString()
    },
    {
      id: 't-4',
      salonId: 'elegance-coiffure',
      salonName: 'Élégance Coiffure & Spa',
      ownerName: 'Aissatou Diallo',
      ticketNumber: 3,
      status: 'waiting',
      category: 'active',
      createdAt: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      id: 't-5',
      salonId: 'dakar-lounge',
      salonName: 'Dakar Barber Lounge',
      ownerName: 'Cheikh Tidiane',
      ticketNumber: 19,
      status: 'served',
      category: 'history',
      createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
      servedAt: new Date(Date.now() - 40 * 60000).toISOString()
    },
    {
      id: 't-6',
      salonId: 'king-barber',
      salonName: 'King Barber',
      ownerName: 'Khadim Gueye',
      ticketNumber: 5,
      status: 'served',
      category: 'history',
      createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
      servedAt: new Date(Date.now() - 60 * 60000).toISOString()
    }
  ]);

  // ── Boutique Products State (Realistic catalog) ───────────
  readonly products = signal<Product[]>([
    {
      id: 'p-1',
      brand: 'Wahl Pro',
      title: 'Tondeuse Magic Clip Cordless',
      description: 'Tondeuse professionnelle sans fil à lame micro-dentée.',
      price: 65000,
      oldPrice: 75000,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80'],
      categoryId: 'tondeuses',
      inStock: true
    },
    {
      id: 'p-2',
      brand: 'Kérastase',
      title: 'Huile Nutritive Elixir Ultime 100ml',
      description: 'Huile capillaire sublimatrice enrichie aux 4 huiles précieuses.',
      price: 28000,
      rating: 4.8,
      images: ['https://images.unsplash.com/photo-1608248597359-251f49e49631?auto=format&fit=crop&w=400&q=80'],
      categoryId: 'soins',
      inStock: true
    },
    {
      id: 'p-3',
      brand: 'Redken Brews',
      title: 'Cire Modelante Haute Fixation 100ml',
      description: 'Finition mate naturelle et tenue irréprochable toute la journée.',
      price: 16500,
      rating: 4.7,
      images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80'],
      categoryId: 'cires',
      inStock: true
    },
    {
      id: 'p-4',
      brand: "L'Oréal Professionnel",
      title: 'Shampoing Expert Silver 300ml',
      description: 'Neutralise les reflets jaunes et illumine les cheveux.',
      price: 14000,
      rating: 4.6,
      images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80'],
      categoryId: 'shampoings',
      inStock: true
    },
    {
      id: 'p-5',
      brand: 'Barber Beard Co.',
      title: 'Sérum Croissance & Huile de Ricin Barbe',
      description: 'Favorise la pousse et adoucit les poils rebelles.',
      price: 12000,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=400&q=80'],
      categoryId: 'barbe',
      inStock: true
    },
    {
      id: 'p-6',
      brand: 'Andis',
      title: 'Tondeuse Finition Slimline Pro Li',
      description: 'Parfaite pour les contours ultra-précis et le traçage de barbe.',
      price: 52000,
      oldPrice: 58000,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80'],
      categoryId: 'tondeuses',
      inStock: false
    }
  ]);

  // ── Orders State ──────────────────────────────────────────
  readonly orders = signal<Order[]>([
    {
      id: 'ord-101',
      orderNumber: 'CMD-2026-101',
      items: [
        {
          product: {
            id: 'p-1',
            brand: 'Wahl Pro',
            title: 'Tondeuse Magic Clip Cordless',
            description: 'Tondeuse professionnelle sans fil.',
            price: 65000,
            rating: 4.9,
            images: ['https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80'],
            categoryId: 'tondeuses',
            inStock: true
          },
          quantity: 1
        }
      ],
      subtotal: 65000,
      deliveryFee: 2000,
      totalPrice: 67000,
      status: 'en_cours',
      orderType: 'whatsapp',
      createdAt: '2026-08-20T14:30:00Z'
    },
    {
      id: 'ord-102',
      orderNumber: 'CMD-2026-102',
      items: [
        {
          product: {
            id: 'p-2',
            brand: 'Kérastase',
            title: 'Huile Nutritive Elixir Ultime',
            description: 'Huile capillaire sublimatrice.',
            price: 28000,
            rating: 4.8,
            images: ['https://images.unsplash.com/photo-1608248597359-251f49e49631?auto=format&fit=crop&w=400&q=80'],
            categoryId: 'soins',
            inStock: true
          },
          quantity: 2
        }
      ],
      subtotal: 56000,
      deliveryFee: 2000,
      totalPrice: 58000,
      status: 'livre',
      orderType: 'call',
      createdAt: '2026-08-19T10:15:00Z'
    },
    {
      id: 'ord-103',
      orderNumber: 'CMD-2026-103',
      items: [
        {
          product: {
            id: 'p-3',
            brand: 'Redken Brews',
            title: 'Cire Modelante Haute Fixation',
            description: 'Finition mate.',
            price: 16500,
            rating: 4.7,
            images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80'],
            categoryId: 'cires',
            inStock: true
          },
          quantity: 1
        }
      ],
      subtotal: 16500,
      deliveryFee: 2000,
      totalPrice: 18500,
      status: 'en_cours',
      orderType: 'whatsapp',
      createdAt: '2026-08-21T07:10:00Z'
    }
  ]);

  // ── Clients State ─────────────────────────────────────────
  readonly clients = signal<AdminClientUser[]>([
    {
      id: 'u-1',
      name: 'Awa Diop',
      phone: '+221 77 987 65 43',
      district: 'Mermoz',
      ticketsCount: 14,
      relativesCount: 3,
      createdAt: '2026-01-15'
    },
    {
      id: 'u-2',
      name: 'Mamadou Fall',
      phone: '+221 78 876 54 32',
      district: 'Almadies',
      ticketsCount: 9,
      relativesCount: 1,
      createdAt: '2026-02-04'
    },
    {
      id: 'u-3',
      name: 'Fatou Sow',
      phone: '+221 76 765 43 21',
      district: 'Point E',
      ticketsCount: 22,
      relativesCount: 4,
      createdAt: '2026-02-18'
    },
    {
      id: 'u-4',
      name: 'Alioune Badara',
      phone: '+221 77 654 32 10',
      district: 'Plateau',
      ticketsCount: 6,
      relativesCount: 0,
      createdAt: '2026-03-01'
    },
    {
      id: 'u-5',
      name: 'Seynabou Ndiaye',
      phone: '+221 78 543 21 09',
      district: 'Ngor',
      ticketsCount: 11,
      relativesCount: 2,
      createdAt: '2026-03-12'
    }
  ]);

  // ── Platform Settings State ───────────────────────────────
  readonly settings = signal<PlatformSettings>({
    appName: 'Fotolou Admin',
    contactEmail: 'contact@fotolou.sn',
    contactPhone: '+221 77 000 00 00',
    commissionRate: 10,
    openingTime: '08:30',
    closingTime: '21:00',
    allowRelativeBooking: true,
    maintenanceMode: false
  });

  // ── Derived Global Stats ──────────────────────────────────
  readonly stats = computed(() => {
    const totalSalons = this.salons().length;
    const openSalons = this.salons().filter(s => s.status === 'open').length;
    const totalCoiffeurs = this.coiffeurs().length;
    const totalCategories = this.categories().length;
    const activeTickets = this.tickets().filter(t => t.status === 'waiting' || t.status === 'your_turn').length;
    const servedTickets = this.tickets().filter(t => t.status === 'served' || t.status === 'completed').length;
    const totalOrders = this.orders().length;
    const totalRevenue = this.orders()
      .filter(o => o.status === 'livre' || o.status === 'en_cours')
      .reduce((sum, o) => sum + o.totalPrice, 0);
    const totalClients = this.clients().length;

    return {
      totalSalons,
      openSalons,
      totalCoiffeurs,
      totalCategories,
      activeTickets,
      servedTickets,
      totalOrders,
      totalRevenue,
      totalClients
    };
  });

  // ── Salon CRUD ────────────────────────────────────────────
  addSalon(salon: Salon): void {
    this.salons.update(list => [salon, ...list]);
  }

  updateSalon(id: string, updates: Partial<Salon>): void {
    this.salons.update(list =>
      list.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  }

  deleteSalon(id: string): void {
    this.salons.update(list => list.filter(s => s.id !== id));
  }

  toggleSalonStatus(id: string): void {
    this.salons.update(list =>
      list.map(s =>
        s.id === id
          ? { ...s, status: s.status === 'open' ? 'closed' : 'open' }
          : s
      )
    );
  }

  // ── Coiffeur CRUD ─────────────────────────────────────────
  addCoiffeur(coiffeur: AdminCoiffeur): void {
    this.coiffeurs.update(list => [coiffeur, ...list]);
  }

  updateCoiffeur(id: string, updates: Partial<AdminCoiffeur>): void {
    this.coiffeurs.update(list =>
      list.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }

  deleteCoiffeur(id: string): void {
    this.coiffeurs.update(list => list.filter(c => c.id !== id));
  }

  toggleCoiffeurActive(id: string): void {
    this.coiffeurs.update(list =>
      list.map(c => (c.id === id ? { ...c, active: !c.active } : c))
    );
  }

  // ── Categories CRUD ───────────────────────────────────────
  addCategory(category: AdminCategoryItem): void {
    this.categories.update(list => [category, ...list]);
  }

  updateCategory(id: string, updates: Partial<AdminCategoryItem>): void {
    this.categories.update(list =>
      list.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }

  deleteCategory(id: string): void {
    this.categories.update(list => list.filter(c => c.id !== id));
  }

  getProductsCountByCategory(categoryId: string): number {
    return this.products().filter(p => p.categoryId === categoryId).length;
  }

  // ── Ticket Actions ────────────────────────────────────────
  callNextTicket(ticketId: string): void {
    this.tickets.update(list =>
      list.map(t => (t.id === ticketId ? { ...t, status: 'your_turn' as TicketStatus } : t))
    );
  }

  markTicketServed(ticketId: string): void {
    this.tickets.update(list =>
      list.map(t =>
        t.id === ticketId
          ? { ...t, status: 'served' as TicketStatus, category: 'history', servedAt: new Date().toISOString() }
          : t
      )
    );
    this.ticketService.serveTicket(ticketId).subscribe({ error: () => {} });
  }

  cancelTicket(ticketId: string): void {
    this.tickets.update(list =>
      list.map(t =>
        t.id === ticketId
          ? { ...t, status: 'cancelled' as TicketStatus, category: 'history', servedAt: new Date().toISOString() }
          : t
      )
    );
    this.ticketService.cancelTicket(ticketId).subscribe({ error: () => {} });
  }

  // ── Product CRUD ──────────────────────────────────────────
  addProduct(product: Product): void {
    this.products.update(list => [product, ...list]);
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    this.products.update(list =>
      list.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  }

  deleteProduct(id: string): void {
    this.products.update(list => list.filter(p => p.id !== id));
  }

  toggleProductStock(id: string): void {
    this.products.update(list =>
      list.map(p => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  }

  // ── Order Management ──────────────────────────────────────
  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.orders.update(list =>
      list.map(o => (o.id === orderId ? { ...o, status } : o))
    );
  }

  // ── Settings ──────────────────────────────────────────────
  updateSettings(updates: Partial<PlatformSettings>): void {
    this.settings.update(s => ({ ...s, ...updates }));
  }
}
