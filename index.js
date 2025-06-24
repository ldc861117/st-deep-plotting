/**
 * Deep Plotting Extension for SillyTavern
 */

// Define a unique module name to avoid conflicts
const EXTENSION_NAME = 'deep_plotting';

// Import any required SillyTavern modules
// Nothing to import for now, will use getContext()

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
                <button id="load-plot-btn" class="menu_button">Load</button>
            </div>
            <div id="active-plot">${this.renderActivePlot()}</div>
        `;
        return html;
    }

    renderActivePlot() {
        if (!this.extension.settings.activePlot) {
            return '<p>No active plot. Select a template to begin.</p>';
        }

        const plot = this.extension.settings.activePlot;
        return `<div class="active-plot">
            <h4>${plot.name}</h4>
            <p>${plot.description}</p>
            ${this.renderActsList(plot)}
        </div>`;
    }

    renderActsList(plot) {
        return plot.acts.map((act, actIndex) => {
            return `
                <div class="plot-act">
                    <h5>${act.name}</h5>
                    <p>${act.description}</p>
                    ${this.renderStagesList(act, actIndex)}
                </div>
            `;
        }).join('');
    }

    renderStagesList(act, actIndex) {
        return `<ul class="plot-stages">
            ${act.stages.map((stage, stageIndex) => {
                const isCompleted = this.extension.plotProgress.isStageCompleted(actIndex, stageIndex);
                return `
                    <li class="plot-stage">
                        <input type="checkbox" id="stage-${actIndex}-${stageIndex}" 
                            class="plot-stage-checkbox" data-act="${actIndex}" data-stage="${stageIndex}"
                            ${isCompleted ? 'checked' : ''}>
                        <label for="stage-${actIndex}-${stageIndex}">${stage.name}</label>
                        <button class="inject-btn menu_button" data-act="${actIndex}" data-stage="${stageIndex}">
                            Inject
                        </button>
                    </li>
                `;
            }).join('')}
        </ul>`;
    }

    initEventListeners() {
        // Load plot template
        $('#load-plot-btn').on('click', () => {
            const templateKey = $('#plot-template-select').val();
            if (!templateKey) return;
            this.extension.loadPlotTemplate(templateKey);
            $('#active-plot').html(this.renderActivePlot());
        });

        // Plot stage checkbox events
        $(document).on('change', '.plot-stage-checkbox', (e) => {
            const actIndex = $(e.currentTarget).data('act');
            const stageIndex = $(e.currentTarget).data('stage');
            const isCompleted = $(e.currentTarget).prop('checked');
            this.extension.plotProgress.setStageCompleted(actIndex, stageIndex, isCompleted);
        });

        // Inject button events
        $(document).on('click', '.inject-btn', (e) => {
            const actIndex = $(e.currentTarget).data('act');
            const stageIndex = $(e.currentTarget).data('stage');
            this.extension.injectStageIntoPrompt(actIndex, stageIndex);
        });
    }

    updateUI() {
        $('#active-plot').html(this.renderActivePlot());
    }
}

class CharacterArcManager {
    constructor(extension) {
        this.extension = extension;
    }

    render() {
        let html = `
            <h3>Character Arcs</h3>
            <div class="char-arc-create">
                <select id="arc-template-select" class="text_pole">
                    <option value="">Select an arc type...</option>
                    ${Object.keys(characterArcTemplates).map(key =>
                        `<option value="${key}">${characterArcTemplates[key].name}</option>`
                    ).join('')}
                </select>
                <input type="text" id="char-name-input" class="text_pole" placeholder="Character name">
                <button id="create-arc-btn" class="menu_button">Create</button>
            </div>
            <div id="character-arcs">${this.renderCharacterArcs()}</div>
        `;
        return html;
    }

    renderCharacterArcs() {
        if (!this.extension.settings.characterArcs || this.extension.settings.characterArcs.length === 0) {
            return '<p>No character arcs created yet.</p>';
        }

        return this.extension.settings.characterArcs.map((arc, arcIndex) => {
            return `
                <div class="character-arc">
                    <h5>${arc.character} - ${arc.arcType}</h5>
                    <button class="delete-arc-btn menu_button" data-arc="${arcIndex}">Delete</button>
                    ${this.renderArcStages(arc, arcIndex)}
                </div>
            `;
        }).join('');
    }

    renderArcStages(arc, arcIndex) {
        return `<ul class="arc-stages">
            ${arc.stages.map((stage, stageIndex) => {
                const isCompleted = this.extension.characterArcProgress.isStageCompleted(arcIndex, stageIndex);
                return `
                    <li class="arc-stage">
                        <input type="checkbox" id="arc-stage-${arcIndex}-${stageIndex}" 
                            class="arc-stage-checkbox" data-arc="${arcIndex}" data-stage="${stageIndex}"
                            ${isCompleted ? 'checked' : ''}>
                        <label for="arc-stage-${arcIndex}-${stageIndex}">${stage.name}</label>
                        <button class="inject-arc-btn menu_button" data-arc="${arcIndex}" data-stage="${stageIndex}">
                            Inject
                        </button>
                    </li>
                `;
            }).join('')}
        </ul>`;
    }

    initEventListeners() {
        // Create character arc
        $('#create-arc-btn').on('click', () => {
            const templateKey = $('#arc-template-select').val();
            const characterName = $('#char-name-input').val().trim();
            if (!templateKey || !characterName) return;
            
            this.extension.createCharacterArc(templateKey, characterName);
            $('#character-arcs').html(this.renderCharacterArcs());
        });

        // Character arc stage checkbox events
        $(document).on('change', '.arc-stage-checkbox', (e) => {
            const arcIndex = $(e.currentTarget).data('arc');
            const stageIndex = $(e.currentTarget).data('stage');
            const isCompleted = $(e.currentTarget).prop('checked');
            this.extension.characterArcProgress.setStageCompleted(arcIndex, stageIndex, isCompleted);
        });

        // Inject button events
        $(document).on('click', '.inject-arc-btn', (e) => {
            const arcIndex = $(e.currentTarget).data('arc');
            const stageIndex = $(e.currentTarget).data('stage');
            this.extension.injectArcStageIntoPrompt(arcIndex, stageIndex);
        });

        // Delete character arc
        $(document).on('click', '.delete-arc-btn', (e) => {
            const arcIndex = $(e.currentTarget).data('arc');
            this.extension.settings.characterArcs.splice(arcIndex, 1);
            saveSettingsDebounced();
            $('#character-arcs').html(this.renderCharacterArcs());
        });
    }

    updateUI() {
        $('#character-arcs').html(this.renderCharacterArcs());
    }
}

class DeepPlottingExtension {
    constructor() {
        // Get extension settings
        this.settings = extension_settings[EXTENSION_NAME];
        this.plotManager = new PlotManager(this);
        this.characterArcManager = new CharacterArcManager(this);
        this.plotProgress = new PlotProgress(this.settings);
        this.characterArcProgress = new CharacterArcProgress(this.settings);
    }

    loadPlotTemplate(templateKey) {
        const template = plotTemplates[templateKey];
        if (!template) return;

        // Create a copy of the template
        this.settings.activePlot = JSON.parse(JSON.stringify(template));
        saveSettingsDebounced();
    }

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
            EXTENSION_NAME,
            prompt,
            position,
            0, // depth
            false, // scan
            0, // role (system)
        );

        toastr.success(`Injected plot stage: ${act.name} - ${stage.name}`);
    }

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
            EXTENSION_NAME,
            prompt,
            position,
            0, // depth
            false, // scan
            0, // role (system),
        );

        toastr.success(`Injected character arc stage for ${arc.character}: ${stage.name}`);
    }

    createUI() {
        const html = `
            <div id="${EXTENSION_NAME}_settings" class="extension_settings">
                <div class="inline-drawer">
                    <div class="inline-drawer-toggle inline-drawer-header">
                        <b>Deep Plotting</b>
                        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down"></div>
                    </div>
                    <div class="inline-drawer-content">
                        <label class="checkbox_label">
                            <input type="checkbox" id="${EXTENSION_NAME}_enabled" ${this.settings.enabled ? 'checked' : ''}>
                            <span>Enable Deep Plotting</span>
                        </label>
                        <label class="checkbox_label">
                            <input type="checkbox" id="${EXTENSION_NAME}_auto_inject" ${this.settings.autoInject ? 'checked' : ''}>
                            <span>Auto-inject into prompts</span>
                        </label>
                        
                        <div class="deep_plotting_position">
                            <label>Position:</label>
                            <label class="radio_label">
                                <input type="radio" name="${EXTENSION_NAME}_position" value="before" 
                                    ${this.settings.plotPosition === 'before' ? 'checked' : ''}>
                                <span>Before Story String</span>
                            </label>
                            <label class="radio_label">
                                <input type="radio" name="${EXTENSION_NAME}_position" value="after" 
                                    ${this.settings.plotPosition === 'after' ? 'checked' : ''}>
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
                            <textarea id="plot-notes" class="text_pole textarea_compact" rows="4" 
                                placeholder="Enter your plot notes here...">${this.settings.plotNotes || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#extensions_settings2').append(html);
        this.initEventListeners();
    }

    initEventListeners() {
        // Main settings
        $(`#${EXTENSION_NAME}_enabled`).on('change', (e) => {
            this.settings.enabled = !!$(e.target).prop('checked');
            saveSettingsDebounced();
        });

        $(`#${EXTENSION_NAME}_auto_inject`).on('change', (e) => {
            this.settings.autoInject = !!$(e.target).prop('checked');
            saveSettingsDebounced();
        });

        $(`input[name="${EXTENSION_NAME}_position"]`).on('change', (e) => {
            this.settings.plotPosition = $(e.target).val();
            saveSettingsDebounced();
        });

        $('#plot-notes').on('input', (e) => {
            this.settings.plotNotes = $(e.target).val();
            saveSettingsDebounced();
        });

        // Drawer toggle
        $('.inline-drawer-toggle').on('click', function() {
            $(this).next('.inline-drawer-content').slideToggle(200);
            $(this).find('.inline-drawer-icon')
                .toggleClass('fa-circle-chevron-down')
                .toggleClass('fa-circle-chevron-up');
        });

        // Initialize component event listeners
        this.plotManager.initEventListeners();
        this.characterArcManager.initEventListeners();
    }
}

// Handle chat changes
function onChatChanged() {
    const settings = extension_settings[EXTENSION_NAME];
    if (!settings || !settings.enabled) return;

    // Auto inject logic can go here
    if (settings.autoInject) {
        // Implement auto inject logic based on context
    }
}

// Initialize extension settings
function loadSettings() {
    // Initialize settings if they don't exist
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = defaultSettings;
        saveSettingsDebounced();
    }
}

// Module initialization
jQuery(function() {
    // This runs when the document is ready
    try {
        // This is the standard SillyTavern extension pattern
        loadSettings();
        const extension = new DeepPlottingExtension();
        extension.createUI();
        
        // Register event handlers
        eventSource.on(event_types.CHAT_CHANGED, onChatChanged);
        
        // Add console log for debugging
        console.log(`${EXTENSION_NAME} extension loaded`);
    } catch (error) {
        console.error(`Error loading ${EXTENSION_NAME} extension:`, error);
    }
});
