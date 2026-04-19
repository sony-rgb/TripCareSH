#!/bin/bash

# Function to convert a JavaScript file to TypeScript
convert_to_ts() {
  local js_file=$1
  local ts_file="${js_file%.js}.tsx"
  
  # Skip if TypeScript version already exists
  if [ -f "$ts_file" ]; then
    echo "Skipping $js_file - TypeScript version already exists"
    return
  fi
  
  # Convert the file
  echo "Converting $js_file to TypeScript..."
  mv "$js_file" "$ts_file"
}

# Find all JavaScript files in the screens directory
find app/screens -name "*.js" -type f | while read -r file; do
  convert_to_ts "$file"
done

echo "✅ Conversion completed!" 