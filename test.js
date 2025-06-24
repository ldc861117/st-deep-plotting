// Minimal test extension
console.log("Deep Plotting test extension loading");

// Basic approach using plain DOM manipulation to avoid jQuery issues
window.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded");

    try {
        console.log("Trying to find extensions_settings2");
        // Try to find the extensions settings container
        const container = document.getElementById('extensions_settings2');

        if (container) {
            console.log("Found container, adding test content");
            // Add simple content directly to the DOM
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>Deep Plotting Test</h3>
                <p>This is a test extension. If you see this, the extension system is working.</p>
            `;
            container.appendChild(div);
            console.log("Content added successfully");
        } else {
            console.error("Could not find extensions_settings2 container");
        }
    } catch (error) {
        console.error("Error in test extension:", error);
    }

    console.log("Deep Plotting test extension loaded");
});
