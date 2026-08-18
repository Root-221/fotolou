import { Product, ProductCategory } from '../models/product';

export const SHOP_CATEGORIES_MOCK: readonly ProductCategory[] = [
  {
    id: 'shampoings',
    name: 'Shampoings',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'brosses',
    name: 'Brosses',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'huiles',
    name: 'Huiles',
    image: 'https://images.unsplash.com/photo-1608248597263-0057e43a4522?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'tondeuses',
    name: 'Tondeuses',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'soins',
    name: 'Soins',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=200&q=80'
  }
];

export const PRODUCTS_MOCK: readonly Product[] = [
  {
    id: 'p-elixir',
    brand: 'KÉRÀSTASE',
    title: "Elixir Ultime L'Huile",
    description: 'Huile de soin capillaire sublimatrice multi-usages pour tous types de cheveux.',
    price: 32000,
    oldPrice: 42000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1608248597263-0057e43a4522?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'
    ],
    categoryId: 'huiles',
    inStock: true
  },
  {
    id: 'p-shampoing',
    brand: 'KÉRÀSTASE',
    title: 'Shampoing Hydratant',
    description: 'Shampoing hydratant intense pour cheveux secs et fragilisés.',
    price: 3200,
    oldPrice: 4500,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80'
    ],
    categoryId: 'shampoings',
    inStock: true
  },
  {
    id: 'p-brosse',
    brand: 'GHD',
    title: 'Brosse Plate Pro',
    description: 'Brosse professionnelle thermique pour un lissage rapide et brillant.',
    price: 4500,
    oldPrice: 6000,
    rating: 5.0,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
    ],
    categoryId: 'brosses',
    inStock: true
  },
  {
    id: 'p-magic-clip',
    brand: 'WAHL',
    title: 'Wahl Magic Clip',
    description: 'Tondeuse de coupe professionnelle sans fil haute précision.',
    price: 79000,
    oldPrice: 95000,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80'
    ],
    categoryId: 'tondeuses',
    inStock: true
  },
  {
    id: 'p-huile-tondeuse',
    brand: 'WAHL',
    title: 'Huile lubrifiante pour tondeuse',
    description: 'Huile de protection et lubrification pour lames de tondeuses.',
    price: 5000,
    oldPrice: 7500,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1608248597263-0057e43a4522?auto=format&fit=crop&w=600&q=80'
    ],
    categoryId: 'tondeuses',
    inStock: true
  },
  {
    id: 'p-blade-ice',
    brand: 'WAHL',
    title: 'Spray nettoyant Blade Ice',
    description: 'Spray 4-en-1 nettoyant, refroidissant et lubrifiant pour tondeuses.',
    price: 3500,
    oldPrice: 5000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80'
    ],
    categoryId: 'tondeuses',
    inStock: true
  }
];
