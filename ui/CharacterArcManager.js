/**
 * Character Arc Manager UI Component for Deep Plotting Extension
 */

export class CharacterArcManager {
    constructor(extension) {
        this.extension = extension;
    }

    /**
     * Render the character arc manager UI
     * @returns {string} HTML for character arc manager
     */
    render() {
        const templateOptions = Object.entries(this.extension.templates.characterArcTemplates)
            .map(([key, template]) => `<option value="${key}">${template.name}</option>`)
            .join('');

        const characterArcs = this.renderCharacterArcs();

        return `
            <div class="character-arc-manager">
                <div class="plot-header">
                    <h3>Character Arcs</h3>
                    <div>
                        <select id="character-arc-template-selector" class="plot-template-selector">
                            <option value="">--Select an Arc Template--</option>
                            ${templateOptions}
                        </select>
                        <button id="new-character-arc-btn" class="btn btn-primary">New Character Arc</button>
                    </div>
                </div>

                <div id="character-arcs" class="character-arcs">
                    ${characterArcs}
                </div>
            </div>
        `;
    }

    /**
     * Render all character arcs
     * @returns {string} HTML for character arcs
     */
    renderCharacterArcs() {
        if (!this.extension.settings.characterArcs || this.extension.settings.characterArcs.length === 0) {
            return '<p>No character arcs defined. Select a template to begin.</p>';
        }

        return this.extension.settings.characterArcs.map((arc, arcIndex) => {
            const progress = this.calculateArcProgress(arcIndex);
            const stagesHtml = arc.stages.map((stage, stageIndex) => {
                const isCompleted = stage.completed || false;
                const checkedAttr = isCompleted ? 'checked="checked"' : '';

                return `
                    <div class="plot-point">
                        <div>
                            <input type="checkbox" id="arc-stage-${arcIndex}-${stageIndex}"
                                data-arc="${arcIndex}" data-stage="${stageIndex}"
                                class="arc-stage-checkbox" ${checkedAttr}>
                            <label for="arc-stage-${arcIndex}-${stageIndex}">${stage.name}</label>
                        </div>
                        <div class="plot-point-controls">
                            <button class="arc-stage-edit btn btn-sm"
                                data-arc="${arcIndex}" data-stage="${stageIndex}">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="arc-stage-inject btn btn-sm"
                                data-arc="${arcIndex}" data-stage="${stageIndex}">
                                <i class="fa-solid fa-bolt"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="character-arc" data-arc-index="${arcIndex}">
                    <div class="character-arc-header">
                        <h4>${arc.character} - ${arc.arcType}</h4>
                        <div class="character-arc-controls">
                            <button class="character-arc-edit btn btn-sm" data-arc="${arcIndex}">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="character-arc-delete btn btn-sm" data-arc="${arcIndex}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>

                    <div class="character-arc-progress">
                        <div class="character-arc-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <p>${progress}% Complete</p>

                    <div class="character-arc-stages">
                        ${stagesHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Calculate progress of a character arc
     * @param {number} arcIndex Index of the arc
     * @returns {number} Progress percentage
     */
    calculateArcProgress(arcIndex) {
        const arc = this.extension.settings.characterArcs[arcIndex];
        if (!arc || !arc.stages || arc.stages.length === 0) return 0;

        const completedStages = arc.stages.filter(stage => stage.completed).length;
        const progress = Math.round((completedStages / arc.stages.length) * 100);
        return progress;
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        $('#character-arc-template-selector').on('change', (e) => {
            const templateKey = $(e.target).val();
            if (!templateKey) return;

            // Show dialog to select character and create arc
            this.showNewArcDialog(templateKey);
        });

        $('#new-character-arc-btn').on('click', () => {
            this.showNewArcDialog();
        });

        // Delegate events for dynamic elements
        $('#character-arcs').on('change', '.arc-stage-checkbox', (e) => {
            const arcIndex = $(e.target).data('arc');
            const stageIndex = $(e.target).data('stage');
            const isCompleted = $(e.target).prop('checked');

            this.extension.characterArcProgress.setStageCompleted(arcIndex, stageIndex, isCompleted);
            this.updateArcProgress(arcIndex);
        });

        $('#character-arcs').on('click', '.character-arc-edit', (e) => {
            const arcIndex = $(e.target).closest('.character-arc-edit').data('arc');
            this.showEditArcDialog(arcIndex);
        });

        $('#character-arcs').on('click', '.character-arc-delete', (e) => {
            const arcIndex = $(e.target).closest('.character-arc-delete').data('arc');
            this.deleteCharacterArc(arcIndex);
        });

        $('#character-arcs').on('click', '.arc-stage-edit', (e) => {
            const arcIndex = $(e.target).closest('.arc-stage-edit').data('arc');
            const stageIndex = $(e.target).closest('.arc-stage-edit').data('stage');
            this.showEditStageDialog(arcIndex, stageIndex);
        });

        $('#character-arcs').on('click', '.arc-stage-inject', (e) => {
            const arcIndex = $(e.target).closest('.arc-stage-inject').data('arc');
            const stageIndex = $(e.target).closest('.arc-stage-inject').data('stage');
            this.extension.injectArcStageIntoPrompt(arcIndex, stageIndex);
        });
    }

    /**
     * Show dialog to create a new character arc
     */
    showNewArcDialog(templateKey = null) {
        // Implementation will use SillyTavern's dialog system
        // This is a placeholder for now
        console.log(`Create new character arc with template: ${templateKey}`);
    }

    /**
     * Show dialog to edit a character arc
     */
    showEditArcDialog(arcIndex) {
        // Implementation will use SillyTavern's dialog system
        // This is a placeholder for now
        console.log(`Edit character arc ${arcIndex}`);
    }

    /**
     * Show dialog to edit a stage
     */
    showEditStageDialog(arcIndex, stageIndex) {
        // Implementation will use SillyTavern's dialog system
        // This is a placeholder for now
        console.log(`Edit stage ${arcIndex}-${stageIndex}`);
    }

    /**
     * Delete a character arc
     */
    deleteCharacterArc(arcIndex) {
        // Implementation for deleting character arc
        console.log(`Delete character arc ${arcIndex}`);
    }

    /**
     * Update the progress bar for a character arc
     */
    updateArcProgress(arcIndex) {
        const progress = this.calculateArcProgress(arcIndex);
        const $arc = $(`.character-arc[data-arc-index="${arcIndex}"]`);
        $arc.find('.character-arc-progress-bar').css('width', `${progress}%`);
        $arc.find('.character-arc-progress').next('p').text(`${progress}% Complete`);
    }
}
