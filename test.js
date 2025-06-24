// [BACKUP] Minimal test extension - DO NOT USE
console.log("WARNING: Using Deep Plotting test extension instead of main index.js!");

// Basic approach using plain DOM manipulation to avoid jQuery issues
window.addEventListener('DOMContentLoaded', function() {
    console.log("[test.js] DOM content loaded");

    try {
        console.log("[test.js] Trying to find extensions_settings2");
        // Try to find the extensions settings container
        const container = document.getElementById('extensions_settings2');

        if (container) {
            console.log("[test.js] Found container, adding test content");
            // Add simple content directly to the DOM
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>Deep Plotting Test (BACKUP FILE)</h3>
                <p>This is a test extension. If you see this, the extension system is using test.js instead of index.js!</p>
                <p style="color: red;">Please check manifest.json to ensure it points to index.js, not test.js!</p>
            `;
            container.appendChild(div);
            console.log("[test.js] Content added successfully");
        } else {
            console.error("[test.js] Could not find extensions_settings2 container");
        }
    } catch (error) {
        console.error("[test.js] Error in test extension:", error);
    }

    console.log("[test.js] Deep Plotting test extension loaded");
});
