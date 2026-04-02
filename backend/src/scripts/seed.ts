/**
 * Database Seed Script
 * 
 * Creates sample users, profiles, properties, bookings, reviews,
 * verification documents, notifications, favorites, rankings, comments,
 * tourism services, manager assignments, and permissions.
 * 
 * Usage: npm run seed
 */
import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
const uuidv4 = () => crypto.randomUUID();

dotenvConfig({ path: '.env' });

// ─── Data Source ────────────────────────────────────────────────────────────

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

const MEDIA_BASE = '/media';

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const hashPassword = async (pwd: string) => bcrypt.hash(pwd, 10);

const futureDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

const pastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// ─── Seed Data Constants ────────────────────────────────────────────────────

const HOUSE_RULES = [
  'No smoking', 'No pets', 'No parties', 'Quiet after 22:00',
  'No shoes inside', 'Respect neighbors', 'Keep clean',
];

const PAYMENT_METHODS = ['cash', 'ccp', 'baridi_mob', 'bank_transfer', 'edahabia', 'cib'];
const CANCELLATION_POLICIES = ['flexible', 'moderate', 'strict'];
const DOC_TYPES = ['national_id', 'passport', 'permit', 'notarized_deed', 'land_registry', 'utility_bill'];

// ─── Seed Functions ─────────────────────────────────────────────────────────

async function seedUsers(ds: DataSource): Promise<number[]> {
  const qr = ds.createQueryRunner();
  const pwd = await hashPassword('Password123!');
  const token = 'seed-token-placeholder';

  // Role logic:
  // - hyper_admin / hyper_manager keep their role in users.roles
  // - admin / manager / guest all have 'user' in users.roles (actual roles in user_roles table)
  const users = [
    { email: 'hyper_admin_byootdz@yopmail.com', phoneNbr: '+213550000000', cardId: 'CID0000', passportId: 'P000', roles: 'hyper_admin', firstName: 'Sofiane', lastName: 'Hamidi', title: 'Mr', city: 'Alger', country: 'Algeria' },
    { email: 'hyper_manager_byootdz@yopmail.com', phoneNbr: '+213550000001', cardId: 'CID0001', passportId: 'P001', roles: 'hyper_manager', firstName: 'Karim', lastName: 'Bensalah', title: 'Mr', city: 'Alger', country: 'Algeria' },
    { email: 'admin1_byootdz@yopmail.com', phoneNbr: '+213550000002', cardId: 'CID0002', passportId: 'P002', roles: 'user', firstName: 'Amina', lastName: 'Mebarki', title: 'Mme', city: 'Oran', country: 'Algeria' },
    { email: 'admin2_byootdz@yopmail.com', phoneNbr: '+213550000003', cardId: 'CID0003', passportId: 'P003', roles: 'user', firstName: 'Yacine', lastName: 'Khelifi', title: 'Mr', city: 'Tipaza', country: 'Algeria' },
    { email: 'manager1_byootdz@yopmail.com', phoneNbr: '+213550000004', cardId: 'CID0004', passportId: 'P004', roles: 'user', firstName: 'Lina', lastName: 'Bouaziz', title: 'Mme', city: 'Constantine', country: 'Algeria' },
    { email: 'manager2_byootdz@yopmail.com', phoneNbr: '+213550000005', cardId: 'CID0005', passportId: 'P005', roles: 'user', firstName: 'Omar', lastName: 'Touati', title: 'Mr', city: 'Ghardaïa', country: 'Algeria' },
    { email: 'guest1_byootdz@yopmail.com', phoneNbr: '+213550000006', cardId: 'CID0006', passportId: 'P006', roles: 'user', firstName: 'Fatima', lastName: 'Zeroual', title: 'Mme', city: 'Béjaïa', country: 'Algeria' },
    { email: 'guest2_byootdz@yopmail.com', phoneNbr: '+213550000007', cardId: 'CID0007', passportId: 'P007', roles: 'user', firstName: 'Sara', lastName: 'Hadj', title: 'Mme', city: 'Annaba', country: 'Algeria' },
    { email: 'guest3_byootdz@yopmail.com', phoneNbr: '+213550000008', cardId: 'CID0008', passportId: 'P008', roles: 'user', firstName: 'Raouf', lastName: 'Brahimi', title: 'Mr', city: 'Tizi Ouzou', country: 'Algeria' },
    { email: 'guest4_byootdz@yopmail.com', phoneNbr: '+213550000009', cardId: 'CID0009', passportId: 'P009', roles: 'user', firstName: 'Nadia', lastName: 'Ferhat', title: 'Mme', city: 'Bouira', country: 'Algeria' },
    { email: 'guest5_byootdz@yopmail.com', phoneNbr: '+213550000010', cardId: 'CID0010', passportId: 'P010', roles: 'user', firstName: 'Mehdi', lastName: 'Ziani', title: 'Mr', city: 'Alger', country: 'Algeria' },
  ];

  const userIds: number[] = [];
  for (const u of users) {
    const result = await qr.query(
      `INSERT INTO users (email, phoneNbr, cardId, passportId, roles, firstName, lastName, password, token, title, city, country, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [u.email, u.phoneNbr, u.cardId, u.passportId, u.roles, u.firstName, u.lastName, pwd, token, u.title, u.city, u.country, true]
    );
    userIds.push(result.insertId);
  }
  await qr.release();
  console.log(`✅ Created ${userIds.length} users`);
  return userIds;
}

async function seedUserRoles(ds: DataSource, userIds: number[]) {
  const qr = ds.createQueryRunner();
  // Roles in user_roles table reflect actual business roles
  // hyper_admin/hyper_manager: their role + user
  // admin: owns properties, can assign managers
  // manager: manages assigned properties from admins
  // guests: just 'user' role
  // Note: an admin/manager can also be a guest (book other properties)
  const roles = [
    { userId: userIds[0], role: 'hyper_admin' },
    { userId: userIds[0], role: 'user' },
    { userId: userIds[1], role: 'hyper_manager' },
    { userId: userIds[1], role: 'user' },
    { userId: userIds[2], role: 'admin' },    // admin1 - owns properties
    { userId: userIds[2], role: 'user' },     // can also be a guest
    { userId: userIds[3], role: 'admin' },    // admin2 - owns properties  
    { userId: userIds[3], role: 'user' },     // can also be a guest
    { userId: userIds[4], role: 'manager' },  // manager1 - manages for admin1
    { userId: userIds[4], role: 'user' },     // can also be a guest
    { userId: userIds[5], role: 'manager' },  // manager2 - manages for admin2 & admin1
    { userId: userIds[5], role: 'user' },     // can also be a guest
    { userId: userIds[6], role: 'user' },     // guest only
    { userId: userIds[7], role: 'user' },     // guest only
    { userId: userIds[8], role: 'user' },     // guest only
    { userId: userIds[9], role: 'user' },     // guest only
    { userId: userIds[10], role: 'user' },    // guest only
  ];
  for (const r of roles) {
    await qr.query(
      `INSERT INTO user_roles (id, userId, role) VALUES (?, ?, ?)`,
      [uuidv4(), r.userId, r.role]
    );
  }
  await qr.release();
  console.log(`✅ Created ${roles.length} user roles`);
}

async function seedProfiles(ds: DataSource, userIds: number[]) {
  const qr = ds.createQueryRunner();
  const wilayas = ['Alger', 'Alger', 'Oran', 'Tipaza', 'Constantine', 'Ghardaïa', 'Béjaïa', 'Annaba', 'Tizi Ouzou', 'Bouira', 'Alger'];
  const names = ['Sofiane H.', 'Karim B.', 'Amina M.', 'Yacine K.', 'Lina B.', 'Omar T.', 'Fatima Z.', 'Sara H.', 'Raouf B.', 'Nadia F.', 'Mehdi Z.'];
  const bios = [
    'Hyper Admin — full platform oversight and control.',
    'Hyper Manager — global property management.',
    'Admin — owns and manages properties in Oran region.',
    'Admin — owns and manages properties in Tipaza region.',
    'Manager — manages assigned properties for admins.',
    'Manager — manages assigned properties for multiple admins.',
    'Guest — frequent traveler across Algeria.',
    'Guest — mountain and nature enthusiast.',
    'Guest — city explorer and reviewer.',
    'Guest — nature photographer.',
    'Guest — penthouse lover.',
  ];

  for (let i = 0; i < userIds.length; i++) {
    const isHost = i >= 2 && i <= 5; // admins and managers are hosts
    await qr.query(
      `INSERT INTO profiles (id, userId, displayName, avatarUrl, bio, city, wilaya, country, languages, isHost, isSuperhost, identityVerified, preferredLanguage, preferredCurrency)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(), userIds[i], names[i],
        `${MEDIA_BASE}/avatars/user_${i + 1}.jpg`,
        bios[i],
        wilayas[i], wilayas[i], 'Algeria',
        JSON.stringify(['fr', 'ar', ...(i % 2 === 0 ? ['en'] : [])]),
        isHost, isHost && (i === 2 || i === 3), i < 6,
        i % 3 === 0 ? 'ar' : 'fr', 'DZD',
      ]
    );
  }
  await qr.release();
  console.log(`✅ Created ${userIds.length} profiles`);
}

async function seedProperties(ds: DataSource, adminIds: number[]): Promise<string[]> {
  const qr = ds.createQueryRunner();
  const propertyIds: string[] = [];

  // admin1 (index 2) owns properties 0-5, admin2 (index 3) owns properties 6-11
  const properties = [
    {
      hostId: adminIds[0], // admin1
      title: 'Villa Vue Mer Luxueuse',
      desc: JSON.stringify({
        fr: `Magnifique villa moderne située sur les hauteurs de Tipaza avec une vue imprenable sur la mer Méditerranée.`,
        en: `Magnificent modern villa perched on the heights of Tipaza with breathtaking views of the Mediterranean Sea.`,
        ar: `فيلا عصرية رائعة تقع على مرتفعات تيبازة مع إطلالة خلابة على البحر الأبيض المتوسط.`,
      }),
      type: 'villa', wilaya: 'Tipaza', city: 'Tipaza',
      latitude: 36.5903, longitude: 2.4483, price: 15000,
      beds: 5, bedrooms: 4, bathrooms: 3, maxGuests: 8,
      trust: 5, verified: true, superhost: true, badge: 'superhost',
      amenities: ['wifi', 'pool', 'parking', 'ac', 'kitchen', 'garden'],
      weeklyDiscount: 15, monthlyDiscount: 25,
      rating: 4.9, reviewCount: 127, bookingCount: 85,
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[0], // admin1
      title: 'Appartement Moderne Centre-Ville',
      desc: JSON.stringify({
        fr: 'Appartement moderne et lumineux au cœur d\'Alger Centre.',
        en: 'Modern and bright apartment in the heart of Algiers city center.',
        ar: 'شقة عصرية ومشرقة في قلب وسط مدينة الجزائر.',
      }),
      type: 'apartment', wilaya: 'Alger', city: 'Alger Centre',
      latitude: 36.7538, longitude: 3.0588, price: 8000,
      beds: 2, bedrooms: 2, bathrooms: 1, maxGuests: 4,
      trust: 3, verified: true, superhost: false, badge: 'popular',
      amenities: ['wifi', 'ac', 'tv', 'kitchen', 'washer'],
      weeklyDiscount: 10, monthlyDiscount: 0,
      rating: 4.7, reviewCount: 89, bookingCount: 62,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[0], // admin1
      title: 'Maison Traditionnelle Casbah',
      desc: JSON.stringify({
        fr: 'Magnifique maison traditionnelle au cœur de la vieille ville de Constantine.',
        en: 'Magnificent traditional house in the heart of Constantine\'s old city.',
        ar: 'منزل تقليدي رائع في قلب المدينة القديمة بقسنطينة.',
      }),
      type: 'house', wilaya: 'Constantine', city: 'Constantine',
      latitude: 36.3650, longitude: 6.6147, price: 12000,
      beds: 3, bedrooms: 3, bathrooms: 2, maxGuests: 6,
      trust: 5, verified: true, superhost: true, badge: null,
      amenities: ['wifi', 'parking', 'kitchen', 'garden', 'security'],
      weeklyDiscount: 0, monthlyDiscount: 20,
      rating: 4.8, reviewCount: 64, bookingCount: 45,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[0], // admin1
      title: 'Chalet de Montagne Panoramique',
      desc: JSON.stringify({
        fr: 'Chalet en bois confortable au cœur de la forêt de Tikjda.',
        en: 'Comfortable wooden chalet in the heart of Tikjda forest.',
        ar: 'شاليه خشبي مريح في قلب غابة تيكجدة.',
      }),
      type: 'chalet', wilaya: 'Bouira', city: 'Tikjda',
      latitude: 36.4266, longitude: 3.9911, price: 10000,
      beds: 3, bedrooms: 2, bathrooms: 1, maxGuests: 5,
      trust: 1, verified: true, superhost: false, badge: 'new',
      amenities: ['wifi', 'parking', 'kitchen', 'garden'],
      weeklyDiscount: 0, monthlyDiscount: 0,
      rating: 4.6, reviewCount: 42, bookingCount: 28,
      images: [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[0], // admin1
      title: 'Riad Authentique avec Patio',
      desc: JSON.stringify({
        fr: 'Riad traditionnel du M\'zab avec patio intérieur et fontaine.',
        en: 'Traditional M\'zab riad with interior patio and fountain.',
        ar: 'رياض تقليدي من وادي ميزاب مع فناء داخلي ونافورة.',
      }),
      type: 'riad', wilaya: 'Ghardaïa', city: 'Ghardaïa',
      latitude: 32.4912, longitude: 3.6734, price: 9500,
      beds: 3, bedrooms: 2, bathrooms: 2, maxGuests: 4,
      trust: 5, verified: true, superhost: true, badge: 'superhost',
      amenities: ['wifi', 'ac', 'breakfast', 'garden', 'security'],
      weeklyDiscount: 12, monthlyDiscount: 22,
      rating: 4.9, reviewCount: 53, bookingCount: 38,
      images: [
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590490360182-c33d8f568e3f?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[0], // admin1
      title: 'Hôtel Boutique Front de Mer',
      desc: JSON.stringify({
        fr: 'Hôtel boutique charmant avec vue directe sur la mer à Oran.',
        en: 'Charming boutique hotel with direct sea views in Oran.',
        ar: 'فندق بوتيكي ساحر مع إطلالة مباشرة على البحر في وهران.',
      }),
      type: 'hotel', wilaya: 'Oran', city: 'Oran',
      latitude: 35.6969, longitude: -0.6331, price: 6500,
      beds: 1, bedrooms: 1, bathrooms: 1, maxGuests: 2,
      trust: 2, verified: true, superhost: false, badge: 'popular',
      amenities: ['wifi', 'ac', 'tv', 'breakfast', 'pool', 'security'],
      weeklyDiscount: 0, monthlyDiscount: 15,
      rating: 4.5, reviewCount: 210, bookingCount: 180,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[1], // admin2
      title: 'Villa Jardin Exotique',
      desc: JSON.stringify({
        fr: 'Villa spacieuse avec jardin tropical luxuriant à Béjaïa.',
        en: 'Spacious villa with lush tropical garden in Béjaïa.',
        ar: 'فيلا واسعة مع حديقة استوائية خضراء في بجاية.',
      }),
      type: 'villa', wilaya: 'Béjaïa', city: 'Béjaïa',
      latitude: 36.7509, longitude: 5.0567, price: 18000,
      beds: 6, bedrooms: 5, bathrooms: 3, maxGuests: 10,
      trust: 3, verified: true, superhost: true, badge: null,
      amenities: ['wifi', 'pool', 'parking', 'ac', 'kitchen', 'garden', 'security'],
      weeklyDiscount: 10, monthlyDiscount: 18,
      rating: 4.8, reviewCount: 76, bookingCount: 52,
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[1], // admin2
      title: 'Studio Cosy Centre Historique',
      desc: JSON.stringify({
        fr: 'Studio moderne et fonctionnel au cœur du centre historique d\'Annaba.',
        en: 'Modern and functional studio in the heart of Annaba\'s historic center.',
        ar: 'ستوديو عصري وعملي في قلب المركز التاريخي لعنابة.',
      }),
      type: 'apartment', wilaya: 'Annaba', city: 'Annaba',
      latitude: 36.9000, longitude: 7.7667, price: 4500,
      beds: 1, bedrooms: 1, bathrooms: 1, maxGuests: 2,
      trust: 0, verified: false, superhost: false, badge: 'new',
      amenities: ['wifi', 'ac', 'tv', 'kitchen'],
      weeklyDiscount: 0, monthlyDiscount: 0,
      rating: 4.4, reviewCount: 38, bookingCount: 22,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[1], // admin2
      title: 'Maison Kabyle Authentique',
      desc: JSON.stringify({
        fr: 'Maison kabyle traditionnelle rénovée avec goût à Tizi Ouzou.',
        en: 'Tastefully renovated traditional Kabyle house in Tizi Ouzou.',
        ar: 'منزل قبائلي تقليدي مُجدد بذوق رفيع في تيزي وزو.',
      }),
      type: 'house', wilaya: 'Tizi Ouzou', city: 'Tizi Ouzou',
      latitude: 36.7169, longitude: 4.0497, price: 7000,
      beds: 3, bedrooms: 3, bathrooms: 2, maxGuests: 6,
      trust: 2, verified: true, superhost: false, badge: null,
      amenities: ['wifi', 'parking', 'kitchen', 'garden'],
      weeklyDiscount: 8, monthlyDiscount: 0,
      rating: 4.7, reviewCount: 31, bookingCount: 20,
      images: [
        'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[1], // admin2
      title: 'Penthouse Vue Panoramique',
      desc: JSON.stringify({
        fr: 'Penthouse de standing exceptionnel avec terrasse rooftop à Alger.',
        en: 'Exceptional luxury penthouse with rooftop terrace in Algiers.',
        ar: 'بنتهاوس فاخر استثنائي مع شرفة على السطح في الجزائر.',
      }),
      type: 'apartment', wilaya: 'Alger', city: 'Alger',
      latitude: 36.7630, longitude: 3.0506, price: 22000,
      beds: 4, bedrooms: 3, bathrooms: 2, maxGuests: 4,
      trust: 5, verified: true, superhost: true, badge: 'superhost',
      amenities: ['wifi', 'ac', 'tv', 'kitchen', 'washer', 'pool', 'security', 'parking'],
      weeklyDiscount: 10, monthlyDiscount: 20,
      rating: 5.0, reviewCount: 18, bookingCount: 15,
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[1], // admin2
      title: 'Chalet Bord de Lac',
      desc: JSON.stringify({
        fr: 'Chalet rustique au bord du lac Tonga à El Kala.',
        en: 'Rustic chalet on the shores of Lake Tonga in El Kala.',
        ar: 'شاليه ريفي على ضفاف بحيرة طونقا في القالة.',
      }),
      type: 'chalet', wilaya: 'El Tarf', city: 'El Kala',
      latitude: 36.8956, longitude: 8.4431, price: 11000,
      beds: 4, bedrooms: 3, bathrooms: 2, maxGuests: 6,
      trust: 0, verified: false, superhost: false, badge: null,
      amenities: ['wifi', 'parking', 'kitchen', 'garden', 'pool'],
      weeklyDiscount: 0, monthlyDiscount: 0,
      rating: 4.6, reviewCount: 55, bookingCount: 35,
      images: [
        'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: adminIds[1], // admin2
      title: 'Riad Luxueux Sahara',
      desc: JSON.stringify({
        fr: 'Riad luxueux aux portes du Sahara à Tamanrasset.',
        en: 'Luxurious riad at the gates of the Sahara in Tamanrasset.',
        ar: 'رياض فاخر عند بوابات الصحراء في تمنراست.',
      }),
      type: 'riad', wilaya: 'Tamanrasset', city: 'Tamanrasset',
      latitude: 22.7850, longitude: 5.5228, price: 14000,
      beds: 5, bedrooms: 4, bathrooms: 3, maxGuests: 8,
      trust: 3, verified: true, superhost: true, badge: 'superhost',
      amenities: ['wifi', 'ac', 'breakfast', 'garden', 'security', 'pool'],
      weeklyDiscount: 15, monthlyDiscount: 30,
      rating: 4.9, reviewCount: 29, bookingCount: 22,
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d8f568e3f?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop',
      ],
    },
  ];

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    const id = uuidv4();
    const rules = HOUSE_RULES.sort(() => 0.5 - Math.random()).slice(0, randomBetween(2, 5));
    const payments = PAYMENT_METHODS.sort(() => 0.5 - Math.random()).slice(0, randomBetween(2, 4));

    const pricePerWeek = p.weeklyDiscount > 0 ? Math.round(p.price * 7 * (1 - p.weeklyDiscount / 100)) : null;
    const pricePerMonth = p.monthlyDiscount > 0 ? Math.round(p.price * 30 * (1 - p.monthlyDiscount / 100)) : null;

    await qr.query(
      `INSERT INTO properties (id, hostId, title, description, propertyType, status, pricePerNight, currency,
        pricePerWeek, pricePerMonth, weeklyDiscount, monthlyDiscount, cleaningFee, serviceFeePercent,
        acceptedPaymentMethods, latitude, longitude, address, city, wilaya, country, zipCode,
        maxGuests, bedrooms, bathrooms, beds, images, amenities, checkInTime, checkOutTime,
        houseRules, cancellationPolicy, averageRating, reviewCount, bookingCount,
        isAvailable, trustStars, isVerified, instantBooking, minNights, maxNights)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, p.hostId, p.title, p.desc, p.type, 'published', p.price, 'DZD',
        pricePerWeek, pricePerMonth, p.weeklyDiscount || null, p.monthlyDiscount || null,
        randomBetween(500, 2000), 5.0,
        JSON.stringify(payments), p.latitude, p.longitude,
        `${p.city}, ${p.wilaya}`, p.city, p.wilaya, 'Algeria', `${randomBetween(10000, 99999)}`,
        p.maxGuests, p.bedrooms, p.bathrooms, p.beds,
        JSON.stringify(p.images),
        JSON.stringify(p.amenities), '15:00', '11:00',
        JSON.stringify(rules), randomFrom(CANCELLATION_POLICIES),
        p.rating, p.reviewCount, p.bookingCount,
        true, p.trust, p.verified, i % 3 === 0, randomBetween(1, 3), 90,
      ]
    );
    propertyIds.push(id);
  }

  await qr.release();
  console.log(`✅ Created ${propertyIds.length} properties`);
  return propertyIds;
}

async function seedManagerAssignments(ds: DataSource, userIds: number[], propertyIds: string[]) {
  const qr = ds.createQueryRunner();
  const assignmentIds: string[] = [];

  // admin1 = userIds[2], admin2 = userIds[3]
  // manager1 = userIds[4], manager2 = userIds[5]
  // admin1 owns properties 0-5, admin2 owns properties 6-11

  const assignments = [
    // manager1 manages some of admin1's properties
    { managerId: userIds[4], adminId: userIds[2], scope: 'property', propertyId: propertyIds[0], groupId: null },
    { managerId: userIds[4], adminId: userIds[2], scope: 'property', propertyId: propertyIds[1], groupId: null },
    { managerId: userIds[4], adminId: userIds[2], scope: 'property', propertyId: propertyIds[2], groupId: null },
    // manager2 manages all of admin2's properties
    { managerId: userIds[5], adminId: userIds[3], scope: 'property', propertyId: propertyIds[6], groupId: null },
    { managerId: userIds[5], adminId: userIds[3], scope: 'property', propertyId: propertyIds[7], groupId: null },
    { managerId: userIds[5], adminId: userIds[3], scope: 'property', propertyId: propertyIds[8], groupId: null },
    { managerId: userIds[5], adminId: userIds[3], scope: 'property', propertyId: propertyIds[9], groupId: null },
    // manager2 also manages some of admin1's properties (cross-admin)
    { managerId: userIds[5], adminId: userIds[2], scope: 'property', propertyId: propertyIds[3], groupId: null },
    // hyper_manager gets assigned by hyper_admin with 'all' scope
    { managerId: userIds[1], adminId: userIds[0], scope: 'all', propertyId: null, groupId: null },
  ];

  for (const a of assignments) {
    const id = uuidv4();
    await qr.query(
      `INSERT INTO manager_assignments (id, managerId, assignedByAdminId, scope, propertyId, propertyGroupId, isActive)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [id, a.managerId, a.adminId, a.scope, a.propertyId, a.groupId]
    );
    assignmentIds.push(id);
  }

  await qr.release();
  console.log(`✅ Created ${assignmentIds.length} manager assignments`);
  return assignmentIds;
}

async function seedManagerPermissions(ds: DataSource, assignmentIds: string[]) {
  const qr = ds.createQueryRunner();
  let count = 0;

  // Full permissions for hyper_manager (last assignment)
  const allPermissions = [
    'create_property', 'modify_property', 'delete_property', 'pause_property',
    'modify_prices', 'modify_photos', 'modify_title', 'modify_description',
    'manage_availability', 'manage_amenities',
    'view_bookings', 'accept_bookings', 'reject_bookings', 'pause_bookings', 'refund_users',
    'reply_chat', 'reply_reviews', 'reply_comments', 'send_messages', 'contact_guests',
    'manage_reactions', 'manage_likes',
    'view_analytics', 'manage_promotions', 'modify_offers',
    'create_service', 'modify_service', 'delete_service', 'pause_service',
    'manage_users', 'manage_admins', 'manage_managers',
  ];

  // Limited permissions for manager1 (assignments 0,1,2)
  const manager1Perms = [
    'view_bookings', 'accept_bookings', 'reject_bookings',
    'reply_chat', 'reply_reviews', 'reply_comments', 'contact_guests',
    'modify_photos', 'modify_description', 'manage_availability',
    'view_analytics',
  ];

  // More permissions for manager2 (assignments 3-7)
  const manager2Perms = [
    'view_bookings', 'accept_bookings', 'reject_bookings', 'pause_bookings', 'refund_users',
    'reply_chat', 'reply_reviews', 'reply_comments', 'send_messages', 'contact_guests',
    'modify_prices', 'modify_photos', 'modify_title', 'modify_description',
    'manage_availability', 'manage_amenities',
    'view_analytics', 'manage_promotions',
  ];

  // Manager1 assignments (0,1,2)
  for (let i = 0; i < 3; i++) {
    for (const perm of manager1Perms) {
      await qr.query(
        `INSERT INTO manager_permissions (id, assignmentId, permission, isGranted) VALUES (?, ?, ?, 1)`,
        [uuidv4(), assignmentIds[i], perm]
      );
      count++;
    }
  }

  // Manager2 assignments (3,4,5,6,7)
  for (let i = 3; i < 8; i++) {
    for (const perm of manager2Perms) {
      await qr.query(
        `INSERT INTO manager_permissions (id, assignmentId, permission, isGranted) VALUES (?, ?, ?, 1)`,
        [uuidv4(), assignmentIds[i], perm]
      );
      count++;
    }
  }

  // Hyper_manager (assignment 8) gets all permissions
  for (const perm of allPermissions) {
    await qr.query(
      `INSERT INTO manager_permissions (id, assignmentId, permission, isGranted) VALUES (?, ?, ?, 1)`,
      [uuidv4(), assignmentIds[8], perm]
    );
    count++;
  }

  await qr.release();
  console.log(`✅ Created ${count} manager permissions`);
}

async function seedTourismServices(ds: DataSource, adminIds: number[]): Promise<string[]> {
  const qr = ds.createQueryRunner();
  const serviceIds: string[] = [];

  const services = [
    {
      providerId: adminIds[0],
      title: JSON.stringify({ fr: 'Visite Guidée de la Casbah', en: 'Guided Tour of the Casbah', ar: 'جولة مرشدة في القصبة' }),
      description: JSON.stringify({ fr: 'Découvrez les ruelles historiques de la Casbah d\'Alger.', en: 'Discover the historic alleys of Algiers\' Casbah.', ar: 'اكتشف أزقة قصبة الجزائر التاريخية.' }),
      category: 'walking_tour', city: 'Alger', wilaya: 'Alger',
      price: 3000, pricingType: 'per_person', duration: 3, durationUnit: 'hours',
      minP: 2, maxP: 15, rating: 4.8, reviews: 45, bookings: 120,
      images: ['https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800'],
      schedule: { days: ['Monday', 'Wednesday', 'Friday', 'Saturday'], startTime: '09:00', endTime: '12:00' },
      languages: ['fr', 'en', 'ar'],
      includes: { fr: ['Guide professionnel', 'Thé à la menthe', 'Livret historique'], en: ['Professional guide', 'Mint tea', 'Historical booklet'] },
      tags: ['history', 'culture', 'casbah', 'UNESCO'],
    },
    {
      providerId: adminIds[0],
      title: JSON.stringify({ fr: 'Excursion en Bateau - Côte Turquoise', en: 'Boat Trip - Turquoise Coast', ar: 'رحلة بحرية - الساحل الفيروزي' }),
      description: JSON.stringify({ fr: 'Croisière le long de la côte de Tipaza.', en: 'Cruise along the coast of Tipaza.', ar: 'رحلة بحرية على طول ساحل تيبازة.' }),
      category: 'boat_tour', city: 'Tipaza', wilaya: 'Tipaza',
      price: 5000, pricingType: 'per_person', duration: 4, durationUnit: 'hours',
      minP: 4, maxP: 12, rating: 4.9, reviews: 32, bookings: 85,
      images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800'],
      schedule: { days: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'], startTime: '10:00', endTime: '14:00' },
      languages: ['fr', 'ar'],
      includes: { fr: ['Gilet de sauvetage', 'Déjeuner à bord', 'Équipement snorkeling'], en: ['Life jacket', 'Onboard lunch', 'Snorkeling gear'] },
      tags: ['sea', 'boat', 'snorkeling', 'tipaza'],
    },
    {
      providerId: adminIds[1],
      title: JSON.stringify({ fr: 'Cours de Cuisine Traditionnelle', en: 'Traditional Cooking Class', ar: 'دورة طبخ تقليدي' }),
      description: JSON.stringify({ fr: 'Apprenez à préparer des plats algériens authentiques.', en: 'Learn to prepare authentic Algerian dishes.', ar: 'تعلم تحضير أطباق جزائرية أصيلة.' }),
      category: 'cooking_class', city: 'Constantine', wilaya: 'Constantine',
      price: 4000, pricingType: 'per_person', duration: 3, durationUnit: 'hours',
      minP: 2, maxP: 8, rating: 4.7, reviews: 28, bookings: 65,
      images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800'],
      schedule: { days: ['Monday', 'Wednesday', 'Saturday'], startTime: '10:00', endTime: '13:00' },
      languages: ['fr', 'ar'],
      includes: { fr: ['Ingrédients', 'Tablier', 'Recettes à emporter'], en: ['Ingredients', 'Apron', 'Take-home recipes'] },
      tags: ['cooking', 'food', 'traditional', 'algerian'],
    },
    {
      providerId: adminIds[1],
      title: JSON.stringify({ fr: 'Randonnée Djurdjura', en: 'Djurdjura Hiking', ar: 'مشي في جرجرة' }),
      description: JSON.stringify({ fr: 'Randonnée guidée dans le parc national du Djurdjura.', en: 'Guided hike in Djurdjura National Park.', ar: 'مشي مع مرشد في حديقة جرجرة الوطنية.' }),
      category: 'nature_excursion', city: 'Tizi Ouzou', wilaya: 'Tizi Ouzou',
      price: 3500, pricingType: 'per_person', duration: 6, durationUnit: 'hours',
      minP: 3, maxP: 20, rating: 4.6, reviews: 19, bookings: 42,
      images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800'],
      schedule: { days: ['Saturday', 'Sunday'], startTime: '07:00', endTime: '13:00' },
      languages: ['fr', 'en', 'ar'],
      includes: { fr: ['Guide montagne', 'Eau et snacks', 'Assurance'], en: ['Mountain guide', 'Water and snacks', 'Insurance'] },
      tags: ['hiking', 'mountain', 'nature', 'djurdjura'],
    },
    {
      providerId: adminIds[0],
      title: JSON.stringify({ fr: 'Séance Photo Professionnelle', en: 'Professional Photo Session', ar: 'جلسة تصوير احترافية' }),
      description: JSON.stringify({ fr: 'Séance photo avec un photographe professionnel dans les plus beaux sites.', en: 'Photo session with a professional photographer at the most beautiful sites.', ar: 'جلسة تصوير مع مصور محترف في أجمل المواقع.' }),
      category: 'photography', city: 'Alger', wilaya: 'Alger',
      price: 8000, pricingType: 'per_group', duration: 2, durationUnit: 'hours',
      minP: 1, maxP: 6, rating: 4.9, reviews: 15, bookings: 35,
      images: ['https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800'],
      schedule: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], startTime: '08:00', endTime: '18:00' },
      languages: ['fr', 'en'],
      includes: { fr: ['50 photos retouchées', 'Album numérique', 'Choix du lieu'], en: ['50 edited photos', 'Digital album', 'Location choice'] },
      tags: ['photo', 'professional', 'souvenir'],
    },
    {
      providerId: adminIds[1],
      title: JSON.stringify({ fr: 'Hammam Traditionnel & Spa', en: 'Traditional Hammam & Spa', ar: 'حمام تقليدي وسبا' }),
      description: JSON.stringify({ fr: 'Expérience de hammam traditionnel algérien avec soins spa.', en: 'Traditional Algerian hammam experience with spa treatments.', ar: 'تجربة حمام جزائري تقليدي مع علاجات سبا.' }),
      category: 'hammam', city: 'Oran', wilaya: 'Oran',
      price: 6000, pricingType: 'per_person', duration: 2, durationUnit: 'hours',
      minP: 1, maxP: 4, rating: 4.8, reviews: 52, bookings: 150,
      images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800'],
      schedule: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], startTime: '10:00', endTime: '20:00' },
      languages: ['fr', 'ar'],
      includes: { fr: ['Gommage', 'Massage relaxant', 'Thé et pâtisseries'], en: ['Scrub', 'Relaxing massage', 'Tea and pastries'] },
      tags: ['hammam', 'spa', 'wellness', 'relaxation'],
    },
    // ── Artisan & craft services ──
    {
      providerId: adminIds[0],
      title: JSON.stringify({ fr: 'Bijouterie Traditionnelle en Argent', en: 'Traditional Silver Jewelry Workshop', ar: 'ورشة مجوهرات فضية تقليدية' }),
      description: JSON.stringify({ fr: 'Découvrez l\'art ancestral de la bijouterie berbère en argent. Création de bracelets, bagues et fibules.', en: 'Discover the ancestral art of Berber silver jewelry. Create bracelets, rings and fibulae.', ar: 'اكتشف فن صناعة المجوهرات الفضية البربرية. صنع أساور وخواتم ومشابك.' }),
      category: 'silver_jewelry', city: 'Ghardaia', wilaya: 'Ghardaïa',
      price: 7000, pricingType: 'per_person', duration: 4, durationUnit: 'hours',
      minP: 1, maxP: 6, rating: 4.9, reviews: 38, bookings: 95,
      images: ['https://images.unsplash.com/photo-1515562141589-67f0d7f68681?w=800'],
      schedule: { days: ['Monday', 'Wednesday', 'Friday'], startTime: '09:00', endTime: '13:00' },
      languages: ['fr', 'ar'],
      includes: { fr: ['Matériaux', 'Outils', 'Bijou à emporter'], en: ['Materials', 'Tools', 'Jewelry to take home'] },
      tags: ['artisan', 'silver', 'jewelry', 'berber', 'traditional'],
    },
    {
      providerId: adminIds[1],
      title: JSON.stringify({ fr: 'Atelier Bijoux en Or Traditionnel', en: 'Traditional Gold Jewelry Atelier', ar: 'ورشة مجوهرات ذهبية تقليدية' }),
      description: JSON.stringify({ fr: 'Initiation à la joaillerie traditionnelle algérienne en or. M\'hejba, khelkhal et boucles.', en: 'Introduction to traditional Algerian gold jewelry. M\'hejba, khelkhal and earrings.', ar: 'مبادئ صناعة المجوهرات الذهبية التقليدية الجزائرية.' }),
      category: 'gold_jewelry', city: 'Constantine', wilaya: 'Constantine',
      price: 12000, pricingType: 'per_person', duration: 5, durationUnit: 'hours',
      minP: 1, maxP: 4, rating: 4.8, reviews: 22, bookings: 55,
      images: ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800'],
      schedule: { days: ['Tuesday', 'Thursday', 'Saturday'], startTime: '10:00', endTime: '15:00' },
      languages: ['fr', 'ar'],
      includes: { fr: ['Matériaux de base', 'Démonstration', 'Certificat'], en: ['Base materials', 'Demonstration', 'Certificate'] },
      tags: ['artisan', 'gold', 'jewelry', 'constantine', 'luxury'],
    },
    {
      providerId: adminIds[0],
      title: JSON.stringify({ fr: 'Poterie Traditionnelle de Kabylie', en: 'Traditional Kabyle Pottery', ar: 'فخار تقليدي قبائلي' }),
      description: JSON.stringify({ fr: 'Apprenez la poterie kabyle avec des motifs géométriques ancestraux.', en: 'Learn Kabyle pottery with ancestral geometric patterns.', ar: 'تعلم صناعة الفخار القبائلي بأنماط هندسية عريقة.' }),
      category: 'pottery', city: 'Tizi Ouzou', wilaya: 'Tizi Ouzou',
      price: 4500, pricingType: 'per_person', duration: 3, durationUnit: 'hours',
      minP: 2, maxP: 10, rating: 4.7, reviews: 41, bookings: 110,
      images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'],
      schedule: { days: ['Monday', 'Wednesday', 'Friday', 'Saturday'], startTime: '09:00', endTime: '12:00' },
      languages: ['fr', 'ar'],
      includes: { fr: ['Argile', 'Outils', 'Cuisson', 'Pièce à emporter'], en: ['Clay', 'Tools', 'Firing', 'Piece to take home'] },
      tags: ['artisan', 'pottery', 'kabyle', 'traditional'],
    },
    {
      providerId: adminIds[1],
      title: JSON.stringify({ fr: 'Tissage de Tapis Traditionnels', en: 'Traditional Carpet Weaving', ar: 'نسج السجاد التقليدي' }),
      description: JSON.stringify({ fr: 'Découvrez le tissage de tapis berbères sur métier à tisser traditionnel.', en: 'Discover Berber carpet weaving on a traditional loom.', ar: 'اكتشف نسج السجاد البربري على نول تقليدي.' }),
      category: 'carpet_weaving', city: 'Ghardaia', wilaya: 'Ghardaïa',
      price: 5500, pricingType: 'per_person', duration: 4, durationUnit: 'hours',
      minP: 1, maxP: 5, rating: 4.6, reviews: 18, bookings: 40,
      images: ['https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?w=800'],
      schedule: { days: ['Tuesday', 'Thursday', 'Saturday'], startTime: '09:00', endTime: '13:00' },
      languages: ['fr', 'ar'],
      includes: { fr: ['Laine', 'Métier à tisser', 'Thé'], en: ['Wool', 'Loom', 'Tea'] },
      tags: ['artisan', 'carpet', 'weaving', 'berber'],
    },
    {
      providerId: adminIds[0],
      title: JSON.stringify({ fr: 'Art du Henné - Atelier', en: 'Henna Art Workshop', ar: 'ورشة فن الحناء' }),
      description: JSON.stringify({ fr: 'Apprenez les motifs traditionnels algériens de henné pour mariages et fêtes.', en: 'Learn traditional Algerian henna patterns for weddings and celebrations.', ar: 'تعلم أنماط الحناء الجزائرية التقليدية للأعراس والاحتفالات.' }),
      category: 'henna_art', city: 'Alger', wilaya: 'Alger',
      price: 3000, pricingType: 'per_person', duration: 2, durationUnit: 'hours',
      minP: 2, maxP: 8, rating: 4.8, reviews: 56, bookings: 180,
      images: ['https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800'],
      schedule: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], startTime: '10:00', endTime: '18:00' },
      languages: ['fr', 'ar', 'en'],
      includes: { fr: ['Henné naturel', 'Modèles', 'Application'], en: ['Natural henna', 'Patterns', 'Application'] },
      tags: ['artisan', 'henna', 'beauty', 'traditional', 'wedding'],
    },
    {
      providerId: adminIds[1],
      title: JSON.stringify({ fr: 'Calligraphie Arabe - Initiation', en: 'Arabic Calligraphy Workshop', ar: 'ورشة الخط العربي' }),
      description: JSON.stringify({ fr: 'Initiez-vous à l\'art de la calligraphie arabe avec un maître calligraphe.', en: 'Get introduced to Arabic calligraphy with a master calligrapher.', ar: 'تعلم فن الخط العربي مع خطاط محترف.' }),
      category: 'calligraphy', city: 'Constantine', wilaya: 'Constantine',
      price: 3500, pricingType: 'per_person', duration: 2, durationUnit: 'hours',
      minP: 1, maxP: 10, rating: 4.7, reviews: 33, bookings: 75,
      images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'],
      schedule: { days: ['Monday', 'Wednesday', 'Saturday'], startTime: '14:00', endTime: '16:00' },
      languages: ['ar', 'fr'],
      includes: { fr: ['Matériel de calligraphie', 'Encre', 'Parchemin'], en: ['Calligraphy supplies', 'Ink', 'Parchment'] },
      tags: ['artisan', 'calligraphy', 'arabic', 'art', 'culture'],
    },
    {
      providerId: adminIds[0],
      title: JSON.stringify({ fr: 'Maroquinerie Artisanale', en: 'Artisan Leather Crafting', ar: 'صناعة الجلود الحرفية' }),
      description: JSON.stringify({ fr: 'Créez votre propre sac ou ceinture en cuir avec un artisan local.', en: 'Create your own leather bag or belt with a local craftsman.', ar: 'اصنع حقيبتك أو حزامك الجلدي مع حرفي محلي.' }),
      category: 'leather_craft', city: 'Alger', wilaya: 'Alger',
      price: 6000, pricingType: 'per_person', duration: 4, durationUnit: 'hours',
      minP: 1, maxP: 6, rating: 4.5, reviews: 14, bookings: 32,
      images: ['https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800'],
      schedule: { days: ['Tuesday', 'Thursday', 'Saturday'], startTime: '10:00', endTime: '14:00' },
      languages: ['fr', 'ar'],
      includes: { fr: ['Cuir', 'Outils', 'Pièce finie'], en: ['Leather', 'Tools', 'Finished piece'] },
      tags: ['artisan', 'leather', 'craft', 'handmade'],
    },
  ];

  for (const s of services) {
    const id = uuidv4();
    await qr.query(
      `INSERT INTO tourism_services (id, providerId, title, description, category, status, price, currency, pricingType, duration, durationUnit, minParticipants, maxParticipants, city, wilaya, country, images, schedule, languages, \`includes\`, tags, averageRating, reviewCount, bookingCount, isAvailable, isVerified, instantBooking, minAge, cancellationPolicy)
       VALUES (?, ?, ?, ?, ?, 'published', ?, 'DZD', ?, ?, ?, ?, ?, ?, ?, 'Algeria', ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, 0, 'flexible')`,
      [
        id, s.providerId, s.title, s.description,
        s.category, s.price, s.pricingType, s.duration, s.durationUnit,
        s.minP, s.maxP, s.city, s.wilaya,
        JSON.stringify(s.images), JSON.stringify(s.schedule), JSON.stringify(s.languages),
        JSON.stringify(s.includes), JSON.stringify(s.tags),
        s.rating, s.reviews, s.bookings,
        ['photography', 'hammam', 'silver_jewelry', 'gold_jewelry'].includes(s.category),
      ]
    );
    serviceIds.push(id);
  }

  await qr.release();
  console.log(`✅ Created ${serviceIds.length} tourism services`);
  return serviceIds;
}

async function seedPropertyImages(ds: DataSource, propertyIds: string[]) {
  const qr = ds.createQueryRunner();
  let count = 0;
  const defaultGallery = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop',
  ];

  for (const propId of propertyIds) {
    for (let j = 0; j < defaultGallery.length; j++) {
      await qr.query(
        `INSERT INTO property_images (id, propertyId, url, caption, sortOrder, isCover)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), propId, defaultGallery[j], j === 0 ? 'Cover photo' : `Photo ${j + 1}`, j, j === 0]
      );
      count++;
    }
  }
  await qr.release();
  console.log(`✅ Created ${count} property images`);
}

async function seedBookings(ds: DataSource, propertyIds: string[], guestIds: number[]): Promise<string[]> {
  const qr = ds.createQueryRunner();
  const bookingIds: string[] = [];

  const prices = [15000, 8000, 12000, 10000, 9500, 6500, 18000, 4500, 7000, 22000, 11000, 14000];

  const bookings = [
    { propIdx: 0, guestIdx: 0, checkIn: pastDate(60), checkOut: pastDate(55), nights: 5, guests: 4, status: 'completed', payStatus: 'paid', payMethod: 'ccp', msg: 'Nous avons hâte de séjourner dans votre villa!' },
    { propIdx: 2, guestIdx: 1, checkIn: pastDate(45), checkOut: pastDate(38), nights: 7, guests: 2, status: 'completed', payStatus: 'paid', payMethod: 'bank_transfer', msg: 'Magnifique maison traditionnelle!' },
    { propIdx: 5, guestIdx: 2, checkIn: pastDate(30), checkOut: pastDate(27), nights: 3, guests: 1, status: 'completed', payStatus: 'paid', payMethod: 'baridi_mob', msg: null },
    { propIdx: 3, guestIdx: 3, checkIn: pastDate(20), checkOut: pastDate(16), nights: 4, guests: 3, status: 'completed', payStatus: 'paid', payMethod: 'cash', msg: 'Avez-vous un parking?' },
    { propIdx: 8, guestIdx: 0, checkIn: pastDate(10), checkOut: pastDate(5), nights: 5, guests: 6, status: 'completed', payStatus: 'paid', payMethod: 'ccp', msg: null },
    { propIdx: 0, guestIdx: 1, checkIn: futureDate(5), checkOut: futureDate(10), nights: 5, guests: 2, status: 'confirmed', payStatus: 'paid', payMethod: 'edahabia', msg: 'Premier séjour!' },
    { propIdx: 6, guestIdx: 0, checkIn: futureDate(15), checkOut: futureDate(22), nights: 7, guests: 4, status: 'confirmed', payStatus: 'partial', payMethod: 'bank_transfer', msg: 'Couple avec 2 enfants.' },
    { propIdx: 4, guestIdx: 2, checkIn: futureDate(20), checkOut: futureDate(23), nights: 3, guests: 2, status: 'pending', payStatus: 'pending', payMethod: null, msg: 'Le petit-déjeuner est-il inclus?' },
    { propIdx: 10, guestIdx: 3, checkIn: futureDate(30), checkOut: futureDate(37), nights: 7, guests: 5, status: 'pending', payStatus: 'pending', payMethod: null, msg: null },
    { propIdx: 9, guestIdx: 1, checkIn: pastDate(15), checkOut: pastDate(12), nights: 3, guests: 2, status: 'cancelled', payStatus: 'refunded', payMethod: 'ccp', msg: 'Changement de plans.' },
    // Admin as guest (admin can book other properties)
    { propIdx: 6, guestIdx: 4, checkIn: futureDate(10), checkOut: futureDate(14), nights: 4, guests: 2, status: 'confirmed', payStatus: 'paid', payMethod: 'ccp', msg: 'Admin booking as guest.' },
  ];

  for (const b of bookings) {
    const id = uuidv4();
    const ppn = prices[b.propIdx] || 10000;
    const cleaningFee = Math.round(ppn * 0.05);
    const serviceFee = Math.round(ppn * b.nights * 0.05);
    const discount = b.nights >= 7 ? 10 : 0;
    const discountType = b.nights >= 7 ? 'weekly' : null;
    const effectiveRate = ppn * (1 - discount / 100);
    const subtotal = effectiveRate * b.nights;
    const totalPrice = subtotal + cleaningFee + serviceFee;
    const guestId = b.guestIdx < guestIds.length ? guestIds[b.guestIdx] : guestIds[0];

    await qr.query(
      `INSERT INTO bookings (id, propertyId, guestId, checkInDate, checkOutDate, numberOfGuests, numberOfNights, pricePerNight, cleaningFee, serviceFee, discountPercent, discountType, effectiveRate, subtotal, totalPrice, currency, status, paymentStatus, paymentMethod, guestMessage, confirmedAt, cancelledAt, cancellationReason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, propertyIds[b.propIdx], guestId,
        b.checkIn, b.checkOut, b.guests, b.nights,
        ppn, cleaningFee, serviceFee, discount, discountType,
        effectiveRate, subtotal, totalPrice, 'DZD',
        b.status, b.payStatus, b.payMethod, b.msg,
        b.status === 'confirmed' || b.status === 'completed' ? pastDate(randomBetween(5, 60)) : null,
        b.status === 'cancelled' ? pastDate(randomBetween(1, 15)) : null,
        b.status === 'cancelled' ? 'Changement de plans personnels' : null,
      ]
    );
    bookingIds.push(id);
  }
  await qr.release();
  console.log(`✅ Created ${bookingIds.length} bookings`);
  return bookingIds;
}

async function seedReviews(ds: DataSource, propertyIds: string[], guestIds: number[]) {
  const qr = ds.createQueryRunner();
  const reviews = [
    { propIdx: 0, guestIdx: 0, rating: 5, comment: 'Séjour exceptionnel! La villa est magnifique.' },
    { propIdx: 0, guestIdx: 1, rating: 5, comment: 'Vue magnifique, piscine parfaite!' },
    { propIdx: 0, guestIdx: 2, rating: 4, comment: 'Très belle propriété, petit bémol sur la route d\'accès.' },
    { propIdx: 2, guestIdx: 1, rating: 5, comment: 'La maison traditionnelle est un bijou.' },
    { propIdx: 4, guestIdx: 2, rating: 5, comment: 'Le riad est un havre de paix.' },
    { propIdx: 5, guestIdx: 0, rating: 4, comment: 'Bon rapport qualité/prix pour Oran.' },
    { propIdx: 6, guestIdx: 3, rating: 5, comment: 'Villa paradisiaque!' },
    { propIdx: 9, guestIdx: 1, rating: 5, comment: 'Le penthouse est à couper le souffle.' },
  ];

  for (const r of reviews) {
    await qr.query(
      `INSERT INTO reviews (id, propertyId, userId, rating, comment, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), propertyIds[r.propIdx], guestIds[r.guestIdx], r.rating, r.comment, pastDate(randomBetween(5, 90))]
    );
  }
  await qr.release();
  console.log(`✅ Created ${reviews.length} reviews`);
}

async function seedVerificationDocs(ds: DataSource, propertyIds: string[], hostIds: number[]) {
  const qr = ds.createQueryRunner();
  const docs = [
    { propIdx: 0, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.98 },
    { propIdx: 0, type: 'notarized_deed', status: 'approved', aiValid: true, aiConf: 0.95 },
    { propIdx: 0, type: 'utility_bill', status: 'approved', aiValid: true, aiConf: 0.97 },
    { propIdx: 1, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.96 },
    { propIdx: 1, type: 'notarized_deed', status: 'approved', aiValid: true, aiConf: 0.92 },
    { propIdx: 2, type: 'passport', status: 'approved', aiValid: true, aiConf: 0.99 },
    { propIdx: 2, type: 'land_registry', status: 'approved', aiValid: true, aiConf: 0.94 },
    { propIdx: 3, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.93 },
    { propIdx: 4, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.97 },
    { propIdx: 4, type: 'notarized_deed', status: 'approved', aiValid: true, aiConf: 0.91 },
    { propIdx: 5, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.94 },
    { propIdx: 6, type: 'passport', status: 'approved', aiValid: true, aiConf: 0.96 },
    { propIdx: 7, type: 'national_id', status: 'pending', aiValid: null, aiConf: null },
    { propIdx: 8, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.95 },
    { propIdx: 9, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.99 },
    { propIdx: 9, type: 'notarized_deed', status: 'approved', aiValid: true, aiConf: 0.97 },
    { propIdx: 10, type: 'national_id', status: 'rejected', aiValid: false, aiConf: 0.45 },
    { propIdx: 11, type: 'passport', status: 'approved', aiValid: true, aiConf: 0.94 },
  ];

  for (const d of docs) {
    await qr.query(
      `INSERT INTO verification_documents (id, propertyId, type, fileName, fileUrl, status, aiAnalyzed, aiValidationResult, aiConfidence, aiReason, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        uuidv4(), propertyIds[d.propIdx], d.type,
        `${d.type}_prop${d.propIdx + 1}.pdf`,
        `${MEDIA_BASE}/documents/${d.type}_prop${d.propIdx + 1}.pdf`,
        d.status, d.aiValid !== null, d.aiValid, d.aiConf,
        d.aiValid ? 'Document verified successfully' : d.aiValid === false ? 'Document quality too low' : null,
      ]
    );
  }
  await qr.release();
  console.log(`✅ Created ${docs.length} verification documents`);
}

async function seedNotifications(ds: DataSource, userIds: number[]) {
  const qr = ds.createQueryRunner();
  const notifications = [
    { userId: userIds[6], type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your booking at Villa Vue Mer has been confirmed!', read: true },
    { userId: userIds[2], type: 'new_booking', title: 'New Booking', message: 'Sara H. has booked your Villa Vue Mer for 5 nights.', read: true },
    { userId: userIds[7], type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your booking at Maison Traditionnelle has been confirmed!', read: false },
    { userId: userIds[2], type: 'new_review', title: 'New Review', message: 'Sara H. left a 5-star review on Villa Vue Mer.', read: false },
    { userId: userIds[0], type: 'system', title: 'Document Verified', message: 'Your national ID has been verified successfully.', read: true },
    { userId: userIds[4], type: 'assignment', title: 'New Assignment', message: 'You have been assigned to manage Villa Vue Mer by Amina M.', read: false },
    { userId: userIds[5], type: 'assignment', title: 'New Assignment', message: 'You have been assigned to manage multiple properties.', read: false },
  ];

  for (const n of notifications) {
    await qr.query(
      `INSERT INTO notifications (id, userId, type, title, message, isRead, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), n.userId, n.type, n.title, n.message, n.read, pastDate(randomBetween(0, 30))]
    );
  }
  await qr.release();
  console.log(`✅ Created ${notifications.length} notifications`);
}

async function seedFavorites(ds: DataSource, propertyIds: string[], guestIds: number[]) {
  const qr = ds.createQueryRunner();
  const favs = [
    { guestIdx: 0, propIdxList: [0, 4, 9] },
    { guestIdx: 1, propIdxList: [0, 2, 6] },
    { guestIdx: 2, propIdxList: [4, 11] },
    { guestIdx: 3, propIdxList: [0, 6, 9, 11] },
  ];

  let count = 0;
  for (const f of favs) {
    for (const propIdx of f.propIdxList) {
      await qr.query(
        `INSERT INTO favorites (id, userId, propertyId, createdAt) VALUES (?, ?, ?, ?)`,
        [uuidv4(), guestIds[f.guestIdx], propertyIds[propIdx], pastDate(randomBetween(1, 60))]
      );
      count++;
    }
  }
  await qr.release();
  console.log(`✅ Created ${count} favorites`);
}

async function seedRankings(ds: DataSource, adminIds: number[]) {
  const qr = ds.createQueryRunner();
  const rankings = [
    { userId: adminIds[0], score: 950, category: 'superhost' },
    { userId: adminIds[1], score: 820, category: 'superhost' },
  ];

  for (const r of rankings) {
    await qr.query(
      `INSERT INTO rankings (id, userId, score, category, createdAt) VALUES (?, ?, ?, ?, NOW())`,
      [uuidv4(), r.userId, r.score, r.category]
    );
  }
  await qr.release();
  console.log(`✅ Created ${rankings.length} rankings`);
}

async function seedComments(ds: DataSource, propertyIds: string[], userIds: number[]) {
  const qr = ds.createQueryRunner();
  const comments = [
    { propIdx: 0, userId: userIds[6], text: 'Est-ce que la piscine est chauffée en hiver?' },
    { propIdx: 0, userId: userIds[2], text: 'Oui, la piscine est chauffée de novembre à mars.' },
    { propIdx: 4, userId: userIds[7], text: 'Le petit-déjeuner est-il inclus?' },
    { propIdx: 4, userId: userIds[3], text: 'Absolument! Petit-déjeuner traditionnel inclus.' },
    { propIdx: 6, userId: userIds[8], text: 'Peut-on organiser un événement dans le jardin?' },
    { propIdx: 9, userId: userIds[9], text: 'La vue de nuit est-elle spectaculaire?' },
    { propIdx: 9, userId: userIds[3], text: 'Encore mieux! Les lumières de la baie sont magiques.' },
  ];

  for (const c of comments) {
    await qr.query(
      `INSERT INTO comments (id, propertyId, userId, content, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), propertyIds[c.propIdx], c.userId, c.text, pastDate(randomBetween(1, 45))]
    );
  }
  await qr.release();
  console.log(`✅ Created ${comments.length} comments`);
}

async function seedTransferAccounts(ds: DataSource): Promise<string[]> {
  const qr = ds.createQueryRunner();
  const accountIds: string[] = [];

  const accounts = [
    { bankName: 'Algérie Poste (CCP)', accountType: 'ccp', accountNumber: '0023456789', accountKey: '42', holderName: 'ByootDZ SARL', agencyName: 'Bureau de Poste Central - Alger', sortOrder: 1 },
    { bankName: 'Banque Nationale d\'Algérie (BNA)', accountType: 'bna', accountNumber: '00100200300400500', accountKey: null, holderName: 'ByootDZ SARL', agencyName: 'Agence BNA Hussein Dey', sortOrder: 2 },
    { bankName: 'BADR Banque', accountType: 'badr', accountNumber: '00200300400500600', accountKey: null, holderName: 'ByootDZ SARL', agencyName: 'Agence BADR Bab Ezzouar', sortOrder: 3 },
  ];

  for (const a of accounts) {
    const id = uuidv4();
    await qr.query(
      `INSERT INTO transfer_accounts (id, bankName, accountType, accountNumber, accountKey, holderName, agencyName, isActive, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [id, a.bankName, a.accountType, a.accountNumber, a.accountKey, a.holderName, a.agencyName, a.sortOrder]
    );
    accountIds.push(id);
  }
  await qr.release();
  console.log(`✅ Created ${accountIds.length} transfer accounts`);
  return accountIds;
}

async function seedPaymentReceipts(ds: DataSource, bookingIds: string[], guestIds: number[], accountIds: string[], adminUserId: number) {
  const qr = ds.createQueryRunner();
  const receipts = [
    { bookingIdx: 0, guestIdx: 0, accountIdx: 0, amount: 78750, status: 'approved', reviewedBy: adminUserId, fileName: 'recu_ccp_001.jpg', note: 'Paiement vérifié' },
    { bookingIdx: 1, guestIdx: 1, accountIdx: 1, amount: 44590, status: 'approved', reviewedBy: adminUserId, fileName: 'virement_bna_002.pdf', note: 'Virement confirmé' },
    { bookingIdx: 6, guestIdx: 0, accountIdx: 0, amount: 63000, status: 'approved', reviewedBy: adminUserId, fileName: 'recu_ccp_003.jpg', note: 'Premier versement reçu' },
    { bookingIdx: 7, guestIdx: 2, accountIdx: 2, amount: 21000, status: 'pending', reviewedBy: null, fileName: 'recu_badr_004.jpg', note: null },
    { bookingIdx: 8, guestIdx: 3, accountIdx: 0, amount: 75460, status: 'pending', reviewedBy: null, fileName: 'recu_ccp_005.pdf', note: null },
    { bookingIdx: 4, guestIdx: 0, accountIdx: 1, amount: 30000, status: 'rejected', reviewedBy: adminUserId, fileName: 'virement_bna_006.jpg', note: 'Montant incorrect' },
  ];

  for (const r of receipts) {
    await qr.query(
      `INSERT INTO payment_receipts (id, bookingId, uploadedByUserId, transferAccountId, receiptUrl, originalFileName, amount, currency, status, reviewedByUserId, reviewedAt, reviewNote, guestNote)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'DZD', ?, ?, ?, ?, ?)`,
      [
        uuidv4(), bookingIds[r.bookingIdx], guestIds[r.guestIdx], accountIds[r.accountIdx],
        `${MEDIA_BASE}/receipts/${r.fileName}`, r.fileName, r.amount, r.status,
        r.reviewedBy, r.status !== 'pending' ? pastDate(randomBetween(1, 30)) : null,
        r.note, r.status === 'pending' ? 'Voici mon reçu de paiement' : null,
      ]
    );
  }
  await qr.release();
  console.log(`✅ Created ${receipts.length} payment receipts`);
}

// ─── Points Rules Seed ──────────────────────────────────────────────────────

async function seedPointsRules(ds: DataSource, hyperAdminId: number, propertyIds: string[], serviceIds: string[]) {
  const qr = ds.createQueryRunner();

  const rules = [
    // Earning rules - global scope
    { ruleType: 'earning', targetRole: 'guest', scope: 'global', action: 'booking_completed', pointsAmount: 50, multiplier: 1.0, maxPointsPerPeriod: 0, period: null, minNights: 1, validFrom: null, validTo: null, isDefault: true, description: 'Points pour chaque réservation complétée', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    { ruleType: 'earning', targetRole: 'guest', scope: 'global', action: 'review_submitted', pointsAmount: 20, multiplier: 1.0, maxPointsPerPeriod: 100, period: 'monthly', minNights: null, validFrom: null, validTo: null, isDefault: true, description: 'Points pour chaque avis soumis', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    { ruleType: 'earning', targetRole: 'guest', scope: 'global', action: 'referral_signup', pointsAmount: 100, multiplier: 1.5, maxPointsPerPeriod: 500, period: 'monthly', minNights: null, validFrom: null, validTo: null, isDefault: true, description: 'Points de parrainage', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    { ruleType: 'earning', targetRole: 'guest', scope: 'global', action: 'first_booking', pointsAmount: 75, multiplier: 1.0, maxPointsPerPeriod: 0, period: null, minNights: null, validFrom: null, validTo: null, isDefault: true, description: 'Bonus première réservation', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    { ruleType: 'earning', targetRole: 'guest', scope: 'global', action: 'profile_completed', pointsAmount: 30, multiplier: 1.0, maxPointsPerPeriod: 0, period: null, minNights: null, validFrom: null, validTo: null, isDefault: true, description: 'Bonus profil complété', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    { ruleType: 'earning', targetRole: 'guest', scope: 'global', action: 'property_shared', pointsAmount: 5, multiplier: 1.0, maxPointsPerPeriod: 50, period: 'daily', minNights: null, validFrom: null, validTo: null, isDefault: true, description: 'Points pour partage', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    { ruleType: 'earning', targetRole: 'guest', scope: 'global', action: 'five_star_review', pointsAmount: 30, multiplier: 1.0, maxPointsPerPeriod: 0, period: null, minNights: null, validFrom: null, validTo: null, isDefault: true, description: 'Bonus avis 5 étoiles', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    // Seasonal rule with date range
    { ruleType: 'earning', targetRole: 'guest', scope: 'global', action: 'booking_completed', pointsAmount: 100, multiplier: 2.0, maxPointsPerPeriod: 0, period: null, minNights: 3, validFrom: '2026-06-01', validTo: '2026-08-31', isDefault: false, description: 'Double points été 2026 (min 3 nuits)', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    // Property-scoped rule
    { ruleType: 'earning', targetRole: 'guest', scope: 'property', action: 'booking_completed', pointsAmount: 80, multiplier: 1.5, maxPointsPerPeriod: 0, period: null, minNights: 2, validFrom: null, validTo: null, isDefault: false, description: 'Points bonus Villa Vue Mer', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: propertyIds[0], targetServiceId: null },
    // Service-scoped rule
    { ruleType: 'earning', targetRole: 'guest', scope: 'service', action: 'booking_completed', pointsAmount: 60, multiplier: 1.0, maxPointsPerPeriod: 0, period: null, minNights: null, validFrom: null, validTo: null, isDefault: false, description: 'Points bonus Casbah tour', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: serviceIds[0] || null },
    // Manager earning rules
    { ruleType: 'earning', targetRole: 'manager', scope: 'global', action: 'property_verified', pointsAmount: 40, multiplier: 1.0, maxPointsPerPeriod: 0, period: null, minNights: null, validFrom: null, validTo: null, isDefault: true, description: 'Points pour propriété vérifiée', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    { ruleType: 'earning', targetRole: 'manager', scope: 'global', action: 'service_created', pointsAmount: 35, multiplier: 1.0, maxPointsPerPeriod: 0, period: null, minNights: null, validFrom: null, validTo: null, isDefault: true, description: 'Points pour service créé', targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    // Conversion rules
    { ruleType: 'conversion', targetRole: 'guest', scope: 'global', action: 'points_to_currency', pointsAmount: 0, multiplier: 1.0, maxPointsPerPeriod: 0, period: null, minNights: null, validFrom: null, validTo: null, isDefault: true, description: 'Conversion points en DZD pour les invités', conversionRate: 10.0, currency: 'DZD', minPointsForConversion: 500, targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
    { ruleType: 'conversion', targetRole: 'manager', scope: 'global', action: 'points_to_currency', pointsAmount: 0, multiplier: 1.0, maxPointsPerPeriod: 0, period: null, minNights: null, validFrom: null, validTo: null, isDefault: true, description: 'Conversion points en DZD pour les managers', conversionRate: 15.0, currency: 'DZD', minPointsForConversion: 1000, targetHostId: null, targetPropertyGroupId: null, targetServiceGroupId: null, targetPropertyId: null, targetServiceId: null },
  ];

  for (const r of rules) {
    await qr.query(
      `INSERT INTO points_rules (id, createdByUserId, ruleType, targetRole, scope, action, pointsAmount, multiplier, maxPointsPerPeriod, period, minNights, validFrom, validTo, isDefault, isActive, description, conversionRate, currency, minPointsForConversion, targetHostId, targetPropertyGroupId, targetServiceGroupId, targetPropertyId, targetServiceId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(), hyperAdminId, r.ruleType, r.targetRole, r.scope, r.action, r.pointsAmount,
        r.multiplier, r.maxPointsPerPeriod, r.period, r.minNights, r.validFrom, r.validTo,
        r.isDefault, r.description,
        (r as any).conversionRate || null, (r as any).currency || 'DZD', (r as any).minPointsForConversion || null,
        r.targetHostId, r.targetPropertyGroupId, r.targetServiceGroupId, r.targetPropertyId, r.targetServiceId,
      ]
    );
  }
  await qr.release();
  console.log(`✅ Created ${rules.length} points rules`);
}

// ─── Service Fee Rules Seed ────────────────────────────────────────────────

async function seedServiceFeeRules(ds: DataSource, hyperAdminId: number, adminIds: number[], propertyIds: string[]) {
  const qr = ds.createQueryRunner();

  const feeRules = [
    // Global rules
    { scope: 'global', calculationType: 'percentage', percentageRate: 10.0, fixedAmount: 0, fixedThreshold: null, minFee: 500, maxFee: null, isDefault: true, priority: 100, description: 'Frais de service global 10%', targetHostId: null, targetPropertyGroupId: null, targetPropertyId: null, targetServiceGroupId: null, targetServiceId: null },
    { scope: 'global', calculationType: 'fixed', percentageRate: 0, fixedAmount: 1000, fixedThreshold: null, minFee: null, maxFee: null, isDefault: false, priority: 90, description: 'Frais fixe 1000 DZD pour petites réservations', targetHostId: null, targetPropertyGroupId: null, targetPropertyId: null, targetServiceGroupId: null, targetServiceId: null },
    { scope: 'global', calculationType: 'percentage_plus_fixed', percentageRate: 5.0, fixedAmount: 500, fixedThreshold: null, minFee: 600, maxFee: 5000, isDefault: false, priority: 80, description: '5% + 500 DZD (min 600, max 5000)', targetHostId: null, targetPropertyGroupId: null, targetPropertyId: null, targetServiceGroupId: null, targetServiceId: null },
    { scope: 'global', calculationType: 'fixed_then_percentage', percentageRate: 8.0, fixedAmount: 1500, fixedThreshold: 20000, minFee: 1500, maxFee: 10000, isDefault: false, priority: 70, description: '1500 DZD fixe jusqu\'à 20000, puis 8% au-delà (max 10000)', targetHostId: null, targetPropertyGroupId: null, targetPropertyId: null, targetServiceGroupId: null, targetServiceId: null },
    // Host-scoped fee (hands-to-hands for admin1)
    { scope: 'host', calculationType: 'percentage', percentageRate: 7.0, fixedAmount: 0, fixedThreshold: null, minFee: 300, maxFee: null, isDefault: false, priority: 50, description: 'Frais réduits pour admin1 (hands-to-hands)', targetHostId: adminIds[0], targetPropertyGroupId: null, targetPropertyId: null, targetServiceGroupId: null, targetServiceId: null },
    // Property-scoped fee
    { scope: 'property', calculationType: 'percentage', percentageRate: 12.0, fixedAmount: 0, fixedThreshold: null, minFee: 800, maxFee: null, isDefault: false, priority: 40, description: 'Frais premium Villa Vue Mer', targetHostId: null, targetPropertyGroupId: null, targetPropertyId: propertyIds[0], targetServiceGroupId: null, targetServiceId: null },
  ];

  for (const f of feeRules) {
    await qr.query(
      `INSERT INTO service_fee_rules (id, createdByUserId, scope, calculationType, percentageRate, fixedAmount, fixedThreshold, minFee, maxFee, isDefault, isActive, priority, description, targetHostId, targetPropertyGroupId, targetPropertyId, targetServiceGroupId, targetServiceId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(), hyperAdminId, f.scope, f.calculationType, f.percentageRate, f.fixedAmount,
        f.fixedThreshold, f.minFee, f.maxFee, f.isDefault, f.priority, f.description,
        f.targetHostId, f.targetPropertyGroupId, f.targetPropertyId, f.targetServiceGroupId, f.targetServiceId,
      ]
    );
  }
  await qr.release();
  console.log(`✅ Created ${feeRules.length} service fee rules`);
}

// ─── Property & Service Groups Seed ─────────────────────────────────────────

async function seedGroups(ds: DataSource, adminIds: number[], propertyIds: string[], serviceIds: string[]) {
  const qr = ds.createQueryRunner();

  // Property groups
  const propGroups = [
    { name: 'Propriétés Côtières', description: 'Villas et appartements en bord de mer', adminId: adminIds[0] },
    { name: 'Propriétés Montagne', description: 'Chalets et maisons en montagne', adminId: adminIds[0] },
    { name: 'Propriétés Sahara', description: 'Riads et logements au sud', adminId: adminIds[1] },
  ];

  const propGroupIds: string[] = [];
  for (const g of propGroups) {
    const id = uuidv4();
    await qr.query(
      `INSERT INTO property_groups (id, name, description, adminId, isActive) VALUES (?, ?, ?, ?, 1)`,
      [id, g.name, g.description, g.adminId]
    );
    propGroupIds.push(id);
  }

  // Add properties to groups
  const propMemberships = [
    { groupIdx: 0, propIdxList: [0, 1, 5] },   // Coastal: Villa Vue Mer, Appart Centre, Hotel Oran
    { groupIdx: 1, propIdxList: [3, 8] },        // Mountain: Chalet Tikjda, Maison Kabyle
    { groupIdx: 2, propIdxList: [4, 11] },       // Sahara: Riad Ghardaia, Riad Tamanrasset
  ];
  for (const m of propMemberships) {
    for (const pIdx of m.propIdxList) {
      if (propertyIds[pIdx]) {
        await qr.query(
          `INSERT INTO property_group_memberships (id, propertyGroupId, propertyId) VALUES (?, ?, ?)`,
          [uuidv4(), propGroupIds[m.groupIdx], propertyIds[pIdx]]
        );
      }
    }
  }

  // Service groups
  const svcGroups = [
    { name: 'Visites Culturelles', description: 'Tours guidés et activités culturelles', adminId: adminIds[0] },
    { name: 'Artisanat & Bien-être', description: 'Ateliers artisanaux et spa', adminId: adminIds[1] },
  ];

  const svcGroupIds: string[] = [];
  for (const g of svcGroups) {
    const id = uuidv4();
    await qr.query(
      `INSERT INTO service_groups (id, name, description, adminId, isActive) VALUES (?, ?, ?, ?, 1)`,
      [id, g.name, g.description, g.adminId]
    );
    svcGroupIds.push(id);
  }

  // Add services to groups
  if (serviceIds.length >= 6) {
    const svcMemberships = [
      { groupIdx: 0, svcIdxList: [0, 1, 3] },   // Cultural: Casbah, Boat, Hiking
      { groupIdx: 1, svcIdxList: [5, 6, 9] },    // Artisan: Hammam, Silver, Henna
    ];
    for (const m of svcMemberships) {
      for (const sIdx of m.svcIdxList) {
        if (serviceIds[sIdx]) {
          await qr.query(
            `INSERT INTO service_group_memberships (id, serviceGroupId, serviceId) VALUES (?, ?, ?)`,
            [uuidv4(), svcGroupIds[m.groupIdx], serviceIds[sIdx]]
          );
        }
      }
    }
  }

  await qr.release();
  console.log(`✅ Created ${propGroups.length} property groups, ${svcGroups.length} service groups with memberships`);
}

// ─── Referrals Seed ─────────────────────────────────────────────────────────

async function seedReferrals(ds: DataSource, userIds: number[], propertyIds: string[]) {
  const qr = ds.createQueryRunner();

  const referrals = [
    { referrerId: userIds[6], referredUserId: userIds[7], code: 'REF-A1B2C3D4', method: 'email', status: 'completed', referrerPts: 100, referredPts: 50, inviteeContact: 'sara@yopmail.com' },
    { referrerId: userIds[6], referredUserId: userIds[8], code: 'REF-E5F6G7H8', method: 'whatsapp', status: 'signed_up', referrerPts: 0, referredPts: 0, inviteeContact: '+213550000008' },
    { referrerId: userIds[7], referredUserId: null, code: 'REF-I9J0K1L2', method: 'link', status: 'pending', referrerPts: 0, referredPts: 0, inviteeContact: null },
    { referrerId: userIds[2], referredUserId: userIds[9], code: 'REF-M3N4O5P6', method: 'email', status: 'completed', referrerPts: 100, referredPts: 50, inviteeContact: 'nadia@yopmail.com' },
  ];

  for (const r of referrals) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);
    await qr.query(
      `INSERT INTO referrals (id, referrerId, referredUserId, code, method, status, referrerPointsAwarded, referredPointsAwarded, inviteeContact, expiresAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), r.referrerId, r.referredUserId, r.code, r.method, r.status, r.referrerPts, r.referredPts, r.inviteeContact, expiresAt]
    );
  }

  // Property shares
  const shares = [
    { userId: userIds[6], propertyId: propertyIds[0], method: 'facebook' },
    { userId: userIds[7], propertyId: propertyIds[0], method: 'whatsapp' },
    { userId: userIds[8], propertyId: propertyIds[4], method: 'email', recipient: 'friend@yopmail.com' },
    { userId: userIds[6], propertyId: propertyIds[9], method: 'copy_link' },
    { userId: userIds[9], propertyId: propertyIds[6], method: 'twitter' },
  ];

  for (const s of shares) {
    await qr.query(
      `INSERT INTO property_shares (id, userId, propertyId, method, recipient)
       VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), s.userId, s.propertyId, s.method, (s as any).recipient || null]
    );
  }

  await qr.release();
  console.log(`✅ Created ${referrals.length} referrals and ${shares.length} property shares`);
}

// ─── Rewards Seed ───────────────────────────────────────────────────────────

async function seedRewards(ds: DataSource, hyperAdminId: number, guestIds: number[]) {
  const qr = ds.createQueryRunner();

  const rewards = [
    { name: '10% Réduction Réservation', description: 'Obtenez 10% de réduction sur votre prochaine réservation', type: 'discount', pointsCost: 200, discountPercent: 10, discountAmount: 0, icon: '🏷️', category: 'discounts', requiredTier: null, maxRedemptions: 500, maxPerUser: 5, sortOrder: 10 },
    { name: '500 DZD de réduction', description: '500 DZD de réduction immédiate sur une réservation', type: 'discount', pointsCost: 100, discountPercent: 0, discountAmount: 500, icon: '💵', category: 'discounts', requiredTier: null, maxRedemptions: 1000, maxPerUser: 10, sortOrder: 20 },
    { name: 'Surclassement chambre', description: 'Surclassement vers une chambre supérieure (selon disponibilité)', type: 'upgrade', pointsCost: 500, discountPercent: 0, discountAmount: 0, icon: '⬆️', category: 'upgrades', requiredTier: 'silver', maxRedemptions: 100, maxPerUser: 2, sortOrder: 30 },
    { name: 'Nuit gratuite', description: 'Une nuit gratuite dans un hébergement partenaire', type: 'free_night', pointsCost: 1000, discountPercent: 0, discountAmount: 0, icon: '🌙', category: 'experiences', requiredTier: 'gold', maxRedemptions: 50, maxPerUser: 1, sortOrder: 40 },
    { name: 'Visite guidée gratuite', description: 'Un service de visite guidée offert', type: 'free_service', pointsCost: 300, discountPercent: 0, discountAmount: 0, icon: '🎁', category: 'services', requiredTier: null, maxRedemptions: 200, maxPerUser: 3, sortOrder: 50 },
    { name: 'Cashback 1000 DZD', description: '1000 DZD crédités sur votre compte', type: 'cashback', pointsCost: 800, discountPercent: 0, discountAmount: 1000, icon: '💰', category: 'gifts', requiredTier: 'silver', maxRedemptions: 200, maxPerUser: 5, sortOrder: 60 },
    { name: '25% Réduction Premium', description: '25% de réduction exclusive pour les membres Platinum+', type: 'discount', pointsCost: 1500, discountPercent: 25, discountAmount: 0, icon: '👑', category: 'discounts', requiredTier: 'platinum', maxRedemptions: 30, maxPerUser: 1, sortOrder: 70 },
    { name: 'Petit-déjeuner offert', description: 'Petit-déjeuner traditionnel offert lors de votre séjour', type: 'free_service', pointsCost: 150, discountPercent: 0, discountAmount: 0, icon: '🥐', category: 'services', requiredTier: null, maxRedemptions: 300, maxPerUser: 5, sortOrder: 80 },
  ];

  const rewardIds: string[] = [];
  for (const r of rewards) {
    const id = uuidv4();
    await qr.query(
      `INSERT INTO rewards (id, name, description, type, pointsCost, discountPercent, discountAmount, currency, icon, category, requiredTier, maxRedemptions, currentRedemptions, maxPerUser, status, sortOrder, createdByUserId)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'DZD', ?, ?, ?, ?, 0, ?, 'active', ?, ?)`,
      [id, r.name, r.description, r.type, r.pointsCost, r.discountPercent, r.discountAmount, r.icon, r.category, r.requiredTier, r.maxRedemptions, r.maxPerUser, r.sortOrder, hyperAdminId]
    );
    rewardIds.push(id);
  }

  // Sample redemptions
  const redemptions = [
    { userId: guestIds[0], rewardIdx: 0, pointsSpent: 200, code: 'RWD-A1B2C3D4', status: 'confirmed' },
    { userId: guestIds[0], rewardIdx: 4, pointsSpent: 300, code: 'RWD-E5F6G7H8', status: 'used' },
    { userId: guestIds[1], rewardIdx: 1, pointsSpent: 100, code: 'RWD-I9J0K1L2', status: 'confirmed' },
  ];

  for (const rd of redemptions) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);
    await qr.query(
      `INSERT INTO reward_redemptions (id, userId, rewardId, pointsSpent, code, status, expiresAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), rd.userId, rewardIds[rd.rewardIdx], rd.pointsSpent, rd.code, rd.status, expiresAt]
    );
  }

  await qr.release();
  console.log(`✅ Created ${rewards.length} rewards and ${redemptions.length} redemptions`);
}

// ─── Main Runner ────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting ByootDZ Database Seeder...\n');

  await AppDataSource.initialize();
  console.log('✅ Database connected\n');

  try {
    // 1. Users
    const userIds = await seedUsers(AppDataSource);
    await seedUserRoles(AppDataSource, userIds);
    await seedProfiles(AppDataSource, userIds);

    // 2. Properties
    const adminIds = [userIds[2], userIds[3]];
    const propertyIds = await seedProperties(AppDataSource, adminIds);
    await seedPropertyImages(AppDataSource, propertyIds);

    // 3. Manager assignments & permissions
    const assignmentIds = await seedManagerAssignments(AppDataSource, userIds, propertyIds);
    await seedManagerPermissions(AppDataSource, assignmentIds);

    // 4. Tourism services
    const serviceIds = await seedTourismServices(AppDataSource, adminIds);

    // 5. Groups
    await seedGroups(AppDataSource, adminIds, propertyIds, serviceIds);

    // 6. Bookings & Reviews
    const guestIds = [userIds[6], userIds[7], userIds[8], userIds[9], userIds[2]];
    const bookingIds = await seedBookings(AppDataSource, propertyIds, guestIds);
    await seedReviews(AppDataSource, propertyIds, guestIds);

    // 7. Verification documents
    await seedVerificationDocs(AppDataSource, propertyIds, adminIds);

    // 8. Transfer accounts & payment receipts
    const transferAccountIds = await seedTransferAccounts(AppDataSource);
    await seedPaymentReceipts(AppDataSource, bookingIds, guestIds, transferAccountIds, userIds[0]);

    // 9. Social & system data
    await seedNotifications(AppDataSource, userIds);
    await seedFavorites(AppDataSource, propertyIds, guestIds);
    await seedRankings(AppDataSource, adminIds);
    await seedComments(AppDataSource, propertyIds, userIds);

    // 10. Points rules, service fee rules, referrals
    await seedPointsRules(AppDataSource, userIds[0], propertyIds, serviceIds);
    await seedServiceFeeRules(AppDataSource, userIds[0], adminIds, propertyIds);
    await seedReferrals(AppDataSource, userIds, propertyIds);

    // 11. Rewards & redemptions
    await seedRewards(AppDataSource, userIds[0], guestIds);

    console.log('\n═══════════════════════════════════════════');
    console.log('  ✅ Seeding complete!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📋 Summary:');
    console.log(`   Users:              ${userIds.length}`);
    console.log(`   Properties:         ${propertyIds.length}`);
    console.log(`   Manager Assignments: ${assignmentIds.length}`);
    console.log(`   Tourism Services:   13`);
    console.log(`   Bookings:           ${bookingIds.length}`);
    console.log(`   Reviews:            8`);
    console.log(`   Transfer Accounts:  ${transferAccountIds.length}`);
    console.log(`   Payment Receipts:   6`);
    console.log(`   Points Rules:       14`);
    console.log(`   Service Fee Rules:  6`);
    console.log(`   Referrals:          4`);
    console.log(`   Rewards:            8`);
    console.log(`   Redemptions:        3`);
    console.log('\n🔑 Default password: Password123!');
    console.log('   Hyper Admin:      hyper_admin_byootdz@yopmail.com');
    console.log('   Hyper Manager:    hyper_manager_byootdz@yopmail.com');
    console.log('   Admin 1:          admin1_byootdz@yopmail.com');
    console.log('   Admin 2:          admin2_byootdz@yopmail.com');
    console.log('   Manager 1:        manager1_byootdz@yopmail.com');
    console.log('   Manager 2:        manager2_byootdz@yopmail.com');
    console.log('   Guests:           guest1_byootdz@yopmail.com - guest5_byootdz@yopmail.com\n');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
