/**
 * Database Seed Script
 * 
 * Creates sample users, profiles, properties, bookings, reviews,
 * verification documents, notifications, favorites, rankings, and comments.
 * 
 * Properties match the frontend MOCK_PROPERTIES data exactly.
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

  const users = [
    { email: 'admin@byootdz.com', phoneNbr: '+213550000001', cardId: 'CID0001', passportId: 'P001', roles: 'hyper_manager', firstName: 'Karim', lastName: 'Bensalah', title: 'Mr', city: 'Alger', country: 'Algeria' },
    { email: 'manager@byootdz.com', phoneNbr: '+213550000002', cardId: 'CID0002', passportId: 'P002', roles: 'admin', firstName: 'Amina', lastName: 'Mebarki', title: 'Mme', city: 'Oran', country: 'Algeria' },
    { email: 'host1@byootdz.com', phoneNbr: '+213550000003', cardId: 'CID0003', passportId: 'P003', roles: 'user', firstName: 'Yacine', lastName: 'Khelifi', title: 'Mr', city: 'Tipaza', country: 'Algeria' },
    { email: 'host2@byootdz.com', phoneNbr: '+213550000004', cardId: 'CID0004', passportId: 'P004', roles: 'user', firstName: 'Lina', lastName: 'Bouaziz', title: 'Mme', city: 'Constantine', country: 'Algeria' },
    { email: 'host3@byootdz.com', phoneNbr: '+213550000005', cardId: 'CID0005', passportId: 'P005', roles: 'user', firstName: 'Omar', lastName: 'Touati', title: 'Mr', city: 'Ghardaïa', country: 'Algeria' },
    { email: 'host4@byootdz.com', phoneNbr: '+213550000006', cardId: 'CID0006', passportId: 'P006', roles: 'user', firstName: 'Fatima', lastName: 'Zeroual', title: 'Mme', city: 'Béjaïa', country: 'Algeria' },
    { email: 'guest1@byootdz.com', phoneNbr: '+213550000007', cardId: 'CID0007', passportId: 'P007', roles: 'user', firstName: 'Sara', lastName: 'Hadj', title: 'Mme', city: 'Annaba', country: 'Algeria' },
    { email: 'guest2@byootdz.com', phoneNbr: '+213550000008', cardId: 'CID0008', passportId: 'P008', roles: 'user', firstName: 'Raouf', lastName: 'Brahimi', title: 'Mr', city: 'Tizi Ouzou', country: 'Algeria' },
    { email: 'guest3@byootdz.com', phoneNbr: '+213550000009', cardId: 'CID0009', passportId: 'P009', roles: 'user', firstName: 'Nadia', lastName: 'Ferhat', title: 'Mme', city: 'Bouira', country: 'Algeria' },
    { email: 'guest4@byootdz.com', phoneNbr: '+213550000010', cardId: 'CID0010', passportId: 'P010', roles: 'user', firstName: 'Mehdi', lastName: 'Ziani', title: 'Mr', city: 'Alger', country: 'Algeria' },
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
  const roles = [
    { userId: userIds[0], role: 'hyper_manager' },
    { userId: userIds[0], role: 'admin' },
    { userId: userIds[1], role: 'admin' },
    { userId: userIds[1], role: 'manager' },
    { userId: userIds[2], role: 'user' },
    { userId: userIds[3], role: 'user' },
    { userId: userIds[4], role: 'user' },
    { userId: userIds[5], role: 'user' },
    { userId: userIds[6], role: 'user' },
    { userId: userIds[7], role: 'user' },
    { userId: userIds[8], role: 'user' },
    { userId: userIds[9], role: 'user' },
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
  const wilayas = ['Alger', 'Oran', 'Tipaza', 'Constantine', 'Ghardaïa', 'Béjaïa', 'Annaba', 'Tizi Ouzou', 'Bouira', 'Alger'];
  const names = ['Karim B.', 'Amina M.', 'Yacine K.', 'Lina B.', 'Omar T.', 'Fatima Z.', 'Sara H.', 'Raouf B.', 'Nadia F.', 'Mehdi Z.'];
  const bios = [
    'Platform administrator and travel enthusiast.',
    'Property manager with 5 years experience.',
    'Superhost in Tipaza, villa specialist with sea views.',
    'Host in Constantine, traditional homes expert.',
    'Riad and desert property specialist in Ghardaïa.',
    'Seaside property host in Béjaïa and Annaba.',
    'Frequent traveler across Algeria.',
    'Mountain and nature enthusiast from Tizi Ouzou.',
    'Nature photographer and guest reviewer.',
    'City explorer and penthouse lover.',
  ];

  for (let i = 0; i < userIds.length; i++) {
    const isHost = i >= 2 && i <= 5;
    await qr.query(
      `INSERT INTO profiles (id, userId, displayName, avatarUrl, bio, city, wilaya, country, languages, isHost, isSuperhost, identityVerified, preferredLanguage, preferredCurrency)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(), userIds[i], names[i],
        `${MEDIA_BASE}/avatars/user_${i + 1}.jpg`,
        bios[i],
        wilayas[i], wilayas[i], 'Algeria',
        JSON.stringify(['fr', 'ar', ...(i % 2 === 0 ? ['en'] : [])]),
        isHost, isHost && (i === 2 || i === 4), i < 6,
        i % 3 === 0 ? 'ar' : 'fr', 'DZD',
      ]
    );
  }
  await qr.release();
  console.log(`✅ Created ${userIds.length} profiles`);
}

async function seedProperties(ds: DataSource, hostIds: number[]): Promise<string[]> {
  const qr = ds.createQueryRunner();
  const propertyIds: string[] = [];

  // Properties matching frontend MOCK_PROPERTIES exactly
  const properties = [
    {
      hostId: hostIds[0],
      title: 'Villa Vue Mer Luxueuse',
      desc: JSON.stringify({
        fr: `Magnifique villa moderne située sur les hauteurs de Tipaza avec une vue imprenable sur la mer Méditerranée. Cette propriété d'exception offre un cadre idyllique pour des vacances en famille ou entre amis.\n\nLa villa dispose de grands espaces de vie lumineux, d'une cuisine entièrement équipée et d'une terrasse panoramique parfaite pour admirer les couchers de soleil. La piscine privée et le jardin paysager complètent cette propriété de rêve.\n\nÀ seulement 10 minutes en voiture des plages et du centre-ville, vous pourrez profiter à la fois du calme de la campagne et de la proximité des commodités.`,
        en: `Magnificent modern villa perched on the heights of Tipaza with breathtaking views of the Mediterranean Sea. This exceptional property offers an idyllic setting for family or friends vacations.\n\nThe villa features bright, spacious living areas, a fully equipped kitchen, and a panoramic terrace perfect for watching sunsets. The private pool and landscaped garden complete this dream property.\n\nJust 10 minutes by car from the beaches and town center, you can enjoy both the tranquility of the countryside and the convenience of nearby amenities.`,
        ar: `فيلا عصرية رائعة تقع على مرتفعات تيبازة مع إطلالة خلابة على البحر الأبيض المتوسط. هذا العقار الاستثنائي يوفر إطارًا مثاليًا لقضاء عطلة مع العائلة أو الأصدقاء.\n\nتتميز الفيلا بمساحات معيشة واسعة ومشرقة، ومطبخ مجهز بالكامل، وشرفة بانورامية مثالية للاستمتاع بغروب الشمس. المسبح الخاص والحديقة المنسقة يكملان هذا العقار الحلم.\n\nتبعد 10 دقائق فقط بالسيارة عن الشواطئ ووسط المدينة، مما يتيح لك الاستمتاع بهدوء الريف وقرب المرافق في آن واحد.`,
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
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[0],
      title: 'Appartement Moderne Centre-Ville',
      desc: JSON.stringify({
        fr: 'Appartement moderne et lumineux au cœur d\'Alger Centre. Entièrement rénové avec des finitions haut de gamme. Proche de toutes commodités, restaurants et transports.',
        en: 'Modern and bright apartment in the heart of Algiers city center. Fully renovated with high-end finishes. Close to all amenities, restaurants, and public transport.',
        ar: 'شقة عصرية ومشرقة في قلب وسط مدينة الجزائر. مجددة بالكامل بتشطيبات راقية. قريبة من جميع المرافق والمطاعم ووسائل النقل.',
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
        'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[1],
      title: 'Maison Traditionnelle Casbah',
      desc: JSON.stringify({
        fr: 'Magnifique maison traditionnelle au cœur de la vieille ville de Constantine. Architecture authentique préservée avec confort moderne. Vue imprenable sur les gorges.',
        en: 'Magnificent traditional house in the heart of Constantine\'s old city. Preserved authentic architecture with modern comfort. Stunning views of the gorges.',
        ar: 'منزل تقليدي رائع في قلب المدينة القديمة بقسنطينة. هندسة معمارية أصيلة محفوظة مع راحة عصرية. إطلالة خلابة على الأخاديد.',
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
        'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[2],
      title: 'Chalet de Montagne Panoramique',
      desc: JSON.stringify({
        fr: 'Chalet en bois confortable au cœur de la forêt de Tikjda. Cheminée, terrasse avec vue panoramique sur les montagnes. Idéal pour se ressourcer.',
        en: 'Comfortable wooden chalet in the heart of Tikjda forest. Fireplace, terrace with panoramic mountain views. Perfect for recharging and relaxation.',
        ar: 'شاليه خشبي مريح في قلب غابة تيكجدة. مدفأة وشرفة مع إطلالة بانورامية على الجبال. مثالي للاسترخاء وتجديد النشاط.',
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
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1470770841497-7b3200c37e1b?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[2],
      title: 'Riad Authentique avec Patio',
      desc: JSON.stringify({
        fr: 'Riad traditionnel du M\'zab avec patio intérieur et fontaine. Décoration artisanale authentique, petit-déjeuner traditionnel inclus. Une expérience unique au cœur du patrimoine mondial UNESCO.',
        en: 'Traditional M\'zab riad with interior patio and fountain. Authentic handcrafted décor, traditional breakfast included. A unique experience in the heart of a UNESCO World Heritage site.',
        ar: 'رياض تقليدي من وادي ميزاب مع فناء داخلي ونافورة. ديكور حرفي أصيل، فطور تقليدي مشمول. تجربة فريدة في قلب موقع تراث عالمي لليونسكو.',
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
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[3],
      title: 'Hôtel Boutique Front de Mer',
      desc: JSON.stringify({
        fr: 'Hôtel boutique charmant avec vue directe sur la mer à Oran. Chambres élégantes, petit-déjeuner continental, piscine sur le toit. Service hôtelier 5 étoiles.',
        en: 'Charming boutique hotel with direct sea views in Oran. Elegant rooms, continental breakfast, rooftop pool. Five-star hotel service.',
        ar: 'فندق بوتيكي ساحر مع إطلالة مباشرة على البحر في وهران. غرف أنيقة، فطور قاري، مسبح على السطح. خدمة فندقية 5 نجوم.',
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
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[3],
      title: 'Villa Jardin Exotique',
      desc: JSON.stringify({
        fr: 'Villa spacieuse avec jardin tropical luxuriant à Béjaïa. Piscine chauffée, terrasse panoramique, cuisine d\'été. Parfaite pour grandes familles ou groupes d\'amis.',
        en: 'Spacious villa with lush tropical garden in Béjaïa. Heated pool, panoramic terrace, summer kitchen. Perfect for large families or groups of friends.',
        ar: 'فيلا واسعة مع حديقة استوائية خضراء في بجاية. مسبح مدفأ، شرفة بانورامية، مطبخ صيفي. مثالية للعائلات الكبيرة أو مجموعات الأصدقاء.',
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
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[3],
      title: 'Studio Cosy Centre Historique',
      desc: JSON.stringify({
        fr: 'Studio moderne et fonctionnel au cœur du centre historique d\'Annaba. Idéal pour voyageurs solo ou couples. Proche de la basilique et des plages.',
        en: 'Modern and functional studio in the heart of Annaba\'s historic center. Ideal for solo travelers or couples. Close to the basilica and beaches.',
        ar: 'ستوديو عصري وعملي في قلب المركز التاريخي لعنابة. مثالي للمسافرين المنفردين أو الأزواج. قريب من الكنيسة والشواطئ.',
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
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[1],
      title: 'Maison Kabyle Authentique',
      desc: JSON.stringify({
        fr: 'Maison kabyle traditionnelle rénovée avec goût à Tizi Ouzou. Architecture locale préservée, jardin d\'oliviers et terrasse avec vue sur les montagnes du Djurdjura.',
        en: 'Tastefully renovated traditional Kabyle house in Tizi Ouzou. Preserved local architecture, olive garden, and terrace with views of the Djurdjura mountains.',
        ar: 'منزل قبائلي تقليدي مُجدد بذوق رفيع في تيزي وزو. هندسة معمارية محلية محفوظة، بستان زيتون وشرفة مطلة على جبال جرجرة.',
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
        'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[0],
      title: 'Penthouse Vue Panoramique',
      desc: JSON.stringify({
        fr: 'Penthouse de standing exceptionnel avec terrasse rooftop offrant une vue panoramique à 360° sur la baie d\'Alger. Finitions luxueuses, domotique intégrée.',
        en: 'Exceptional luxury penthouse with rooftop terrace offering 360° panoramic views of Algiers Bay. Luxurious finishes, integrated smart home system.',
        ar: 'بنتهاوس فاخر استثنائي مع شرفة على السطح توفر إطلالة بانورامية 360 درجة على خليج الجزائر. تشطيبات فاخرة ونظام منزل ذكي متكامل.',
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
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[2],
      title: 'Chalet Bord de Lac',
      desc: JSON.stringify({
        fr: 'Chalet rustique au bord du lac Tonga à El Kala. Entouré de nature sauvage, idéal pour randonnées et observation d\'oiseaux. Parc national à proximité.',
        en: 'Rustic chalet on the shores of Lake Tonga in El Kala. Surrounded by wild nature, ideal for hiking and birdwatching. National park nearby.',
        ar: 'شاليه ريفي على ضفاف بحيرة طونقا في القالة. محاط بالطبيعة البرية، مثالي للمشي لمسافات طويلة ومراقبة الطيور. حديقة وطنية قريبة.',
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
        'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1470770841497-7b3200c37e1b?w=1200&auto=format&fit=crop',
      ],
    },
    {
      hostId: hostIds[2],
      title: 'Riad Luxueux Sahara',
      desc: JSON.stringify({
        fr: 'Riad luxueux aux portes du Sahara à Tamanrasset. Architecture touareg authentique, piscine intérieure, excursions dans le Hoggar organisées. Petit-déjeuner saharien inclus.',
        en: 'Luxurious riad at the gates of the Sahara in Tamanrasset. Authentic Tuareg architecture, indoor pool, organized Hoggar excursions. Saharan breakfast included.',
        ar: 'رياض فاخر عند بوابات الصحراء في تمنراست. هندسة معمارية طوارقية أصيلة، مسبح داخلي، رحلات منظمة في الهقار. فطور صحراوي مشمول.',
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
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop',
      ],
    },
  ];

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    const id = uuidv4();
    const rules = HOUSE_RULES.sort(() => 0.5 - Math.random()).slice(0, randomBetween(2, 5));
    const payments = PAYMENT_METHODS.sort(() => 0.5 - Math.random()).slice(0, randomBetween(2, 4));

    const pricePerWeek = p.weeklyDiscount > 0
      ? Math.round(p.price * 7 * (1 - p.weeklyDiscount / 100))
      : null;
    const pricePerMonth = p.monthlyDiscount > 0
      ? Math.round(p.price * 30 * (1 - p.monthlyDiscount / 100))
      : null;

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

async function seedPropertyImages(ds: DataSource, propertyIds: string[]) {
  const qr = ds.createQueryRunner();
  let count = 0;

  // Curated gallery images per property (matching property types)
  const propertyGalleries: string[][] = [
    // 1: Villa Vue Mer (Tipaza) - luxury villa
    [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&auto=format&fit=crop',
    ],
    // 2: Appartement Moderne (Alger)
    [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop',
    ],
    // 3: Maison Traditionnelle (Constantine)
    [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&auto=format&fit=crop',
    ],
    // 4: Chalet Montagne (Tikjda)
    [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470770841497-7b3200c37e1b?w=1200&auto=format&fit=crop',
    ],
    // 5: Riad Authentique (Ghardaïa)
    [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d8f568e3f?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop',
    ],
    // 6: Hôtel Boutique (Oran)
    [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&auto=format&fit=crop',
    ],
    // 7: Villa Jardin (Béjaïa)
    [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop',
    ],
    // 8: Studio Cosy (Annaba)
    [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&auto=format&fit=crop',
    ],
    // 9: Maison Kabyle (Tizi Ouzou)
    [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1200&auto=format&fit=crop',
    ],
    // 10: Penthouse (Alger)
    [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&auto=format&fit=crop',
    ],
    // 11: Chalet Bord de Lac (El Kala)
    [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470770841497-7b3200c37e1b?w=1200&auto=format&fit=crop',
    ],
    // 12: Riad Sahara (Tamanrasset)
    [
      'https://images.unsplash.com/photo-1590490360182-c33d8f568e3f?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop',
    ],
  ];

  for (let pi = 0; pi < propertyIds.length; pi++) {
    const gallery = propertyGalleries[pi % propertyGalleries.length];
    for (let j = 0; j < gallery.length; j++) {
      await qr.query(
        `INSERT INTO property_images (id, propertyId, url, caption, sortOrder, isCover)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(), propertyIds[pi],
          gallery[j],
          j === 0 ? 'Cover photo' : `Photo ${j + 1}`,
          j, j === 0,
        ]
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

  const prices = [15000, 12000, 6500, 10000, 7000, 15000, 18000, 9500, 11000, 22000, 8000, 13000];

  const bookings = [
    { propIdx: 0, guestIdx: 0, checkIn: pastDate(60), checkOut: pastDate(55), nights: 5, guests: 4, status: 'completed', payStatus: 'paid', payMethod: 'ccp', msg: 'Nous avons hâte de séjourner dans votre villa!' },
    { propIdx: 2, guestIdx: 1, checkIn: pastDate(45), checkOut: pastDate(38), nights: 7, guests: 2, status: 'completed', payStatus: 'paid', payMethod: 'bank_transfer', msg: 'Magnifique maison traditionnelle!' },
    { propIdx: 5, guestIdx: 2, checkIn: pastDate(30), checkOut: pastDate(27), nights: 3, guests: 1, status: 'completed', payStatus: 'paid', payMethod: 'baridi_mob', msg: null },
    { propIdx: 3, guestIdx: 3, checkIn: pastDate(20), checkOut: pastDate(16), nights: 4, guests: 3, status: 'completed', payStatus: 'paid', payMethod: 'cash', msg: 'Avez-vous un parking?' },
    { propIdx: 8, guestIdx: 0, checkIn: pastDate(10), checkOut: pastDate(5), nights: 5, guests: 6, status: 'completed', payStatus: 'paid', payMethod: 'ccp', msg: null },
    { propIdx: 0, guestIdx: 1, checkIn: futureDate(5), checkOut: futureDate(10), nights: 5, guests: 2, status: 'confirmed', payStatus: 'paid', payMethod: 'edahabia', msg: 'Premier séjour chez vous, très enthousiaste!' },
    { propIdx: 6, guestIdx: 0, checkIn: futureDate(15), checkOut: futureDate(22), nights: 7, guests: 4, status: 'confirmed', payStatus: 'partial', payMethod: 'bank_transfer', msg: 'Nous sommes un couple avec 2 enfants.' },
    { propIdx: 4, guestIdx: 2, checkIn: futureDate(20), checkOut: futureDate(23), nights: 3, guests: 2, status: 'pending', payStatus: 'pending', payMethod: null, msg: 'Le petit-déjeuner est-il inclus?' },
    { propIdx: 10, guestIdx: 3, checkIn: futureDate(30), checkOut: futureDate(37), nights: 7, guests: 5, status: 'pending', payStatus: 'pending', payMethod: null, msg: null },
    { propIdx: 9, guestIdx: 1, checkIn: pastDate(15), checkOut: pastDate(12), nights: 3, guests: 2, status: 'cancelled', payStatus: 'refunded', payMethod: 'ccp', msg: 'Changement de plans, désolé.' },
    // Extra bookings for host management page variety
    { propIdx: 0, guestIdx: 2, checkIn: futureDate(25), checkOut: futureDate(30), nights: 5, guests: 3, status: 'pending', payStatus: 'pending', payMethod: null, msg: 'Est-ce que la piscine est ouverte en cette saison?' },
    { propIdx: 0, guestIdx: 3, checkIn: futureDate(40), checkOut: futureDate(45), nights: 5, guests: 2, status: 'rejected', payStatus: 'failed', payMethod: null, msg: 'Nous cherchons un endroit calme.' },
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

    await qr.query(
      `INSERT INTO bookings (id, propertyId, guestId, checkInDate, checkOutDate, numberOfGuests, numberOfNights, pricePerNight, cleaningFee, serviceFee, discountPercent, discountType, effectiveRate, subtotal, totalPrice, currency, status, paymentStatus, paymentMethod, guestMessage, confirmedAt, cancelledAt, cancellationReason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, propertyIds[b.propIdx], guestIds[b.guestIdx],
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
    { propIdx: 0, guestIdx: 0, rating: 5, comment: 'Séjour exceptionnel! La villa est encore plus belle en vrai. Karim est un hôte très attentionné. Je recommande vivement!' },
    { propIdx: 0, guestIdx: 1, rating: 5, comment: 'Vue magnifique, piscine parfaite, tout était impeccable. Nous reviendrons certainement!' },
    { propIdx: 0, guestIdx: 2, rating: 4, comment: 'Très belle propriété, bien équipée. Petit bémol sur la route d\'accès un peu difficile mais ça vaut le détour!' },
    { propIdx: 2, guestIdx: 1, rating: 5, comment: 'La maison traditionnelle est un bijou. On se sent transporté dans le temps. Hôte charmante.' },
    { propIdx: 4, guestIdx: 2, rating: 5, comment: 'Le riad est un havre de paix. Le petit-déjeuner saharien est incroyable. Une expérience unique!' },
    { propIdx: 5, guestIdx: 0, rating: 4, comment: 'Bon rapport qualité/prix pour Oran. Chambre propre et petit-déjeuner copieux.' },
    { propIdx: 6, guestIdx: 3, rating: 5, comment: 'Villa paradisiaque! Le jardin est magnifique et la piscine chauffée est un vrai plus.' },
    { propIdx: 9, guestIdx: 1, rating: 5, comment: 'Le penthouse est à couper le souffle. Vue incroyable sur la baie d\'Alger au coucher du soleil.' },
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
    // Villa Vue Mer (5 stars) - all docs approved
    { propIdx: 0, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.98 },
    { propIdx: 0, type: 'notarized_deed', status: 'approved', aiValid: true, aiConf: 0.95 },
    { propIdx: 0, type: 'utility_bill', status: 'approved', aiValid: true, aiConf: 0.97 },
    // Appartement Moderne (3 stars) - identity + deed
    { propIdx: 1, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.96 },
    { propIdx: 1, type: 'notarized_deed', status: 'approved', aiValid: true, aiConf: 0.92 },
    // Maison Traditionnelle (5 stars)
    { propIdx: 2, type: 'passport', status: 'approved', aiValid: true, aiConf: 0.99 },
    { propIdx: 2, type: 'land_registry', status: 'approved', aiValid: true, aiConf: 0.94 },
    { propIdx: 2, type: 'utility_bill', status: 'approved', aiValid: true, aiConf: 0.96 },
    // Chalet (1 star) - identity only
    { propIdx: 3, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.93 },
    // Riad Ghardaïa (5 stars)
    { propIdx: 4, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.97 },
    { propIdx: 4, type: 'notarized_deed', status: 'approved', aiValid: true, aiConf: 0.91 },
    { propIdx: 4, type: 'utility_bill', status: 'approved', aiValid: true, aiConf: 0.95 },
    // Hotel Oran (2 stars) - identity + utility
    { propIdx: 5, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.94 },
    { propIdx: 5, type: 'utility_bill', status: 'approved', aiValid: true, aiConf: 0.90 },
    // Villa Béjaïa (3 stars)
    { propIdx: 6, type: 'passport', status: 'approved', aiValid: true, aiConf: 0.96 },
    { propIdx: 6, type: 'land_registry', status: 'approved', aiValid: true, aiConf: 0.93 },
    // Studio Annaba (0 stars) - pending
    { propIdx: 7, type: 'national_id', status: 'pending', aiValid: null, aiConf: null },
    // Maison Kabyle (2 stars)
    { propIdx: 8, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.95 },
    { propIdx: 8, type: 'utility_bill', status: 'approved', aiValid: true, aiConf: 0.88 },
    // Penthouse (5 stars)
    { propIdx: 9, type: 'national_id', status: 'approved', aiValid: true, aiConf: 0.99 },
    { propIdx: 9, type: 'notarized_deed', status: 'approved', aiValid: true, aiConf: 0.97 },
    { propIdx: 9, type: 'utility_bill', status: 'approved', aiValid: true, aiConf: 0.96 },
    // Chalet El Kala (0 stars) - rejected
    { propIdx: 10, type: 'national_id', status: 'rejected', aiValid: false, aiConf: 0.45 },
    // Riad Sahara (3 stars)
    { propIdx: 11, type: 'passport', status: 'approved', aiValid: true, aiConf: 0.94 },
    { propIdx: 11, type: 'land_registry', status: 'approved', aiValid: true, aiConf: 0.91 },
  ];

  for (const d of docs) {
    await qr.query(
      `INSERT INTO verification_documents (id, propertyId, type, fileName, fileUrl, status, aiAnalyzed, aiValidationResult, aiConfidence, aiReason, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        uuidv4(), propertyIds[d.propIdx], d.type,
        `${d.type}_prop${d.propIdx + 1}.pdf`,
        `${MEDIA_BASE}/documents/${d.type}_prop${d.propIdx + 1}.pdf`,
        d.status,
        d.aiValid !== null, d.aiValid, d.aiConf,
        d.aiValid ? 'Document verified successfully' : d.aiValid === false ? 'Document quality too low or appears altered' : null,
      ]
    );
  }
  await qr.release();
  console.log(`✅ Created ${docs.length} verification documents`);
}

async function seedNotifications(ds: DataSource, userIds: number[]) {
  const qr = ds.createQueryRunner();
  const notifications = [
    { userId: userIds[6], type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your booking at Villa Vue Mer Luxueuse has been confirmed!', read: true },
    { userId: userIds[2], type: 'new_booking', title: 'New Booking', message: 'Sara H. has booked your Villa Vue Mer Luxueuse for 5 nights.', read: true },
    { userId: userIds[7], type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your booking at Maison Traditionnelle Casbah has been confirmed!', read: false },
    { userId: userIds[2], type: 'new_review', title: 'New Review', message: 'Sara H. left a 5-star review on Villa Vue Mer Luxueuse.', read: false },
    { userId: userIds[0], type: 'system', title: 'Document Verified', message: 'Your national ID has been verified successfully.', read: true },
    { userId: userIds[4], type: 'verification_approved', title: 'Property Verified', message: 'Your Riad Authentique avec Patio has been verified. Trust level: 5★.', read: false },
    { userId: userIds[6], type: 'promotion', title: 'Special Offer', message: 'Get 15% off weekly stays at Villa Vue Mer Luxueuse!', read: false },
    { userId: userIds[8], type: 'booking_reminder', title: 'Upcoming Trip', message: 'Your stay at Chalet Bord de Lac starts in 3 days.', read: false },
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

async function seedRankings(ds: DataSource, hostIds: number[]) {
  const qr = ds.createQueryRunner();
  const rankings = [
    { userId: hostIds[0], score: 950, category: 'superhost' },
    { userId: hostIds[1], score: 820, category: 'superhost' },
    { userId: hostIds[2], score: 780, category: 'superhost' },
    { userId: hostIds[3], score: 710, category: 'top_host' },
  ];

  for (const r of rankings) {
    await qr.query(
      `INSERT INTO rankings (id, userId, score, category, createdAt)
       VALUES (?, ?, ?, ?, NOW())`,
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
    { propIdx: 0, userId: userIds[2], text: 'Oui, la piscine est chauffée de novembre à mars. Bienvenue!' },
    { propIdx: 4, userId: userIds[7], text: 'Le petit-déjeuner est-il inclus dans le prix affiché?' },
    { propIdx: 4, userId: userIds[4], text: 'Absolument! Petit-déjeuner traditionnel avec msemmen, confiture maison et thé à la menthe.' },
    { propIdx: 6, userId: userIds[8], text: 'Peut-on organiser un événement dans le jardin?' },
    { propIdx: 9, userId: userIds[9], text: 'La vue de nuit est-elle aussi spectaculaire que sur les photos?' },
    { propIdx: 9, userId: userIds[2], text: 'Encore mieux! Les lumières de la baie sont magiques.' },
  ];

  for (const c of comments) {
    await qr.query(
      `INSERT INTO comments (id, propertyId, userId, content, createdAt)
       VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), propertyIds[c.propIdx], c.userId, c.text, pastDate(randomBetween(1, 45))]
    );
  }
  await qr.release();
  console.log(`✅ Created ${comments.length} comments`);
}

// ─── Main Runner ────────────────────────────────────────────────────────────

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
    // Completed booking paid via CCP - approved receipt
    { bookingIdx: 0, guestIdx: 0, accountIdx: 0, amount: 78750, status: 'approved', reviewedBy: adminUserId, fileName: 'recu_ccp_001.jpg', note: 'Paiement vérifié sur le relevé CCP' },
    // Completed booking paid via bank_transfer - approved receipt
    { bookingIdx: 1, guestIdx: 1, accountIdx: 1, amount: 44590, status: 'approved', reviewedBy: adminUserId, fileName: 'virement_bna_002.pdf', note: 'Virement confirmé par la banque' },
    // Confirmed booking partial payment - approved receipt
    { bookingIdx: 6, guestIdx: 0, accountIdx: 0, amount: 63000, status: 'approved', reviewedBy: adminUserId, fileName: 'recu_ccp_003.jpg', note: 'Premier versement reçu, en attente du reste' },
    // Pending booking - pending receipt (awaiting admin review)
    { bookingIdx: 7, guestIdx: 2, accountIdx: 2, amount: 21000, status: 'pending', reviewedBy: null, fileName: 'recu_badr_004.jpg', note: null },
    // Another pending receipt
    { bookingIdx: 8, guestIdx: 3, accountIdx: 0, amount: 75460, status: 'pending', reviewedBy: null, fileName: 'recu_ccp_005.pdf', note: null },
    // Rejected receipt (wrong amount)
    { bookingIdx: 4, guestIdx: 0, accountIdx: 1, amount: 30000, status: 'rejected', reviewedBy: adminUserId, fileName: 'virement_bna_006.jpg', note: 'Montant incorrect - ne correspond pas au total de la réservation' },
  ];

  for (const r of receipts) {
    await qr.query(
      `INSERT INTO payment_receipts (id, bookingId, uploadedByUserId, transferAccountId, receiptUrl, originalFileName, amount, currency, status, reviewedByUserId, reviewedAt, reviewNote, guestNote)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'DZD', ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        bookingIds[r.bookingIdx],
        guestIds[r.guestIdx],
        accountIds[r.accountIdx],
        `${MEDIA_BASE}/receipts/${r.fileName}`,
        r.fileName,
        r.amount,
        r.status,
        r.reviewedBy,
        r.status !== 'pending' ? pastDate(randomBetween(1, 30)) : null,
        r.note,
        r.status === 'pending' ? 'Voici mon reçu de paiement' : null,
      ]
    );
  }
  await qr.release();
  console.log(`✅ Created ${receipts.length} payment receipts`);
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

    // 2. Properties (hosts are users at indices 2,3,4,5)
    const hostIds = [userIds[2], userIds[3], userIds[4], userIds[5]];
    const propertyIds = await seedProperties(AppDataSource, hostIds);
    await seedPropertyImages(AppDataSource, propertyIds);

    // 3. Bookings & Reviews (guests are users at indices 6,7,8,9)
    const guestIds = [userIds[6], userIds[7], userIds[8], userIds[9]];
    const bookingIds = await seedBookings(AppDataSource, propertyIds, guestIds);
    await seedReviews(AppDataSource, propertyIds, guestIds);

    // 4. Verification documents
    await seedVerificationDocs(AppDataSource, propertyIds, hostIds);

    // 5. Transfer accounts & payment receipts
    const transferAccountIds = await seedTransferAccounts(AppDataSource);
    await seedPaymentReceipts(AppDataSource, bookingIds, guestIds, transferAccountIds, userIds[0]);

    // 6. Social & system data
    await seedNotifications(AppDataSource, userIds);
    await seedFavorites(AppDataSource, propertyIds, guestIds);
    await seedRankings(AppDataSource, hostIds);
    await seedComments(AppDataSource, propertyIds, userIds);

    console.log('\n═══════════════════════════════════════════');
    console.log('  ✅ Seeding complete!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📋 Summary:');
    console.log(`   Users:              ${userIds.length}`);
    console.log(`   Properties:         ${propertyIds.length}`);
    console.log(`   Bookings:           ${bookingIds.length}`);
    console.log(`   Reviews:            8`);
    console.log(`   Documents:          25`);
    console.log(`   Transfer Accounts:  ${transferAccountIds.length}`);
    console.log(`   Payment Receipts:   6`);
    console.log(`   Notifications:      8`);
    console.log('\n🔑 Default password: Password123!');
    console.log('   Admin: admin@byootdz.com');
    console.log('   Host:  host1@byootdz.com');
    console.log('   Guest: guest1@byootdz.com\n');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
