/**
 * Generate Media Files
 * 
 * Downloads real property photos from Unsplash and creates
 * the /media folder structure with actual images.
 * 
 * Usage: npm run seed:media
 */
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const MEDIA_ROOT = path.resolve(__dirname, '..', '..', 'media');

// ─── Folder structure ───────────────────────────────────────────────────────

const FOLDERS = [
  'avatars',
  'properties',
  'documents',
  'videos',
  'thumbnails',
];

// ─── Image URLs (Unsplash, curated per property type) ───────────────────────

const PROPERTY_IMAGES: Record<number, string[]> = {
  1: [ // Villa Vue Mer (Tipaza)
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&auto=format&fit=crop&q=80',
  ],
  2: [ // Appartement Moderne (Alger)
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop&q=80',
  ],
  3: [ // Maison Traditionnelle (Constantine)
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&auto=format&fit=crop&q=80',
  ],
  4: [ // Chalet Montagne (Tikjda)
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470770841497-7b3200c37e1b?w=1200&auto=format&fit=crop&q=80',
  ],
  5: [ // Riad Authentique (Ghardaïa)
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d8f568e3f?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
  ],
  6: [ // Hôtel Boutique (Oran)
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&auto=format&fit=crop&q=80',
  ],
  7: [ // Villa Jardin (Béjaïa)
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80',
  ],
  8: [ // Studio Cosy (Annaba)
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&auto=format&fit=crop&q=80',
  ],
  9: [ // Maison Kabyle (Tizi Ouzou)
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1200&auto=format&fit=crop&q=80',
  ],
  10: [ // Penthouse (Alger)
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&auto=format&fit=crop&q=80',
  ],
  11: [ // Chalet Bord de Lac (El Kala)
    'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470770841497-7b3200c37e1b?w=1200&auto=format&fit=crop&q=80',
  ],
  12: [ // Riad Sahara (Tamanrasset)
    'https://images.unsplash.com/photo-1590490360182-c33d8f568e3f?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80',
  ],
};

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=250&auto=format&fit=crop&q=80',
];

// ─── Download helper ────────────────────────────────────────────────────────

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = (reqUrl: string) => {
      https.get(reqUrl, (response) => {
        // Follow redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            request(redirectUrl);
            return;
          }
        }
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    };
    request(url);
  });
}

// ─── Placeholder generators (for docs/videos) ──────────────────────────────

function placeholderPdf(label: string): string {
  return `%PDF-1.0 placeholder\n--- ${label} ---\nThis is a placeholder document for seed data.\nIn production, replace with actual scanned documents.\n`;
}

function placeholderVideo(): string {
  return `This is a placeholder for a video file.\nIn production, replace with actual property tour videos (MP4, max 50MB).\n`;
}

// ─── Generate files ─────────────────────────────────────────────────────────

async function generateMedia() {
  console.log('📁 Creating media folder structure...\n');

  // Create directories
  for (const folder of FOLDERS) {
    const dir = path.join(MEDIA_ROOT, folder);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  📂 ${folder}/`);
  }

  // ── Download avatars ──
  console.log('\n👤 Downloading avatar images...');
  for (let i = 0; i < AVATAR_URLS.length; i++) {
    const dest = path.join(MEDIA_ROOT, 'avatars', `user_${i + 1}.jpg`);
    try {
      await downloadFile(AVATAR_URLS[i], dest);
      process.stdout.write(`  ✅ user_${i + 1}.jpg\n`);
    } catch (err) {
      console.warn(`  ⚠️  Failed to download avatar ${i + 1}, skipping`);
    }
  }

  // ── Download property images ──
  console.log('\n🏠 Downloading property images...');
  let imgCount = 0;
  for (const [propId, urls] of Object.entries(PROPERTY_IMAGES)) {
    for (let j = 0; j < urls.length; j++) {
      const dest = path.join(MEDIA_ROOT, 'properties', `prop_${propId}_${j + 1}.jpg`);
      try {
        await downloadFile(urls[j], dest);
        imgCount++;
        process.stdout.write(`  ✅ prop_${propId}_${j + 1}.jpg\n`);
      } catch (err) {
        console.warn(`  ⚠️  Failed to download prop_${propId}_${j + 1}.jpg, skipping`);
      }
    }
  }
  console.log(`  📸 Downloaded ${imgCount} property images`);

  // ── Thumbnails (download smaller versions) ──
  console.log('\n🖼️  Downloading thumbnails...');
  for (const [propId, urls] of Object.entries(PROPERTY_IMAGES)) {
    const thumbUrl = urls[0].replace('w=1200', 'w=400');
    const dest = path.join(MEDIA_ROOT, 'thumbnails', `prop_${propId}_thumb.jpg`);
    try {
      await downloadFile(thumbUrl, dest);
    } catch {
      console.warn(`  ⚠️  Failed thumbnail for prop ${propId}`);
    }
  }
  console.log('  ✅ 12 thumbnails');

  // ── Documents (keep as placeholders) ──
  console.log('\n📄 Generating document placeholders...');
  const docFiles = [
    { name: 'national_id_1.jpg', label: 'National ID - Property 1' },
    { name: 'notarized_deed_2.pdf', label: 'Notarized Deed - Property 1' },
    { name: 'utility_bill_3.pdf', label: 'Utility Bill - Property 1' },
    { name: 'national_id_4.jpg', label: 'National ID - Property 3' },
    { name: 'notarized_deed_5.pdf', label: 'Notarized Deed - Property 3' },
    { name: 'land_registry_6.pdf', label: 'Land Registry - Property 3' },
    { name: 'national_id_7.jpg', label: 'National ID - Property 4' },
    { name: 'utility_bill_8.pdf', label: 'Utility Bill - Property 4' },
    { name: 'national_id_9.jpg', label: 'National ID - Property 5' },
    { name: 'passport_10.jpg', label: 'Passport - Property 8' },
    { name: 'national_id_11.jpg', label: 'National ID - Property 10' },
  ];
  for (const doc of docFiles) {
    const dest = path.join(MEDIA_ROOT, 'documents', doc.name);
    if (doc.name.endsWith('.pdf')) {
      fs.writeFileSync(dest, placeholderPdf(doc.label));
    } else {
      // For ID documents, keep as simple placeholder text (no real IDs)
      fs.writeFileSync(dest, `[Placeholder: ${doc.label}]`);
    }
  }
  console.log(`  ✅ ${docFiles.length} document placeholders`);

  // ── Videos ──
  console.log('\n🎬 Generating video placeholders...');
  const videoFiles = ['prop_1_tour.mp4', 'prop_3_tour.mp4', 'prop_6_tour.mp4', 'prop_9_tour.mp4'];
  for (const vid of videoFiles) {
    fs.writeFileSync(path.join(MEDIA_ROOT, 'videos', vid), placeholderVideo());
  }
  console.log(`  ✅ ${videoFiles.length} video placeholders`);

  // ── README ──
  fs.writeFileSync(path.join(MEDIA_ROOT, 'README.md'), `# Media Folder

This folder contains media assets for the application.

## Structure

\`\`\`
media/
├── avatars/          # User profile photos (250x250, real Unsplash photos)
│   └── user_{n}.jpg
├── properties/       # Property listing photos (1200x800, real Unsplash photos)
│   └── prop_{n}_{m}.jpg
├── thumbnails/       # Property thumbnail images (400x300)
│   └── prop_{n}_thumb.jpg
├── documents/        # Verification documents (placeholder)
│   ├── national_id_{n}.jpg
│   ├── notarized_deed_{n}.pdf
│   └── ...
└── videos/           # Property tour videos (placeholder)
    └── prop_{n}_tour.mp4
\`\`\`

## Notes

- Property and avatar images are **real photos** downloaded from Unsplash
- Documents and videos remain as **placeholders** (replace for production)
- Max video size: 50MB
- Recommended image formats: JPEG, WebP
`);

  console.log('\n✅ Media folder generation complete!');
  console.log(`   📍 Location: ${MEDIA_ROOT}`);
}

generateMedia();
