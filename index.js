// Deep Plotting Extension for SillyTavern

// Extension name and settings key
const extensionName = "deep_plotting";

// Add debugging
console.log(`[${extensionName}] Extension script loading...`);

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

// Basic templates directly in this file for simplicity
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
    },
    heroJourney: {
        name: "Hero's Journey",
        description: "Campbell's monomyth structure",
        acts: [
            {
                name: "Departure",
                description: "The hero leaves the ordinary world",
                stages: [
                    { name: "Ordinary World", description: "The hero's normal life" },
                    { name: "Call to Adventure", description: "The hero is presented with a challenge" },
                    { name: "Refusal of the Call", description: "The hero initially refuses the adventure" },
                    { name: "Meeting the Mentor", description: "The hero meets a guide figure" },
                    { name: "Crossing the Threshold", description: "The hero commits to the adventure" }
                ]
            },
            {
                name: "Initiation",
                description: "The hero faces trials and transforms",
                stages: [
                    { name: "Tests, Allies, Enemies", description: "The hero faces challenges and makes friends/foes" },
                    { name: "Approach to the Inmost Cave", description: "The hero prepares for the central challenge" },
                    { name: "Ordeal", description: "The hero faces their greatest fear" },
                    { name: "Reward", description: "The hero gains something important" }
                ]
            },
            {
                name: "Return",
                description: "The hero returns with new knowledge",
                stages: [
                    { name: "The Road Back", description: "The hero begins the return journey" },
                    { name: "Resurrection", description: "The hero faces a final test" },
                    { name: "Return with the Elixir", description: "The hero brings back something to benefit others" }
                ]
            }
        ]
    }
};

const characterArcTemplates = {
    redemption: {
        name: "Redemption Arc",
        description: "Character journey from flawed to redeemed",
        stages: [
            { name: "Establish Flaw", description: "Establish the character's major flaw" },
            { name: "Consequences", description: "Character experiences consequences of their flaw" },
            { name: "Realization", description: "Character realizes they need to change" },
            { name: "Struggle", description: "Character struggles to overcome their flaw" },
            { name: "Sacrifice", description: "Character makes a sacrifice demonstrating change" },
            { name: "Redemption", description: "Character is redeemed or forgiven" },
            { name: "New Path", description: "Character begins a new path" }
        ]
    },
    corruption: {
        name: "Corruption Arc",
        description: "Character journey from good to corrupted",
        stages: [
            { name: "Establish Virtue", description: "Establish the character's initial good nature" },
            { name: "Temptation", description: "Character is tempted by power/shortcuts" },
            { name: "First Compromise", description: "Character makes their first moral compromise" },
            { name: "Rationalization", description: "Character justifies increasingly darker actions" },
            { name: "Point of No Return", description: "Character crosses a line they can't uncross" },
            { name: "Embrace Darkness", description: "Character fully embraces their corrupted nature" },
            { name: "Corrupted Identity", description: "Character establishes new, darker identity" }
        ]
    },
    coming_of_age: {
        name: "Coming of Age",
        description: "Character journey from innocence to maturity",
        stages: [
            { name: "Innocence", description: "Character begins with naive worldview" },
            { name: "Call to Growth", description: "Character faces challenge requiring growth" },
            { name: "Disillusionment", description: "Character's innocence is challenged" },
            { name: "Confusion", description: "Character struggles with changing identity" },
            { name: "Guidance", description: "Character receives guidance or mentorship" },
            { name: "Decision", description: "Character makes a defining choice" },
            { name: "Maturity", description: "Character emerges with newfound maturity" }
        ]
    }
};

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
    console.log(`[${extensionName}] Loading settings...`);
    try {
        // Make sure extension_settings exists
        if (!window.extension_settings) {
            console.error(`[${extensionName}] extension_settings is undefined!`);
            return false;
        }
        
        if (Object.keys(extension_settings).includes(extensionName)) {
            console.log(`[${extensionName}] Found existing settings`);
            Object.assign(defaultSettings, extension_settings[extensionName]);
        } else {
            console.log(`[${extensionName}] No existing settings found, using defaults`);
        }
        extension_settings[extensionName] = defaultSettings;
        saveSettingsDebounced();
        console.log(`[${extensionName}] Settings loaded successfully`);
        return true;
    } catch (err) {
        console.error(`[${extensionName}] Error loading settings:`, err);
        return false;
    }
}

// Using a modern approach to wait for ST to be ready
function waitForSillyTavern() {
    console.log(`[${extensionName}] Waiting for SillyTavern to be ready...`);
    
    const MAX_ATTEMPTS = 30;
    const RETRY_DELAY = 1000;
    let attempts = 0;
    
    // Check if ST's extension system is ready
    function checkIfReady() {
        attempts++;
        console.log(`[${extensionName}] Check attempt ${attempts}/${MAX_ATTEMPTS}...`);
        
        // If we've exhausted our attempts, give up
        if (attempts > MAX_ATTEMPTS) {
            console.error(`[${extensionName}] Failed to initialize after ${MAX_ATTEMPTS} attempts`);
            return;
        }
        
        // Check for all required ST global objects
        const isSillyTavernReady = 
            typeof window.extension_settings !== 'undefined' && 
            typeof window.saveSettingsDebounced === 'function' && 
            typeof window.eventSource !== 'undefined' &&
            typeof window.event_types !== 'undefined';
        
        if (isSillyTavernReady) {
            console.log(`[${extensionName}] SillyTavern is ready, initializing extension...`);
            initializeExtension();
        } else {
            console.log(`[${extensionName}] SillyTavern not ready yet, retrying in ${RETRY_DELAY}ms...`);
            setTimeout(checkIfReady, RETRY_DELAY);
        }
    }
    
    // Start checking
    checkIfReady();
}

// The actual initialization function
function initializeExtension() {
    try {
        if (!loadSettings()) {
            console.error(`[${extensionName}] Failed to load settings, aborting initialization`);
            return;
        }
        
        console.log(`[${extensionName}] Creating extension instance...`);
        const extension = new DeepPlottingExtension();
        
        console.log(`[${extensionName}] Creating UI...`);
        extension.createUI();

        // Register event handlers
        console.log(`[${extensionName}] Registering event handlers...`);
        eventSource.on(event_types.CHAT_CHANGED, onChatChanged);

        console.log(`[${extensionName}] Extension loaded successfully!`);
    } catch (error) {
        console.error(`[${extensionName}] Error initializing extension:`, error);
    }
}

// Simple PlotManager
class PlotManager {
    constructor(extension) {
        this.extension = extension;
        this.selectedPlotTemplate = null;
    }

    render() {
        let html = `
            <h3>Plot Structure</h3>
            <div class="plot-header">
                <select id="plot-template-select" class="text_pole">
                    <option value="">Select a plot structure...</option>
                    ${Object.keys(plotTemplates).map(key =>
                        `<option value="${key}">${plotTemplates[key].name}</option>`
                    ).join('')}
                </select>
                <button id="load-plot-template" class="menu_button">Load</button>
            </div>
        `;

        const activePlot = this.extension.settings.activePlot;
        if (activePlot) {
            html += `
                <div id="plot-structure">
                    <h4>${activePlot.name}</h4>
                    <p>${activePlot.description}</p>
                    <div class="plot-acts">
            `;

            activePlot.acts.forEach((act, actIndex) => {
                html += `
                    <div class="plot-act">
                        <h5>${act.name}</h5>
                        <p>${act.description}</p>
                        <div class="plot-stages">
                `;

                act.stages.forEach((stage, stageIndex) => {
                    const isCompleted = this.extension.plotProgress.isStageCompleted(actIndex, stageIndex);
                    html += `
                        <div class="plot-point" data-act="${actIndex}" data-stage="${stageIndex}">
                            <div>
                                <input type="checkbox" id="plot-stage-${actIndex}-${stageIndex}"
                                    class="plot-stage-checkbox" ${isCompleted ? 'checked' : ''}
                                    data-act="${actIndex}" data-stage="${stageIndex}">
                                <label for="plot-stage-${actIndex}-${stageIndex}">${stage.name}</label>
                            </div>
                            <div class="plot-point-controls">
                                <button class="use-plot-point-btn menu_button" data-act="${actIndex}" data-stage="${stageIndex}">
                                    Use
                                </button>
                                <button class="view-plot-point-btn menu_button" data-act="${actIndex}" data-stage="${stageIndex}">
                                    Info
                                </button>
                            </div>
                        </div>
                    `;
                });

                html += `</div></div>`;
            });

            html += `</div></div>`;
        }

        return html;
    }

    initEventListeners() {
        document.getElementById('load-plot-template').addEventListener('click', () => {
            const select = document.getElementById('plot-template-select');
            if (select.value) {
                this.extension.loadPlotTemplate(select.value);
                this.updateUI();
            }
        });

        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('plot-stage-checkbox')) {
                const actIndex = parseInt(event.target.getAttribute('data-act'));
                const stageIndex = parseInt(event.target.getAttribute('data-stage'));
                this.extension.plotProgress.setStageCompleted(actIndex, stageIndex, event.target.checked);
            } else if (event.target.classList.contains('use-plot-point-btn')) {
                const actIndex = parseInt(event.target.getAttribute('data-act'));
                const stageIndex = parseInt(event.target.getAttribute('data-stage'));
                this.extension.injectStageIntoPrompt(actIndex, stageIndex);
                toastr.success(`Plot point added to context`);
            } else if (event.target.classList.contains('view-plot-point-btn')) {
                const actIndex = parseInt(event.target.getAttribute('data-act'));
                const stageIndex = parseInt(event.target.getAttribute('data-stage'));

                if (this.extension.settings.activePlot &&
                    this.extension.settings.activePlot.acts[actIndex] &&
                    this.extension.settings.activePlot.acts[actIndex].stages[stageIndex]) {

                    const stage = this.extension.settings.activePlot.acts[actIndex].stages[stageIndex];
                    callPopup(`<h3>${stage.name}</h3><p>${stage.description}</p>`, 'text');
                }
            }
        });
    }

    updateUI() {
        const container = document.getElementById('plot-manager-container');
        if (container) {
            container.innerHTML = this.render();
            this.initEventListeners();
        }
    }
}

// Simple CharacterArcManager
class CharacterArcManager {
    constructor(extension) {
        this.extension = extension;
    }

    render() {
        let html = `
            <h3>Character Arcs</h3>
            <div class="plot-header">
                <select id="character-arc-template" class="text_pole">
                    <option value="">Select an arc type...</option>
                    ${Object.keys(characterArcTemplates).map(key =>
                        `<option value="${key}">${characterArcTemplates[key].name}</option>`
                    ).join('')}
                </select>
                <input type="text" id="character-arc-name" class="text_pole"
                    placeholder="Character name">
                <button id="add-character-arc" class="menu_button">Add</button>
            </div>
        `;

        const arcs = this.extension.settings.characterArcs || [];
        if (arcs.length > 0) {
            html += `<div id="character-arcs-list">`;

            arcs.forEach((arc, arcIndex) => {
                html += `
                    <div class="character-arc">
                        <h4>${arc.character}: ${arc.arcType}</h4>
                        <p>${arc.description || ""}</p>
                        <div class="plot-stages">
                `;

                arc.stages.forEach((stage, stageIndex) => {
                    const isCompleted = this.extension.characterArcProgress.isStageCompleted(arcIndex, stageIndex);
                    html += `
                        <div class="plot-point" data-arc="${arcIndex}" data-stage="${stageIndex}">
                            <div>
                                <input type="checkbox" id="arc-stage-${arcIndex}-${stageIndex}"
                                    class="arc-stage-checkbox" ${isCompleted ? 'checked' : ''}
                                    data-arc="${arcIndex}" data-stage="${stageIndex}">
                                <label for="arc-stage-${arcIndex}-${stageIndex}">${stage.name}</label>
                            </div>
                            <div class="plot-point-controls">
                                <button class="use-arc-point-btn menu_button" data-arc="${arcIndex}" data-stage="${stageIndex}">
                                    Use
                                </button>
                                <button class="view-arc-point-btn menu_button" data-arc="${arcIndex}" data-stage="${stageIndex}">
                                    Info
                                </button>
                            </div>
                        </div>
                    `;
                });

                html += `</div></div>`;
            });

            html += `</div>`;
        }

        return html;
    }

    initEventListeners() {
        document.getElementById('add-character-arc').addEventListener('click', () => {
            const template = document.getElementById('character-arc-template').value;
            const characterName = document.getElementById('character-arc-name').value.trim();

            if (template && characterName) {
                this.extension.createCharacterArc(template, characterName);
                this.updateUI();
            } else {
                toastr.warning('Please select an arc type and enter a character name');
            }
        });

        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('arc-stage-checkbox')) {
                const arcIndex = parseInt(event.target.getAttribute('data-arc'));
                const stageIndex = parseInt(event.target.getAttribute('data-stage'));
                this.extension.characterArcProgress.setStageCompleted(arcIndex, stageIndex, event.target.checked);
            } else if (event.target.classList.contains('use-arc-point-btn')) {
                const arcIndex = parseInt(event.target.getAttribute('data-arc'));
                const stageIndex = parseInt(event.target.getAttribute('data-stage'));
                this.extension.injectArcStageIntoPrompt(arcIndex, stageIndex);
                toastr.success(`Character arc point added to context`);
            } else if (event.target.classList.contains('view-arc-point-btn')) {
                const arcIndex = parseInt(event.target.getAttribute('data-arc'));
                const stageIndex = parseInt(event.target.getAttribute('data-stage'));

                if (this.extension.settings.characterArcs[arcIndex] &&
                    this.extension.settings.characterArcs[arcIndex].stages[stageIndex]) {

                    const stage = this.extension.settings.characterArcs[arcIndex].stages[stageIndex];
                    callPopup(`<h3>${stage.name}</h3><p>${stage.description}</p>`, 'text');
                }
            }
        });
    }

    updateUI() {
        const container = document.getElementById('character-arc-container');
        if (container) {
            container.innerHTML = this.render();
            this.initEventListeners();
        }
    }
}

// Main extension class
class DeepPlottingExtension {
    constructor() {
        this.settings = extension_settings[extensionName];
        this.plotManager = new PlotManager(this);
        this.characterArcManager = new CharacterArcManager(this);
        this.plotProgress = new PlotProgress(this.settings);
        this.characterArcProgress = new CharacterArcProgress(this.settings);
    }

    // Load a plot template
    loadPlotTemplate(templateKey) {
        const template = plotTemplates[templateKey];
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
        const template = characterArcTemplates[templateKey];
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

        $('#extensions_settings2').append(html);
        this.initEventListeners();
    }

    // Initialize event listeners
    initEventListeners() {
        // Core settings listeners
        $('#deep_plotting_enabled').on('change', (e) => {
            this.settings.enabled = !!$(e.target).prop('checked');
            saveSettingsDebounced();
        });

        $('#deep_plotting_auto_inject').on('change', (e) => {
            this.settings.autoInject = !!$(e.target).prop('checked');
            saveSettingsDebounced();
        });

        $('input[name="deep_plotting_position"]').on('change', (e) => {
            this.settings.plotPosition = $(e.target).val();
            saveSettingsDebounced();
        });

        $('#plot-notes').on('input', (e) => {
            this.settings.plotNotes = $(e.target).val();
            saveSettingsDebounced();
        });

        // Drawer toggle
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

        // Initialize component event listeners
        this.plotManager.initEventListeners();
        this.characterArcManager.initEventListeners();
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

// Initialize extension - start the waiting process when document is ready
$(document).ready(function() {
    console.log(`[${extensionName}] Document ready, starting initialization...`);
    waitForSillyTavern();
});
