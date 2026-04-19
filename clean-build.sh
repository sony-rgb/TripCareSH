#!/bin/bash

echo "🧹 Starting clean build process..."

# Remove node_modules and package-lock.json
echo "📦 Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# Clear Expo cache
echo "🗂️  Clearing Expo cache..."
rm -rf .expo

# Clean Android build directories
echo "🤖 Cleaning Android build directories..."
rm -rf android/build android/app/build

# Reinstall dependencies
echo "📥 Reinstalling dependencies..."
npm install

echo "✅ Clean build completed successfully!"
echo ""
echo "You can now run:"
echo "  npm start          - Start development server"
echo "  npm run android    - Build and run on Android"
echo "  npm run ios        - Build and run on iOS" 