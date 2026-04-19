# Environment Variables Setup

## Overview

The TripCare app requires environment variables to configure API endpoints for different environments.

## Environment Variables

### Production
- `EXPO_PUBLIC_API_URL_PROD` - Production API URL (default: `https://tripcare.co/api`)

### Development
- `EXPO_PUBLIC_API_URL_DEV_ANDROID` - Android emulator API URL (default: `http://10.0.2.2:3000`)
- `EXPO_PUBLIC_API_URL_DEV_IOS` - iOS simulator API URL (default: `http://localhost:3000`)

## Setup Instructions

### Local Development

Create a `.env` file in the `src/app` directory:

```bash
# Production API URL
EXPO_PUBLIC_API_URL_PROD=https://tripcare.co/api

# Development API URLs
EXPO_PUBLIC_API_URL_DEV_ANDROID=http://10.0.2.2:3000
EXPO_PUBLIC_API_URL_DEV_IOS=http://localhost:3000
```

### GitHub Actions / CI/CD

The following secrets must be configured in GitHub repository settings:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secret:
   - `EXPO_PUBLIC_API_URL_PROD`: `https://tripcare.co/api`

## How It Works

The app uses `appConfig.ts` to determine which API URL to use:

- **Development mode** (`__DEV__ === true`):
  - Android: Uses `EXPO_PUBLIC_API_URL_DEV_ANDROID`
  - iOS: Uses `EXPO_PUBLIC_API_URL_DEV_IOS`

- **Production mode** (`__DEV__ === false`):
  - Uses `EXPO_PUBLIC_API_URL_PROD`

## Troubleshooting

### "NODE_ENV not specified" error

This error occurs during the build process. The fix:
- GitHub Actions workflow now sets `NODE_ENV=production` during build steps
- This ensures Expo knows it's building for production

### API not connecting in production APK

**Symptoms:**
- Development works fine
- Production APK cannot connect to API

**Solution:**
1. Verify GitHub secret `EXPO_PUBLIC_API_URL_PROD` is set correctly
2. Check that `NODE_ENV=production` is set in build workflow
3. Rebuild the APK using the GitHub Actions workflow

### Checking current API URL

The app logs the current API URL on startup:
```
[AppConfig] API Base URL: https://tripcare.co/api DEV: false
```

Check the console/logcat to verify the correct URL is being used.

## Default Values

If environment variables are not set, the app falls back to these defaults:

- Production: `https://tripcare.co/api`
- Android Dev: `http://10.0.2.2:3000`
- iOS Dev: `http://localhost:3000`

