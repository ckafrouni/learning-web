#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <file>"
    exit 1
fi

file="$1"
# Create a backup of the file
backup_file="${file}.bak"
cp "$file" "$backup_file"
echo "Backup created: $backup_file"

# Check if the file exists
if [ ! -f "$file" ]; then
    echo "Error: File '$file' not found."
    exit 1
fi

# Define start and end patterns
start_pattern="REMOVE-START"
end_pattern="REMOVE-END"

# Use sed to remove lines between start and end patterns (inclusive)
sed -i "/$start_pattern/,/$end_pattern/d" "$file"

echo "Lines between '$start_pattern' and '$end_pattern' removed from '$file'."
