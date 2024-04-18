#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <file>"
    exit 1
fi

file="$1"

# Check if the file exists
if [ ! -f "$file" ]; then
    echo "Error: File '$file' not found."
    exit 1
fi

# Create a
processed_file="_${file}"
cp "$file" "$processed_file"

# Define start and end patterns
start_pattern="REMOVE-START"
end_pattern="REMOVE-END"

# Use sed to remove lines between start and end patterns (inclusive)
sed -i "/$start_pattern/,/$end_pattern/d" "$processed_file"

echo "Lines between '$start_pattern' and '$end_pattern' removed from '$file'.\nProcessed file saved as '$processed_file'."
