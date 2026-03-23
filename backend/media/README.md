# Media Folder

This folder contains media assets for the application.

## Structure

```
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
```

## Notes

- Property and avatar images are **real photos** downloaded from Unsplash
- Documents and videos remain as **placeholders** (replace for production)
- Max video size: 50MB
- Recommended image formats: JPEG, WebP
