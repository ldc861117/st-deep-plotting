/**
 * Deep Plotting Extension for SillyTavern
 */

// Author: User

// Extension constants
const EXTENSION_NAME = 'deep_plotting';

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

// Templates for plot structures and character arcs
const templates = {
    plotTemplates: {
        threeAct: {
            name: "Three-Act Structure",
            description: "Classic three-act structure for storytelling",
            acts: [
                {
                    name: "Act 1: Setup",
                    description: "Introduce the characters and world, establish the status quo, and present the inciting incident",
                    stages: [
                        { name: "Exposition", description: "Introduce the main character and their world" },
                        { name: "Inciting Incident", description: "Event that disrupts the status quo" },
                        { name: "Plot Point 1", description: "Character decides to pursue the goal" }
                    ]
                },
                {
                    name: "Act 2: Confrontation",
                    description: "The protagonist faces obstacles, meets allies and enemies, and experiences setbacks",
                    stages: [
                        { name: "Rising Action", description: "Character faces initial obstacles" },
                        { name: "Midpoint", description: "Major twist or revelation that raises the stakes" },
                        { name: "Complications", description: "Increasing difficulties and setbacks" },
                        { name: "Plot Point 2", description: "Lowest point, all seems lost" }
                    ]
                },
                {
                    name: "Act 3: Resolution",
                    description: "The climax and resolution of the story",
                    stages: [
                        { name: "Final Push", description: "Character makes one last effort" },
                        { name: "Climax", description: "Final confrontation with the antagonist/problem" },
                        { name: "Resolution", description: "Wrap up loose ends and show the new status quo" }
                    ]
                }
            ]
        },
        heroJourney: {
            name: "Hero's Journey",
            description: "Campbell's monomyth structure for epic storytelling",
            acts: [
                {
                    name: "Departure",
                    description: "The hero leaves the ordinary world",
                    stages: [
                        { name: "Ordinary World", description: "Establish the hero's normal life" },
                        { name: "Call to Adventure", description: "Hero is presented with a challenge or quest" },
                        { name: "Refusal of the Call", description: "Initial reluctance to change" },
                        { name: "Meeting the Mentor", description: "Guidance from a wise figure" },
                        { name: "Crossing the Threshold", description: "Hero commits to the adventure" }
                    ]
                },
                {
                    name: "Initiation",
                    description: "The hero faces trials in a special world",
                    stages: [
                        { name: "Tests, Allies, Enemies", description: "Hero faces challenges and meets friends/foes" },
                        { name: "Approach to the Inmost Cave", description: "Preparation for major challenge" },
                        { name: "Ordeal", description: "Central crisis of the adventure" },
                        { name: "Reward", description: "Hero gains something important" }
                    ]
                },
                {
                    name: "Return",
                    description: "The hero returns transformed",
                    stages: [
                        { name: "The Road Back", description: "Begin journey back to ordinary world" },
                        { name: "Resurrection", description: "Final test showing hero's transformation" },
                        { name: "Return with the Elixir", description: "Hero brings something of value back" }
                    ]
                }
            ]
        }
    },
    characterArcTemplates: {
        redemption: {
            name: "Redemption Arc",
            description: "Character overcomes flaws to become a better person",
            stages: [
                { name: "Establish Flaw", description: "Show character's negative traits" },
                { name: "Inciting Incident", description: "Event that challenges character's worldview" },
                { name: "Resistance", description: "Character resists changing" },
                { name: "Glimpse of Change", description: "Moment showing potential for growth" },
                { name: "Regression", description: "Return to old ways after setback" },
                { name: "Rock Bottom", description: "Lowest point forcing reflection" },
                { name: "Decision to Change", description: "Conscious choice to improve" },
                { name: "Atonement", description: "Making amends for past actions" },
                { name: "Redemption", description: "Final act proving change is complete" }
            ]
        },
        corruption: {
            name: "Corruption Arc",
            description: "Character's descent from good to evil",
            stages: [
                { name: "Establish Virtue", description: "Show character's positive traits" },
                { name: "Temptation", description: "Introduction of corrupting influence" },
                { name: "Justification", description: "Rationalization of small compromises" },
                { name: "First Major Compromise", description: "Crossing a moral line" },
                { name: "Point of No Return", description: "Action that cannot be undone" },
                { name: "Embracing Corruption", description: "Acceptance of new identity" },
                { name: "Complete Transformation", description: "Character fully transformed" }
            ]
        },
        growth: {
            name: "Growth Arc",
            description: "Character develops new skills or understanding",
            stages: [
                { name: "Establish Need", description: "Show why growth is necessary" },
                { name: "Resistance", description: "Character avoids change" },
                { name: "Acceptance", description: "Character accepts need to grow" },
                { name: "Training/Learning", description: "Process of development begins" },
                { name: "Setback", description: "Failure that tests resolve" },
                { name: "Renewed Effort", description: "Commitment to continue" },
                { name: "Mastery", description: "Achievement of growth goal" },
                { name: "Integration", description: "New abilities become part of character" }
            ]
        }
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

// Simple PlotManager class
class PlotManager {
    constructor(extension) {
        this.extension = extension;
    }
    
    render() {
        return `
            <div class="plot-manager">
                <h3>Plot Structure</h3>
                <div class="plot-controls">
                    <select id="plot-template-selector" class="text_pole">
                        <option value="">--Select a Plot Template--</option>
                        ${Object.entries(this.extension.templates.plotTemplates)
                            .map(([key, template]) => `<option value="${key}">${template.name}</option>`)
                            .join('')}
                    </select>
                    <button id="apply-plot-template" class="menu_button">Apply</button>
                </div>
                
                <div id="active-plot-container" class="plot-section">
                    <p>No active plot. Select a template to begin.</p>
                </div>
            </div>
        `;
    }
    
    initEventListeners() {
        $(`#plot-template-selector`).on('change', (e) => {
            const templateKey = $(e.target).val();
            if (!templateKey) return;
            
            // Update UI with selected template
            this.updatePlotUI(templateKey);
        });
        
        $(`#apply-plot-template`).on('click', () => {
            const templateKey = $(`#plot-template-selector`).val();
            if (!templateKey) return;
            
            // Apply the template
            this.applyTemplate(templateKey);
        });
    }
    
    updatePlotUI(templateKey) {
        const template = this.extension.templates.plotTemplates[templateKey];
        if (!template) return;
        
        let html = `
            <h4>${template.name}</h4>
            <p>${template.description}</p>
            <div class="plot-structure">
        `;
        
        // Render acts and stages
        html += template.acts.map((act, actIndex) => {
            return `
                <div class="plot-act">
                    <h5>${act.name}</h5>
                    <p>${act.description}</p>
                    <ul class="plot-stages">
                        ${act.stages.map((stage, stageIndex) => {
                            return `
                                <li class="plot-stage">
                                    <span>${stage.name}</span>
                                    <p>${stage.description}</p>
                                </li>
                            `;
                        }).join('')}
                    </ul>
                </div>
            `;
        }).join('');
        
        html += `</div>`;
        
        $(`#active-plot-container`).html(html);
    }
    
    applyTemplate(templateKey) {
        const template = this.extension.templates.plotTemplates[templateKey];
        if (!template) return;
        
        // Save the selected template to settings
        this.extension.settings.selectedPlotTemplate = templateKey;
        this.extension.settings.activePlot = JSON.parse(JSON.stringify(template));
        
        // Save settings
        if (typeof saveSettingsDebounced !== 'undefined') {
            saveSettingsDebounced();
        }
        
        console.log(`[${EXTENSION_NAME}] Applied plot template: ${template.name}`);
    }
    
    generateContent() {
        if (!this.extension.settings.activePlot) {
            return '';
        }
        
        const plot = this.extension.settings.activePlot;
        let content = `Plot Structure: ${plot.name}\n`;
        
        // Add acts and stages
        plot.acts.forEach((act, actIndex) => {
            content += `\n${act.name}: ${act.description}\n`;
            
            act.stages.forEach((stage, stageIndex) => {
                content += `- ${stage.name}: ${stage.description}\n`;
            });
        });
        
        return content;
    }
}

// Simple CharacterArcManager class
class CharacterArcManager {
    constructor(extension) {
        this.extension = extension;
    }
    
    render() {
        return `
            <div class="character-arc-manager">
                <h3>Character Arcs</h3>
                <div class="character-arc-controls">
                    <select id="character-arc-template-selector" class="text_pole">
                        <option value="">--Select an Arc Template--</option>
                        ${Object.entries(this.extension.templates.characterArcTemplates)
                            .map(([key, template]) => `<option value="${key}">${template.name}</option>`)
                            .join('')}
                    </select>
                    <input type="text" id="character-name-input" class="text_pole" placeholder="Character name">
                    <button id="create-character-arc" class="menu_button">Create</button>
                </div>
                
                <div id="character-arcs-container" class="plot-section">
                    ${this.renderCharacterArcs()}
                </div>
            </div>
        `;
    }
    
    renderCharacterArcs() {
        if (!this.extension.settings.characterArcs || this.extension.settings.characterArcs.length === 0) {
            return '<p>No character arcs defined. Create one to begin.</p>';
        }
        
        return this.extension.settings.characterArcs.map((arc, arcIndex) => {
            return `
                <div class="character-arc" data-arc-index="${arcIndex}">
                    <div class="character-arc-header">
                        <h4>${arc.character} - ${arc.arcType}</h4>
                        <button class="delete-arc-btn menu_button" data-arc="${arcIndex}">Delete</button>
                    </div>
                    
                    <div class="character-arc-stages">
                        <ul>
                            ${arc.stages.map((stage, stageIndex) => {
                                const isCompleted = stage.completed || false;
                                const checkedAttr = isCompleted ? 'checked="checked"' : '';
                                
                                return `
                                    <li class="arc-stage">
                                        <input type="checkbox" id="arc-stage-${arcIndex}-${stageIndex}" 
                                            class="arc-stage-checkbox" data-arc="${arcIndex}" data-stage="${stageIndex}"
                                            ${checkedAttr}>
                                        <label for="arc-stage-${arcIndex}-${stageIndex}">${stage.name}</label>
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    initEventListeners() {
        $(`#create-character-arc`).on('click', () => {
            const templateKey = $(`#character-arc-template-selector`).val();
            const characterName = $(`#character-name-input`).val().trim();
            
            if (!templateKey || !characterName) {
                console.log(`[${EXTENSION_NAME}] Cannot create character arc: missing template or character name`);
                return;
            }
            
            this.createCharacterArc(templateKey, characterName);
        });
        
        // Delegate events for dynamic elements
        $(`#character-arcs-container`).on('change', '.arc-stage-checkbox', (e) => {
            const arcIndex = $(e.target).data('arc');
            const stageIndex = $(e.target).data('stage');
            const isCompleted = $(e.target).prop('checked');
            
            this.setStageCompleted(arcIndex, stageIndex, isCompleted);
        });
        
        $(`#character-arcs-container`).on('click', '.delete-arc-btn', (e) => {
            const arcIndex = $(e.target).data('arc');
            this.deleteCharacterArc(arcIndex);
        });
    }
    
    createCharacterArc(templateKey, characterName) {
        const template = this.extension.templates.characterArcTemplates[templateKey];
        if (!template) return;
        
        // Initialize character arcs array if it doesn't exist
        if (!this.extension.settings.characterArcs) {
            this.extension.settings.characterArcs = [];
        }
        
        // Create a new character arc based on the template
        const newArc = {
            character: characterName,
            arcType: template.name,
            description: template.description,
            stages: JSON.parse(JSON.stringify(template.stages))
        };
        
        // Add the new arc to the settings
        this.extension.settings.characterArcs.push(newArc);
        
        // Save settings
        if (typeof saveSettingsDebounced !== 'undefined') {
            saveSettingsDebounced();
        }
        
        // Update UI
        $(`#character-arcs-container`).html(this.renderCharacterArcs());
        
        console.log(`[${EXTENSION_NAME}] Created character arc for ${characterName}`);
    }
    
    deleteCharacterArc(arcIndex) {
        if (!this.extension.settings.characterArcs || 
            arcIndex < 0 || 
            arcIndex >= this.extension.settings.characterArcs.length) {
            return;
        }
        
        // Remove the arc
        this.extension.settings.characterArcs.splice(arcIndex, 1);
        
        // Save settings
        if (typeof saveSettingsDebounced !== 'undefined') {
            saveSettingsDebounced();
        }
        
        // Update UI
        $(`#character-arcs-container`).html(this.renderCharacterArcs());
        
        console.log(`[${EXTENSION_NAME}] Deleted character arc at index ${arcIndex}`);
    }
    
    setStageCompleted(arcIndex, stageIndex, isCompleted) {
        if (!this.extension.settings.characterArcs || 
            arcIndex < 0 || 
            arcIndex >= this.extension.settings.characterArcs.length ||
            !this.extension.settings.characterArcs[arcIndex].stages ||
            stageIndex < 0 ||
            stageIndex >= this.extension.settings.characterArcs[arcIndex].stages.length) {
            return;
        }
        
        // Update the stage completion status
        this.extension.settings.characterArcs[arcIndex].stages[stageIndex].completed = isCompleted;
        
        // Save settings
        if (typeof saveSettingsDebounced !== 'undefined') {
            saveSettingsDebounced();
        }
        
        console.log(`[${EXTENSION_NAME}] Set character arc stage ${arcIndex}-${stageIndex} completed: ${isCompleted}`);
    }
    
    onCharacterSelected(data) {
        // Handle character selection event
        console.log(`[${EXTENSION_NAME}] Character selected:`, data?.name);
    }
    
    generateContent() {
        if (!this.extension.settings.characterArcs || this.extension.settings.characterArcs.length === 0) {
            return '';
        }
        
        let content = `\nCharacter Arcs:\n`;
        
        this.extension.settings.characterArcs.forEach((arc, arcIndex) => {
            content += `\n${arc.character} - ${arc.arcType}:\n`;
            
            arc.stages.forEach((stage, stageIndex) => {
                const status = stage.completed ? '[COMPLETED]' : '[PENDING]';
                content += `- ${stage.name} ${status}: ${stage.description}\n`;
            });
        });
        
        return content;
    }
}

class DeepPlottingExtension {
    constructor() {
        this.settings = extension_settings[EXTENSION_NAME] || {};
        this.templates = templates;
        this.plotManager = new PlotManager(this);
        this.characterArcManager = new CharacterArcManager(this);
    }
    
    initEventListeners() {
        // Set up event listeners for the settings
        $(`#${EXTENSION_NAME}_enabled`).on('change', (e) => {
            this.settings.enabled = $(e.target).prop('checked');
            saveSettingsDebounced();
        });
        
        $(`#${EXTENSION_NAME}_auto_inject`).on('change', (e) => {
            this.settings.autoInject = $(e.target).prop('checked');
            saveSettingsDebounced();
        });
        
        $(`input[name="${EXTENSION_NAME}_position"]`).on('change', (e) => {
            this.settings.plotPosition = $(e.target).val();
            saveSettingsDebounced();
        });
        
        $(`#plot-notes`).on('change', (e) => {
            this.settings.plotNotes = $(e.target).val();
            saveSettingsDebounced();
        });
        
        // Set up the drawer toggle functionality
        $(`#${EXTENSION_NAME}_settings .inline-drawer-toggle`).on('click', function() {
            const drawer = $(this).closest('.inline-drawer');
            const content = drawer.find('.inline-drawer-content');
            
            if (content.is(':visible')) {
                content.hide();
                drawer.removeClass('open');
            } else {
                content.show();
                drawer.addClass('open');
            }
        });
        
        // Show the drawer content by default
        $(`#${EXTENSION_NAME}_settings .inline-drawer-content`).show();
        $(`#${EXTENSION_NAME}_settings .inline-drawer`).addClass('open');
        
        // Set up plot manager and character arc manager event listeners
        this.plotManager.initEventListeners();
        this.characterArcManager.initEventListeners();
    }
    
    // Method to generate plot content for injection into prompts
    generateContent() {
        let content = '';
        
        // Add plot structure
        const plotContent = this.plotManager.generateContent();
        if (plotContent) {
            content += plotContent;
        }
        
        // Add character arcs
        const arcContent = this.characterArcManager.generateContent();
        if (arcContent) {
            content += arcContent;
        }
        
        // Add plot notes
        if (this.settings.plotNotes && this.settings.plotNotes.trim() !== '') {
            content += `\n\nPlot Notes: ${this.settings.plotNotes}`;
        }
        
        return content;
    }
    
    // Method to inject plot content into prompts
    injectPlotContent(prompt) {
        if (!this.settings.enabled || !this.settings.autoInject) {
            return prompt;
        }
        
        const plotContent = this.generateContent();
        
        if (!plotContent) {
            return prompt;
        }
        
        // Determine where to inject the plot content
        if (this.settings.plotPosition === 'before') {
            return `${plotContent}\n\n${prompt}`;
        } else {
            return `${prompt}\n\n${plotContent}`;
        }
    }
}

// Handle chat changes
function onChatChanged() {
    if (!extension_settings?.[EXTENSION_NAME]?.enabled) return;

    // Auto inject logic can go here
    if (extension_settings[EXTENSION_NAME].autoInject) {
        // Implement auto inject logic based on context
    }
}

// Load extension settings
function loadSettings() {
    console.log(`[${EXTENSION_NAME}] Loading settings...`);
    
    // Check if extension_settings exists
    if (typeof extension_settings === 'undefined') {
        console.log(`[${EXTENSION_NAME}] extension_settings is not defined yet, creating it...`);
        window.extension_settings = {};
    }
    
    // Initialize settings if they don't exist
    if (!extension_settings[EXTENSION_NAME]) {
        console.log(`[${EXTENSION_NAME}] Creating default settings`);
        extension_settings[EXTENSION_NAME] = {
            enabled: true,
            autoInject: false,
            plotPosition: 'after',
            plotNotes: '',
            plotPoints: [],
            characterArcs: []
        };
        
        // Save settings
        if (typeof saveSettingsDebounced !== 'undefined') {
            saveSettingsDebounced();
        } else {
            console.log(`[${EXTENSION_NAME}] saveSettingsDebounced is not defined yet`);
            // Try to find it in the window object
            if (typeof window.saveSettingsDebounced !== 'undefined') {
                window.saveSettingsDebounced();
            } else {
                console.warn(`[${EXTENSION_NAME}] Could not save settings, saveSettingsDebounced not found`);
            }
        }
    }
    
    return extension_settings[EXTENSION_NAME];
}

// Set up event listeners for SillyTavern events
function setupListeners() {
    console.log(`[${EXTENSION_NAME}] Setting up event listeners...`);
    
    let eventSourceFound = false;
    
    // Try to find eventSource in different contexts
    if (typeof eventSource !== 'undefined') {
        console.log(`[${EXTENSION_NAME}] Using global eventSource`);
        registerEvents(eventSource);
        eventSourceFound = true;
    } else if (typeof window.eventSource !== 'undefined') {
        console.log(`[${EXTENSION_NAME}] Using SillyTavern context eventSource`);
        registerEvents(window.eventSource);
        eventSourceFound = true;
        console.log(`[${EXTENSION_NAME}] Event listeners set up using SillyTavern context`);
    } else {
        console.warn(`[${EXTENSION_NAME}] eventSource not found, will try again later`);
        
        // Try to find it after a short delay
        setTimeout(() => {
            if (typeof eventSource !== 'undefined') {
                console.log(`[${EXTENSION_NAME}] Found eventSource after delay`);
                registerEvents(eventSource);
            } else if (typeof window.eventSource !== 'undefined') {
                console.log(`[${EXTENSION_NAME}] Found window.eventSource after delay`);
                registerEvents(window.eventSource);
            } else {
                console.error(`[${EXTENSION_NAME}] Could not find eventSource, some features may not work`);
            }
        }, 2000);
    }
    
    return eventSourceFound;
}

// Register event handlers with the event source
function registerEvents(source) {
    if (!source) {
        console.error(`[${EXTENSION_NAME}] Cannot register events: event source is null or undefined`);
        return;
    }
    
    // Listen for prompt generation to inject our plot content
    source.on('generate', (data) => {
        if (!extension_settings[EXTENSION_NAME]?.enabled) {
            return;
        }
        
        try {
            const extension = new DeepPlottingExtension();
            
            if (extension_settings[EXTENSION_NAME].autoInject && data.prompt) {
                data.prompt = extension.injectPlotContent(data.prompt);
            }
        } catch (error) {
            console.error(`[${EXTENSION_NAME}] Error in generate event handler:`, error);
        }
    });
    
    // Listen for character changes to update character arcs
    source.on('character_selected', (data) => {
        if (!extension_settings[EXTENSION_NAME]?.enabled) {
            return;
        }
        
        try {
            const extension = new DeepPlottingExtension();
            extension.characterArcManager.onCharacterSelected(data);
        } catch (error) {
            console.error(`[${EXTENSION_NAME}] Error in character_selected event handler:`, error);
        }
    });
    
    // Listen for settings updates
    source.on('settings_updated', (data) => {
        if (data?.extension === EXTENSION_NAME) {
            console.log(`[${EXTENSION_NAME}] Settings updated`);
        }
    });
}

// Initialize the extension
function initializeExtension() {
    console.log(`[${EXTENSION_NAME}] Initializing...`);
    
    try {
        // Load settings
        loadSettings();
        
        // Set up event listeners
        setupListeners();
        
        // Create the UI
        createUI();
        
        console.log(`[${EXTENSION_NAME}] Extension loaded successfully!`);
        return true;
    } catch (error) {
        console.error(`[${EXTENSION_NAME}] Error initializing extension:`, error);
        return false;
    }
}

// Create the UI for the extension
function createUI() {
    console.log(`[${EXTENSION_NAME}] Creating UI...`);
    
    // Create a new instance of the extension
    const extension = new DeepPlottingExtension();
    
    // First, create the extension menu item
    const menuHtml = `
        <div id="${EXTENSION_NAME}_menu" class="list-group-item flex-container flexGap5">
            <div class="fa-solid fa-book-open extensionsMenuExtensionButton" title="Deep Plotting"></div>
            Deep Plotting
        </div>
    `;
    
    // Then create the extension settings panel
    const settingsHtml = `
        <div id="${EXTENSION_NAME}_settings" class="extension_settings">
            <div class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>Deep Plotting</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down"></div>
                </div>
                <div class="inline-drawer-content">
                    <label class="checkbox_label">
                        <input type="checkbox" id="${EXTENSION_NAME}_enabled" ${extension.settings.enabled ? 'checked' : ''}>
                        <span>Enable Deep Plotting</span>
                    </label>
                    <label class="checkbox_label">
                        <input type="checkbox" id="${EXTENSION_NAME}_auto_inject" ${extension.settings.autoInject ? 'checked' : ''}>
                        <span>Auto-inject into prompts</span>
                    </label>
                    
                    <div class="deep_plotting_position">
                        <label>Position:</label>
                        <label class="radio_label">
                            <input type="radio" name="${EXTENSION_NAME}_position" value="before" 
                                ${extension.settings.plotPosition === 'before' ? 'checked' : ''}>
                            <span>Before Story String</span>
                        </label>
                        <label class="radio_label">
                            <input type="radio" name="${EXTENSION_NAME}_position" value="after" 
                                ${extension.settings.plotPosition === 'after' ? 'checked' : ''}>
                            <span>After Story String</span>
                        </label>
                    </div>

                    <div id="plot-manager-container" class="plot-section">
                        ${extension.plotManager.render()}
                    </div>

                    <div id="character-arc-container" class="plot-section">
                        ${extension.characterArcManager.render()}
                    </div>

                    <div class="plot-section">
                        <h3>Plot Notes</h3>
                        <textarea id="plot-notes" class="text_pole textarea_compact" rows="4" 
                            placeholder="Enter your plot notes here...">${extension.settings.plotNotes || ''}</textarea>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Try different selectors to find where to append our UI
    const menuContainer = $('#extensionsMenu');
    if (menuContainer.length > 0) {
        console.log(`[${EXTENSION_NAME}] Found menu container: #extensionsMenu`);
        menuContainer.append(menuHtml);
    } else {
        console.warn(`[${EXTENSION_NAME}] Could not find #extensionsMenu container`);
    }
    
    // Try different selectors for the settings container
    const possibleContainers = [
        '#extensions_settings',
        '#extensions_settings2',
        '#extensions-settings',
        '#extension_settings',
        '#system_settings',
        '#settings_pane'
    ];
    
    let containerFound = false;
    
    for (const selector of possibleContainers) {
        const container = $(selector);
        if (container.length > 0) {
            console.log(`[${EXTENSION_NAME}] Found container: ${selector}`);
            container.append(settingsHtml);
            containerFound = true;
            break;
        }
    }
    
    if (!containerFound) {
        console.error(`[${EXTENSION_NAME}] Could not find any suitable container for the settings UI`);
        // Try to append to body as a last resort
        $('body').append(settingsHtml);
        console.warn(`[${EXTENSION_NAME}] Appended settings UI to body as a fallback`);
    }
    
    // Set up click handler for the menu item to show the settings
    $(`#${EXTENSION_NAME}_menu`).on('click', function() {
        // Hide all other extension settings
        $('.extension_settings').hide();
        // Show our settings
        $(`#${EXTENSION_NAME}_settings`).show();
    });
    
    // Set up event listeners for the UI
    extension.initEventListeners();
    
    // Check if the UI was created successfully
    setTimeout(() => {
        const uiElement = $(`#${EXTENSION_NAME}_settings`);
        if (uiElement.length > 0) {
            console.log(`[${EXTENSION_NAME}] UI element created successfully`);
        } else {
            console.warn(`[${EXTENSION_NAME}] UI element not found in DOM!`);
        }
    }, 500);
}

// Wait for jQuery and SillyTavern to be ready
$(document).ready(function() {
    // Wait for SillyTavern to initialize
    const maxAttempts = 10;
    let attempts = 0;
    
    function tryInitialize() {
        attempts++;
        
        if (attempts > maxAttempts) {
            console.error(`[${EXTENSION_NAME}] Maximum initialization attempts reached, giving up`);
            return;
        }
        
        console.log(`[${EXTENSION_NAME}] Initialization attempt ${attempts}/${maxAttempts}`);
        
        // Check if key SillyTavern elements exist
        const extensionsMenu = $('#extensionsMenu').length > 0;
        const extensionsSettings = $('#extensions_settings').length > 0 || 
                                  $('#extensions_settings2').length > 0 || 
                                  $('#extensions-settings').length > 0;
        
        if (extensionsMenu && extensionsSettings) {
            console.log(`[${EXTENSION_NAME}] SillyTavern UI detected, initializing extension...`);
            initializeExtension();
        } else {
            console.log(`[${EXTENSION_NAME}] SillyTavern UI not ready yet, waiting...`);
            setTimeout(tryInitialize, 1000);
        }
    }
    
    // Start initialization after a short delay
    setTimeout(function() {
        console.log(`[${EXTENSION_NAME}] Timeout elapsed, initializing extension...`);
        tryInitialize();
    }, 3000);
});
