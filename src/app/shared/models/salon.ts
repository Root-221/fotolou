export interface SalonAction {
  readonly label: string;
  readonly icon: 'globe' | 'phone' | 'navigation' | 'share';
  readonly href?: string;
}

export interface Salon {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly district: string;
  readonly status: 'open' | 'closed';
  readonly peopleWaiting: number;
  readonly avatarUrl: string;
  readonly coverUrl: string;
  readonly galleryImages?: readonly string[];
  readonly phone?: string;
  readonly actions: readonly SalonAction[];
}
