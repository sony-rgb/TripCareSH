#!/bin/bash

# Function to check if a file contains JSX
contains_jsx() {
  local file=$1
  if grep -q "<[A-Z]" "$file"; then
    return 0  # Contains JSX
  else
    return 1  # Does not contain JSX
  fi
}

# Function to convert a TypeScript file to TSX if it contains JSX
convert_to_tsx() {
  local ts_file=$1
  local tsx_file="${ts_file%.ts}.tsx"
  
  # Skip if TSX version already exists
  if [ -f "$tsx_file" ]; then
    echo "Skipping $ts_file - TSX version already exists"
    return
  fi
  
  # Check if file contains JSX
  if contains_jsx "$ts_file"; then
    echo "Converting $ts_file to TSX..."
    mv "$ts_file" "$tsx_file"
  else
    echo "Skipping $ts_file - No JSX content"
  fi
}

# Find all TypeScript files in the components directory
find app/components -name "*.ts" -type f | while read -r file; do
  convert_to_tsx "$file"
done

echo "✅ Extension conversion completed!" 