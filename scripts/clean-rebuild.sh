#!/bin/bash

echo "🧹 Cleaning React Native cache..."
rm -rf node_modules
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*
rm -rf android/app/build
rm -rf ios/Pods
rm -rf ios/build
rm -rf .expo
rm -rf .expo-shared
rm -rf package-lock.json
rm -rf yarn.lock

echo "📦 Installing node_modules..."
yarn install || npm install

echo "🔧 Installing iOS pods (if on macOS)..."
if [ "$(uname)" == "Darwin" ]; then
  cd ios && pod install && cd ..
fi

echo "🚀 Rebuilding app..."
npx react-native run-android
# or for iOS: npx react-native run-ios

echo "✅ Done! App should be running!"
