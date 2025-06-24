console.log("Debug extension loading...");

// Simple extension that will log all steps
(function() {
    console.log("Debug extension self-executing function started");

    try {
        // Get extension settings
        console.log("Getting extension settings");
        const extensionName = "deep_plotting_debug";
        const extension_settings = window.extension_settings || {};

        // Default settings
        console.log("Setting up default settings");
        const defaultSettings = {
            enabled: true,
            debug: true
        };

        // Initialize settings
        console.log("Initializing settings");
        if (!extension_settings[extensionName]) {
            extension_settings[extensionName] = defaultSettings;
        }

        // Create UI when document is ready
        console.log("Setting up document ready handler");
        $(document).ready(function() {
            console.log("Document ready");
            try {
                console.log("Creating UI");
                const html = `
                    <div id="debug_extension">
                        <h3>Debug Extension</h3>
                        <p>This is a debug extension for troubleshooting.</p>
                        <button id="debug_log_btn" class="btn btn-primary">Log Something</button>
                    </div>
                `;

                console.log("Finding extensions_settings2");
                const extensionsSettingsDiv = document.getElementById('extensions_settings2');

                if (extensionsSettingsDiv) {
                    console.log("Found #extensions_settings2, appending content");
                    extensionsSettingsDiv.innerHTML += html;

                    // Set up button event
                    console.log("Setting up button event");
                    document.getElementById('debug_log_btn').addEventListener('click', function() {
                        console.log("Debug button clicked!");
                    });
                } else {
                    console.error("#extensions_settings2 not found");
                }
            } catch (error) {
                console.error("Error in document ready:", error.message);
                console.error(error.stack);
            }
        });

        // Log success
        console.log("Debug extension loaded successfully");
    } catch (error) {
        console.error("Error loading debug extension:", error.message);
        console.error(error.stack);
    }
})();
