# React Native Mobile App - HuggitHub

Complete React Native mobile application built with Expo for iOS and Android.

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- iOS: macOS with Xcode 14+
- Android: Android Studio with Android SDK

### Installation

1. **Install dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Run on device/simulator**
   - iOS: Press `i` in terminal or `npm run ios`
   - Android: Press `a` in terminal or `npm run android`
   - Web: Press `w` in terminal

### Testing on Physical Device

Use the Expo Go app:
1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Scan the QR code from `npm start`

## Project Structure

```
mobile/
├── app/                      # Expo Router pages
│   ├── (auth)/              # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── index.tsx        # Home
│   │   └── profile.tsx      # Profile
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Entry point
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx       # ✓ Styled button
│   │   ├── Input.tsx        # ✓ Text input with validation
│   │   ├── Card.tsx         # ✓ Card container
│   │   ├── Loading.tsx      # ✓ Loading spinner
│   │   ├── Modal.tsx        # ✓ Modal dialog
│   │   ├── Dropdown.tsx     # ✓ Dropdown select
│   │   ├── Tabs.tsx         # ✓ Tab navigation
│   │   ├── Image.tsx        # ✓ Image with loading
│   │   ├── Form.tsx         # ✓ Dynamic form
│   │   └── FileUploader.tsx # ✓ File/image picker
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── LoadingContext.tsx
│   ├── lib/
│   │   └── axios.ts         # API client
│   ├── i18n/                # Internationalization
│   │   ├── config.ts
│   │   └── locales/         # EN, FR, AR translations
│   ├── constants/           # App constants
│   │   ├── api.constants.ts
│   │   └── theme.constants.ts
│   └── types/               # TypeScript types
├── app.json                 # Expo configuration
├── eas.json                 # EAS Build configuration
├── package.json
└── tsconfig.json
```

## Features Implemented (Batch 1/10)

### ✅ Core Components (10/10)
1. **Button** - Multiple variants, sizes, loading states
2. **Input** - With icons, validation, error states
3. **Card** - Container with header/footer
4. **Loading** - Spinner with full-screen modal
5. **Modal** - Customizable dialog with sizes
6. **Dropdown** - Select with search and icons
7. **Tabs** - Tab navigation with badges
8. **Image** - Lazy loading with placeholder
9. **Form** - Dynamic forms with validation
10. **FileUploader** - Camera/gallery/document picker

### ✅ App Infrastructure
- Expo Router navigation
- Authentication flow (login/register)
- Secure token storage (SecureStore)
- Theme system (light/dark)
- i18n (EN/FR/AR with RTL)
- API client with interceptors

### ✅ Permissions Configured
- Camera access (photo/video)
- Photo Library (read/write)
- Microphone (video recording)
- Location services
- File system access
- Media storage

## Build for Production

### iOS
```bash
npm run build:prod
eas build --platform ios
eas submit --platform ios
```

### Android
```bash
npm run build:prod
eas build --platform android
eas submit --platform android
```

## Environment Variables

Create `.env` file:
```
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Next Steps (Remaining 9 Batches)

### Batch 2: Social Components
- Comments
- Reactions
- Rankings
- Share functionality

### Batch 3: Advanced UI
- Charts/Graphs
- Calendar/Date pickers
- Rich text editor
- Image editor/cropper

### Batch 4: Maps & Location
- Map integration
- Location picker
- Geofencing
- Directions

### Batch 5-10: Additional Features
- Video player
- Audio recorder
- Push notifications
- Real-time chat
- Payment integration
- Analytics
- Offline support
- Background tasks

## Troubleshooting

**iOS build fails**: Check Xcode version (14+)
**Android build fails**: Check Android SDK tools
**Metro bundler issues**: Clear cache with `npx expo start -c`
**Permission errors**: Reinstall app after changing permissions

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/docs/)
