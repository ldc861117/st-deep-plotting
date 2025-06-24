#!/bin/bash
# Deploy the extension to SillyTavern
EXTENSION_PATH="/Users/lvdongchen/SillyTavern/public/scripts/extensions/third-party/st-deep-plotting"

echo "Deploying to $EXTENSION_PATH..."
cp -r ./* "$EXTENSION_PATH/"

echo "Deployment complete!"
