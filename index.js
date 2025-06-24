// Import dependencies using window scope (SillyTavern's approach)
// These are global variables that SillyTavern makes available
// No need for explicit imports in extensions system

import * as templates from "./templates.js";
import { PlotManager } from "./ui/PlotManager.js";
import { CharacterArcManager } from "./ui/CharacterArcManager.js";

// Extension name and settings key
const extensionName = "deep_plotting";

// Default settings for the extension
const defaultSettings = {
    enabled: true,
    autoInject: false,
    plotPosition: "before", // "before" or "after" story string
    activePlot: null,
    characterArcs: [],
    plotNotes: "",
    visualizationMode: "basic", // "basic" or "advanced"
    completedStages: {}, // format: "{actIndex}-{stageIndex}": true/false
    completedArcStages: {}, // format: "{arcIndex}-{stageIndex}": true/false
};

// Version check function for extension updates
async function checkVersion() {
    try {
        // Fetch the latest manifest
        const response = await fetch('https://github.com/ldc861117/st-deep-plotting/raw/main/manifest.json');
        if (response.ok) {
            const manifest = await response.json();
            const latestVersion = manifest.version;
            const currentVersion = '1.0.0'; // Should match the version in manifest.json
            
            console.log(`Deep Plotting: Current version: ${currentVersion}, Latest version: ${latestVersion}`);
            return { hasUpdate: currentVersion !== latestVersion, version: latestVersion };
        }
        return { hasUpdate: false, version: null };
    } catch (err) {
        console.error("Failed to check Deep Plotting version:", err);
        return { hasUpdate: false, version: null };
    }
}

// Create plot progress tracker
class PlotProgress {
    constructor(settings) {
        this.settings = settings;
    }

    isStageCompleted(actIndex, stageIndex) {
        const key = `${actIndex}-${stageIndex}`;
        return !!this.settings.completedStages[key];
    }

    setStageCompleted(actIndex, stageIndex, completed) {
        const key = `${actIndex}-${stageIndex}`;
        this.settings.completedStages[key] = completed;
        saveSettingsDebounced();
    }
}

// Create character arc progress tracker
class CharacterArcProgress {
    constructor(settings) {
        this.settings = settings;
    }

    isStageCompleted(arcIndex, stageIndex) {
        const key = `${arcIndex}-${stageIndex}`;
        return !!this.settings.completedArcStages[key];
    }

    setStageCompleted(arcIndex, stageIndex, completed) {
        const key = `${arcIndex}-${stageIndex}`;
        this.settings.completedArcStages[key] = completed;

        // Also update the actual arc object for visualization
        if (this.settings.characterArcs[arcIndex] &&
            this.settings.characterArcs[arcIndex].stages[stageIndex]) {
            this.settings.characterArcs[arcIndex].stages[stageIndex].completed = completed;
        }

        saveSettingsDebounced();
    }
}

// Initialize extension settings
function loadSettings() {
    if (Object.keys(extension_settings).includes(extensionName)) {
        Object.assign(defaultSettings, extension_settings[extensionName]);
    }
    extension_settings[extensionName] = defaultSettings;
    saveSettingsDebounced();
}

// Main extension class
class DeepPlottingExtension {
    constructor() {
        this.settings = extension_settings[extensionName];
        this.templates = templates;
        this.plotManager = new PlotManager(this);
        this.characterArcManager = new CharacterArcManager(this);
        this.plotProgress = new PlotProgress(this.settings);
        this.characterArcProgress = new CharacterArcProgress(this.settings);
    }

    // Load a plot template
    loadPlotTemplate(templateKey) {
        const template = this.templates.plotTemplates[templateKey];
        if (!template) return;

        // Create a copy of the template
        this.settings.activePlot = JSON.parse(JSON.stringify(template));
        saveSettingsDebounced();

        // Clear completed stages
        this.settings.completedStages = {};
        saveSettingsDebounced();
    }

    // Create a new character arc
    createCharacterArc(templateKey, characterName) {
        const template = this.templates.characterArcTemplates[templateKey];
        if (!template) return -1;

        // Create a copy of the template
        const newArc = JSON.parse(JSON.stringify(template));
        newArc.character = characterName;
        newArc.arcType = template.name;

        // Initialize the arc in the settings
        if (!Array.isArray(this.settings.characterArcs)) {
            this.settings.characterArcs = [];
        }

        const arcIndex = this.settings.characterArcs.length;
        this.settings.characterArcs.push(newArc);
        saveSettingsDebounced();

        return arcIndex;
    }

    // Inject a plot stage into the prompt
    injectStageIntoPrompt(actIndex, stageIndex) {
        if (!this.settings.activePlot ||
            !this.settings.activePlot.acts[actIndex] ||
            !this.settings.activePlot.acts[actIndex].stages[stageIndex]) {
            return;
        }

        const context = getContext();
        if (!context) return;

        const act = this.settings.activePlot.acts[actIndex];
        const stage = act.stages[stageIndex];

        const prompt = `[Plot: ${act.name} - ${stage.name}]\n${stage.description}\n`;
        const position = this.settings.plotPosition === 'before' ? 0 : 1;

        context.setExtensionPrompt(
            extensionName,
            prompt,
            position,
            0, // depth
            false, // scan
            0, // role (system)
        );
    }

    // Inject a character arc stage into the prompt
    injectArcStageIntoPrompt(arcIndex, stageIndex) {
        if (!this.settings.characterArcs ||
            !this.settings.characterArcs[arcIndex] ||
            !this.settings.characterArcs[arcIndex].stages[stageIndex]) {
            return;
        }

        const context = getContext();
        if (!context) return;

        const arc = this.settings.characterArcs[arcIndex];
        const stage = arc.stages[stageIndex];

        const prompt = `[Character Arc for ${arc.character}: ${arc.arcType} - ${stage.name}]\n${stage.description}\n`;
        const position = this.settings.plotPosition === 'before' ? 0 : 1;

        context.setExtensionPrompt(
            extensionName,
            prompt,
            position,
            0, // depth
            false, // scan
            0, // role (system),
        );
    }

    // Create extension UI
    createUI() {
        const html = `
            <div id="deep_plotting_settings">
                <div class="inline-drawer">
                    <div class="inline-drawer-toggle inline-drawer-header">
                        <b>Deep Plotting</b>
                        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                    </div>
                    <div class="inline-drawer-content">
                        <label class="checkbox_label" for="deep_plotting_enabled">
                            <input type="checkbox" id="deep_plotting_enabled" ${this.settings.enabled ? 'checked' : ''}>
                            <span>Enable Deep Plotting</span>
                        </label>
                        <label class="checkbox_label" for="deep_plotting_auto_inject">
                            <input type="checkbox" id="deep_plotting_auto_inject" ${this.settings.autoInject ? 'checked' : ''}>
                            <span>Auto-inject into prompts</span>
                        </label>
                        <div class="deep_plotting_position">
                            <label>Position:</label>
                            <label class="radio_label">
                                <input type="radio" name="deep_plotting_position" value="before" ${this.settings.plotPosition === 'before' ? 'checked' : ''}>
                                <span>Before Story String</span>
                            </label>
                            <label class="radio_label">
                                <input type="radio" name="deep_plotting_position" value="after" ${this.settings.plotPosition === 'after' ? 'checked' : ''}>
                                <span>After Story String</span>
                            </label>
                        </div>

                        <div id="plot-manager-container" class="plot-section">
                            ${this.plotManager.render()}
                        </div>

                        <div id="character-arc-container" class="plot-section">
                            ${this.characterArcManager.render()}
                        </div>

                        <div class="plot-section">
                            <h3>Plot Notes</h3>
                            <textarea id="plot-notes" class="text_pole textarea_compact" rows="4" placeholder="Enter your plot notes here...">${this.settings.plotNotes || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;

        jQuery('#extensions_settings2').append(html);
        this.initEventListeners();
    }

    // Initialize event listeners
    initEventListeners() {
        try {
            // Core settings listeners
            jQuery('#deep_plotting_enabled').on('change', (e) => {
                this.settings.enabled = !!jQuery(e.target).prop('checked');
                saveSettingsDebounced();
            });

            jQuery('#deep_plotting_auto_inject').on('change', (e) => {
                this.settings.autoInject = !!jQuery(e.target).prop('checked');
                saveSettingsDebounced();
            });

            jQuery('input[name="deep_plotting_position"]').on('change', (e) => {
                this.settings.plotPosition = jQuery(e.target).val();
                saveSettingsDebounced();
            });

            jQuery('#plot-notes').on('input', (e) => {
                this.settings.plotNotes = jQuery(e.target).val();
                saveSettingsDebounced();
            });

            // Drawer toggle
            jQuery('#deep_plotting_settings .inline-drawer-toggle').on('click', function() {
                const $icon = jQuery(this).find('.inline-drawer-icon');
                const $content = jQuery(this).next('.inline-drawer-content');

                if ($content.is(':visible')) {
                    $content.slideUp(200);
                    $icon.removeClass('down').addClass('right');
                } else {
                    $content.slideDown(200);
                    $icon.removeClass('right').addClass('down');
                }
            });

            // Initialize component event listeners
            this.plotManager.initEventListeners();
            this.characterArcManager.initEventListeners();
        } catch (error) {
            console.error("Error initializing Deep Plotting event listeners:", error);
        }
    }
}

// Handle chat changes
function onChatChanged() {
    if (!extension_settings[extensionName].enabled) return;

    // Auto inject logic can go here
    if (extension_settings[extensionName].autoInject) {
        // Implement auto inject logic based on context
    }
}

// Initialize extension
$(document).ready(function() {
    try {
        console.log("Deep Plotting extension loading...");
        loadSettings();
        const extension = new DeepPlottingExtension();
        extension.createUI();

        // Register event handlers - use a more compatible approach
        eventSource.on(event_types.CHAT_CHANGED, onChatChanged);
        
        // Register version check for extension updates
        registerSlashCommand('deep-plotting-update', async (_, value) => {
            toastr.info('Checking for updates...', 'Deep Plotting');
            const { hasUpdate, version } = await checkVersion();
            if (hasUpdate) {
                toastr.success(`Update available: ${version}. Use Extensions menu to update.`, 'Deep Plotting');
            } else {
                toastr.success('No updates available.', 'Deep Plotting');
            }
        });

        console.log("Deep Plotting extension loaded successfully!");
    } catch (error) {
        console.error("Error loading Deep Plotting extension:", error);
    }
});
