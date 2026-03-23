/**
 * Mock properties data — used as fallback when the API is unavailable.
 */
export interface MockProperty {
  id: number;
  title: string;
  location: string;
  city: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  badge: string | null;
  superhost: boolean;
  lat: number;
  lng: number;
  trustStars: number;
  isVerified: boolean;
  weeklyDiscount: number;
  monthlyDiscount: number;
}

export const MOCK_PROPERTIES: MockProperty[] = [
  {
    id: 1, title: 'Villa Vue Mer Luxueuse', location: 'Tipaza', city: 'Tipaza',
    price: 15000, rating: 4.9, reviews: 127, type: 'villa', guests: 8, bedrooms: 4, bathrooms: 3,
    amenities: ['wifi', 'pool', 'parking', 'ac', 'kitchen', 'garden'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
    ],
    badge: 'superhost', superhost: true, lat: 36.5903, lng: 2.4483,
    trustStars: 5, isVerified: true, weeklyDiscount: 15, monthlyDiscount: 25,
  },
  {
    id: 2, title: 'Appartement Moderne Centre-Ville', location: 'Alger Centre', city: 'Alger',
    price: 8000, rating: 4.7, reviews: 89, type: 'apartment', guests: 4, bedrooms: 2, bathrooms: 1,
    amenities: ['wifi', 'ac', 'tv', 'kitchen', 'washer'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
    ],
    badge: 'popular', superhost: false, lat: 36.7538, lng: 3.0588,
    trustStars: 3, isVerified: true, weeklyDiscount: 10, monthlyDiscount: 0,
  },
  {
    id: 3, title: 'Maison Traditionnelle Casbah', location: 'Constantine', city: 'Constantine',
    price: 12000, rating: 4.8, reviews: 64, type: 'house', guests: 6, bedrooms: 3, bathrooms: 2,
    amenities: ['wifi', 'parking', 'kitchen', 'garden', 'security'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop',
    ],
    badge: null, superhost: true, lat: 36.3650, lng: 6.6147,
    trustStars: 5, isVerified: true, weeklyDiscount: 0, monthlyDiscount: 20,
  },
  {
    id: 4, title: 'Chalet de Montagne Panoramique', location: 'Tikjda', city: 'Bouira',
    price: 10000, rating: 4.6, reviews: 42, type: 'chalet', guests: 5, bedrooms: 2, bathrooms: 1,
    amenities: ['wifi', 'parking', 'kitchen', 'garden'],
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop',
    ],
    badge: 'new', superhost: false, lat: 36.4266, lng: 3.9911,
    trustStars: 1, isVerified: true, weeklyDiscount: 0, monthlyDiscount: 0,
  },
  {
    id: 5, title: 'Riad Authentique avec Patio', location: 'Ghardaïa', city: 'Ghardaïa',
    price: 9500, rating: 4.9, reviews: 53, type: 'riad', guests: 4, bedrooms: 2, bathrooms: 2,
    amenities: ['wifi', 'ac', 'breakfast', 'garden', 'security'],
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d8f568e3f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
    ],
    badge: 'superhost', superhost: true, lat: 32.4912, lng: 3.6734,
    trustStars: 5, isVerified: true, weeklyDiscount: 12, monthlyDiscount: 22,
  },
  {
    id: 6, title: 'Hôtel Boutique Front de Mer', location: 'Oran', city: 'Oran',
    price: 6500, rating: 4.5, reviews: 210, type: 'hotel', guests: 2, bedrooms: 1, bathrooms: 1,
    amenities: ['wifi', 'ac', 'tv', 'breakfast', 'pool', 'security'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
    ],
    badge: 'popular', superhost: false, lat: 35.6969, lng: -0.6331,
    trustStars: 2, isVerified: true, weeklyDiscount: 0, monthlyDiscount: 15,
  },
  {
    id: 7, title: 'Villa Jardin Exotique', location: 'Béjaïa', city: 'Béjaïa',
    price: 18000, rating: 4.8, reviews: 76, type: 'villa', guests: 10, bedrooms: 5, bathrooms: 3,
    amenities: ['wifi', 'pool', 'parking', 'ac', 'kitchen', 'garden', 'security'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop',
    ],
    badge: null, superhost: true, lat: 36.7509, lng: 5.0567,
    trustStars: 3, isVerified: true, weeklyDiscount: 10, monthlyDiscount: 18,
  },
  {
    id: 8, title: 'Studio Cosy Centre Historique', location: 'Annaba', city: 'Annaba',
    price: 4500, rating: 4.4, reviews: 38, type: 'apartment', guests: 2, bedrooms: 1, bathrooms: 1,
    amenities: ['wifi', 'ac', 'tv', 'kitchen'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop',
    ],
    badge: 'new', superhost: false, lat: 36.9000, lng: 7.7667,
    trustStars: 0, isVerified: false, weeklyDiscount: 0, monthlyDiscount: 0,
  },
  {
    id: 9, title: 'Maison Kabyle Authentique', location: 'Tizi Ouzou', city: 'Tizi Ouzou',
    price: 7000, rating: 4.7, reviews: 31, type: 'house', guests: 6, bedrooms: 3, bathrooms: 2,
    amenities: ['wifi', 'parking', 'kitchen', 'garden'],
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop',
    ],
    badge: null, superhost: false, lat: 36.7169, lng: 4.0497,
    trustStars: 2, isVerified: true, weeklyDiscount: 8, monthlyDiscount: 0,
  },
  {
    id: 10, title: 'Penthouse Vue Panoramique', location: 'Alger', city: 'Alger',
    price: 22000, rating: 5.0, reviews: 18, type: 'apartment', guests: 4, bedrooms: 3, bathrooms: 2,
    amenities: ['wifi', 'ac', 'tv', 'kitchen', 'washer', 'pool', 'security', 'parking'],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&auto=format&fit=crop',
    ],
    badge: 'superhost', superhost: true, lat: 36.7630, lng: 3.0506,
    trustStars: 5, isVerified: true, weeklyDiscount: 10, monthlyDiscount: 20,
  },
  {
    id: 11, title: 'Chalet Bord de Lac', location: 'El Kala', city: 'El Tarf',
    price: 11000, rating: 4.6, reviews: 55, type: 'chalet', guests: 6, bedrooms: 3, bathrooms: 2,
    amenities: ['wifi', 'parking', 'kitchen', 'garden', 'pool'],
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop',
    ],
    badge: null, superhost: false, lat: 36.8956, lng: 8.4431,
    trustStars: 0, isVerified: false, weeklyDiscount: 0, monthlyDiscount: 0,
  },
  {
    id: 12, title: 'Riad Luxueux Sahara', location: 'Tamanrasset', city: 'Tamanrasset',
    price: 14000, rating: 4.9, reviews: 29, type: 'riad', guests: 8, bedrooms: 4, bathrooms: 3,
    amenities: ['wifi', 'ac', 'breakfast', 'garden', 'security', 'pool'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d8f568e3f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
    ],
    badge: 'superhost', superhost: true, lat: 22.7850, lng: 5.5228,
    trustStars: 3, isVerified: true, weeklyDiscount: 15, monthlyDiscount: 30,
  },
];
