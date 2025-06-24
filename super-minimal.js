console.log("Deep Plotting super-minimal extension loading...");

// Most basic extension possible
jQuery(async () => {
    try {
        console.log("Deep Plotting super-minimal extension loaded successfully!");
        $('#extensions_settings2').append('<div id="deep_plotting_minimal"><h3>Deep Plotting (Super Minimal)</h3><p>Extension loaded!</p></div>');
    } catch (error) {
        console.error("Error loading Deep Plotting super-minimal extension:", error);
    }
});
