# Mobile App Setup (Capacitor)

This folder contains the configuration for building the AI Agent Builder as a native mobile app using Capacitor.

## Prerequisites

- Node.js 18+
- For iOS: macOS with Xcode installed
- For Android: Android Studio installed

## Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Add platforms
npx cap add ios
npx cap add android

# 3. Build the web app
npm run build

# 4. Sync to native platforms
npx cap sync

# 5. Run on device/emulator
npx cap run ios      # For iOS
npx cap run android  # For Android
```

## Hot Reload (Development)

The `capacitor.config.ts` is pre-configured with a live reload server URL pointing to the Lovable sandbox. This means changes you make in the editor will instantly reflect on your device.

## Building for Production

1. Remove or comment out the `server` block in `capacitor.config.ts`
2. Run `npm run build`
3. Run `npx cap sync`
4. Open in native IDE: `npx cap open ios` or `npx cap open android`
5. Build & archive from the native IDE

## App Details

- **App ID**: `app.lovable.ba76e28e266e488881482cbf0bffc460`
- **App Name**: `AI Agent Builder`
