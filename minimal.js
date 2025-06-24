// Minimal extension version for testing
import { extension_settings, saveSettingsDebounced } from "../../extensions.js";

// Extension name and settings key
const extensionName = "deep_plotting";

// Default settings for the extension
const defaultSettings = {
    enabled: true,
    minimal: true
};

// Initialize extension settings
function loadSettings() {
    if (Object.keys(extension_settings).includes(extensionName)) {
        Object.assign(defaultSettings, extension_settings[extensionName]);
    }
    extension_settings[extensionName] = defaultSettings;
    saveSettingsDebounced();
}

// Main extension class
class MinimalExtension {
    constructor() {
        this.settings = extension_settings[extensionName];
    }

    // Create extension UI
    createUI() {
        const html = `
            <div id="deep_plotting_minimal">
                <h3>Deep Plotting (Minimal Version)</h3>
                <p>Extension loaded successfully!</p>
            </div>
        `;

        $('#extensions_settings2').append(html);
    }
}

// Initialize extension
jQuery(async () => {
    console.log("Deep Plotting minimal extension loading...");
    try {
        loadSettings();
        const extension = new MinimalExtension();
        extension.createUI();
        console.log("Deep Plotting minimal extension loaded successfully!");
    } catch (error) {
        console.error("Error loading Deep Plotting minimal extension:", error);
    }
});
