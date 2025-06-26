#!/bin/bash

# Define the source directory (current extension directory)
SOURCE_DIR="$(dirname "$0")"

# Define the target directory (SillyTavern extensions folder)
# IMPORTANT: User needs to replace this with their actual SillyTavern extensions path
# Example: /path/to/SillyTavern/public/extensions/deep_plotting
TARGET_DIR="/Users/lvdongchen/SillyTavern/public/extensions/third-party/deep_plotting"

# Check if the target directory is set
if [ "$TARGET_DIR" = "/path/to/SillyTavern/public/extensions/deep_plotting" ]; then
    echo "ERROR: Please update 'TARGET_DIR' in deploy.sh with your actual SillyTavern extensions path."
    exit 1
fi

echo "Deploying Deep Plotting extension to $TARGET_DIR..."

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Clean the target directory before copying
echo "Cleaning existing extension files in $TARGET_DIR..."
rm -rf "$TARGET_DIR"/*

# Copy manifest.json, index.js, and style.css
echo "Copying extension files..."
cp "$SOURCE_DIR"/manifest.json "$TARGET_DIR"/
cp "$SOURCE_DIR"/index.js "$TARGET_DIR"/
cp "$SOURCE_DIR"/style.css "$TARGET_DIR"/

echo "Deployment complete. Please restart SillyTavern to load the extension."