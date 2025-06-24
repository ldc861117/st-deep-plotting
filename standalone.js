// SillyTavern Deep Plotting Extension - Standalone Version

(function() {
    console.log("Deep Plotting standalone extension loading");

    // Basic templates directly in this file
    const plotTemplates = {
        threeAct: {
            name: "Three-Act Structure",
            description: "Classic three-act structure for storytelling",
            acts: [
                {
                    name: "Act 1: Setup",
                    description: "Introduce the characters and establish conflict",
                    stages: [
                        { name: "Introduction", description: "Introduce main characters" },
                        { name: "Inciting Incident", description: "Event starts the story" },
                        { name: "First Plot Point", description: "Move to Act 2" }
                    ]
                },
                {
                    name: "Act 2: Confrontation",
                    description: "Rising action and complications",
                    stages: [
                        { name: "Rising Action", description: "Obstacles increase" },
                        { name: "Midpoint", description: "Major twist or revelation" },
                        { name: "Low Point", description: "All seems lost" }
                    ]
                },
                {
                    name: "Act 3: Resolution",
                    description: "Climax and resolution",
                    stages: [
                        { name: "Climax", description: "Final confrontation" },
                        { name: "Resolution", description: "Wrap up loose ends" },
                        { name: "New Normal", description: "Show changed world" }
                    ]
                }
            ]
        }
    };

    // Initialize settings when document is ready
    $(document).ready(function() {
        try {
            console.log("Deep Plotting: Document ready");
            // Extension name and settings
            const extensionName = "deep_plotting";

            // Make sure extension_settings exists
            if (!window.extension_settings) {
                window.extension_settings = {};
            }

            // Default settings
            const defaultSettings = {
                enabled: true,
                autoInject: false,
                plotPosition: "before",
                activePlot: null,
                plotNotes: ""
            };

            // Load settings
            if (!window.extension_settings[extensionName]) {
                window.extension_settings[extensionName] = defaultSettings;
            }

            // Create simple UI
            const html = `
                <div id="deep_plotting_settings">
                    <div class="inline-drawer">
                        <div class="inline-drawer-toggle inline-drawer-header">
                            <b>Deep Plotting (Standalone)</b>
                            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                        </div>
                        <div class="inline-drawer-content">
                            <label class="checkbox_label" for="deep_plotting_enabled">
                                <input type="checkbox" id="deep_plotting_enabled" ${window.extension_settings[extensionName].enabled ? 'checked' : ''}>
                                <span>Enable Deep Plotting</span>
                            </label>

                            <div>
                                <h4>Plot Template</h4>
                                <button id="load_three_act" class="btn btn-primary">Load Three-Act Structure</button>
                            </div>

                            <div id="active_plot_display">
                                <p>No active plot. Click the button above to load a template.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add to extensions settings
            $('#extensions_settings2').append(html);

            // Set up event handlers
            $('#deep_plotting_enabled').on('change', function() {
                window.extension_settings[extensionName].enabled = $(this).prop('checked');
                if (window.saveSettingsDebounced) {
                    window.saveSettingsDebounced();
                }
            });

            // Load Three-Act structure
            $('#load_three_act').on('click', function() {
                window.extension_settings[extensionName].activePlot = JSON.parse(JSON.stringify(plotTemplates.threeAct));
                updatePlotDisplay();
                if (window.saveSettingsDebounced) {
                    window.saveSettingsDebounced();
                }
            });

            // Toggle drawer
            $('#deep_plotting_settings .inline-drawer-toggle').on('click', function() {
                const $icon = $(this).find('.inline-drawer-icon');
                const $content = $(this).next('.inline-drawer-content');

                if ($content.is(':visible')) {
                    $content.slideUp(200);
                    $icon.removeClass('down').addClass('right');
                } else {
                    $content.slideDown(200);
                    $icon.removeClass('right').addClass('down');
                }
            });

            // Function to update plot display
            function updatePlotDisplay() {
                const plot = window.extension_settings[extensionName].activePlot;
                if (!plot) {
                    $('#active_plot_display').html('<p>No active plot. Click the button above to load a template.</p>');
                    return;
                }

                let html = `<h4>${plot.name}</h4><p>${plot.description}</p>`;

                plot.acts.forEach((act, actIndex) => {
                    html += `<div class="plot-section"><h5>${act.name}</h5><p>${act.description}</p>`;

                    act.stages.forEach((stage, stageIndex) => {
                        html += `
                            <div class="plot-point">
                                <input type="checkbox" id="stage-${actIndex}-${stageIndex}">
                                <label for="stage-${actIndex}-${stageIndex}">${stage.name}</label>
                            </div>
                        `;
                    });

                    html += '</div>';
                });

                $('#active_plot_display').html(html);
            }

            // Initial update of the plot display
            updatePlotDisplay();

            console.log("Deep Plotting standalone extension loaded successfully");
        } catch (error) {
            console.error("Error initializing Deep Plotting standalone extension:", error);
            console.error(error.stack);
        }
    });
})();
