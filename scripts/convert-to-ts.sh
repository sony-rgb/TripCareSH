#!/bin/bash

# Convert all index.js files to .tsx
for file in $(find app/components -name "index.js"); do
    mv "$file" "${file%.js}.tsx"
    echo "Converted $file to ${file%.js}.tsx"
done

# Convert all other .js files to .ts
for file in $(find app/components -name "*.js"); do
    mv "$file" "${file%.js}.ts"
    echo "Converted $file to ${file%.js}.ts"
done

echo "✅ Conversion completed!" 