#!/bin/bash

# Find all .ts files that have a corresponding .tsx file
for ts_file in $(find app/components -name "*.ts"); do
    tsx_file="${ts_file%.ts}.tsx"
    if [ -f "$tsx_file" ]; then
        echo "Removing duplicate $ts_file (keeping $tsx_file)"
        rm "$ts_file"
    fi
done

echo "✅ Cleanup completed!" 