#!/bin/bash
# Deploy the extension to SillyTavern
EXTENSION_PATH="/Users/lvdongchen/SillyTavern/public/scripts/extensions/third-party/st-deep-plotting"

# Create directory if it doesn't exist
if [ ! -d "$EXTENSION_PATH" ]; then
    echo "Creating extension directory..."
    mkdir -p "$EXTENSION_PATH"
fi

echo "Deploying to $EXTENSION_PATH..."
cp -r ./* "$EXTENSION_PATH/"

# Verify essential files were copied
if [ -f "$EXTENSION_PATH/index.js" ] && [ -f "$EXTENSION_PATH/manifest.json" ]; then
    echo "✅ Core files deployed successfully!"
else
    echo "❌ Error: Some files may not have been copied correctly."
    exit 1
fi

echo "Deployment complete! Please reload SillyTavern to see your changes."
echo "Tip: In SillyTavern, go to Extensions menu and click the reload button or restart the application."
