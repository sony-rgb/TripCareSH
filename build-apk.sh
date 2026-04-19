#!/bin/bash

set -e  # Exit on error

echo "-- Building APK -- "

# Remove node_modules
echo "Removing node_modules..."
rm -rf node_modules

# Clear Expo cache
echo "Clearing Expo cache..."
rm -rf .expo

# Clear Metro bundler cache
echo "Clearing Metro bundler cache..."
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-map-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true

# Clean Android build directories
echo "Cleaning Android directories..."
rm -rf android

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

# Generate Android files (prebuild)
echo "Generating Android files (prebuild)..."
npx expo prebuild -p android

# Build Release APK
echo "Building Release APK..."
cd android
EXPO_PUBLIC_API_URL_PROD="https://tripcare.co" ./gradlew assembleRelease

echo "APK should be at this path: /src/app/android/app/build/outputs/apk/release/app-release.apk"
