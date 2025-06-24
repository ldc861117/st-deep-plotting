/**
 * Plot Manager UI Component for Deep Plotting Extension
 */

export class PlotManager {
    constructor(extension) {
        this.extension = extension;
        this.currentPlot = null;
    }

    /**
     * Render the plot manager UI
     * @returns {string} HTML for plot manager
     */
    render() {
        const templateOptions = Object.entries(this.extension.templates.plotTemplates)
            .map(([key, template]) => `<option value="${key}">${template.name}</option>`)
            .join('');

        return `
            <div class="plot-manager">
                <div class="plot-header">
                    <h3>Plot Structure</h3>
                    <div>
                        <select id="plot-template-selector" class="plot-template-selector">
                            <option value="">--Select a Plot Template--</option>
                            ${templateOptions}
                        </select>
                        <button id="new-plot-btn" class="btn btn-primary">New Plot</button>
                    </div>
                </div>

                <div id="active-plot" class="active-plot">
                    ${this.renderActivePlot()}
                </div>

                <div class="plot-visualization" id="plot-visualization">
                    <p class="no-plot-message">No active plot structure. Select a template to get started.</p>
                </div>
            </div>
        `;
    }

    /**
     * Render the active plot structure
     * @returns {string} HTML for active plot
     */
    renderActivePlot() {
        if (!this.extension.settings.activePlot) {
            return '<p>No active plot. Select a template to begin.</p>';
        }

        const plot = this.extension.settings.activePlot;
        const acts = plot.acts.map((act, actIndex) => {
            const stages = act.stages.map((stage, stageIndex) => {
                const isCompleted = this.extension.plotProgress.isStageCompleted(actIndex, stageIndex);
                const checkedAttr = isCompleted ? 'checked="checked"' : '';

                return `
                    <div class="plot-point">
                        <div>
                            <input type="checkbox" id="stage-${actIndex}-${stageIndex}"
                                data-act="${actIndex}" data-stage="${stageIndex}"
                                class="plot-stage-checkbox" ${checkedAttr}>
                            <label for="stage-${actIndex}-${stageIndex}">${stage.name}</label>
                        </div>
                        <div class="plot-point-controls">
                            <button class="plot-point-edit btn btn-sm"
                                data-act="${actIndex}" data-stage="${stageIndex}">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="plot-point-inject btn btn-sm"
                                data-act="${actIndex}" data-stage="${stageIndex}">
                                <i class="fa-solid fa-bolt"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="plot-section">
                    <h4>${act.name}</h4>
                    <p>${act.description}</p>
                    <div class="plot-stages">
                        ${stages}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="active-plot-content">
                <h3>${plot.name}</h3>
                <p>${plot.description}</p>
                ${acts}
            </div>
        `;
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        $('#plot-template-selector').on('change', (e) => {
            const templateKey = $(e.target).val();
            if (!templateKey) return;

            this.extension.loadPlotTemplate(templateKey);
            $('#active-plot').html(this.renderActivePlot());
            this.visualizePlot();
        });

        $('#new-plot-btn').on('click', () => {
            // Show dialog to create new plot
            this.showNewPlotDialog();
        });

        // Delegate event for dynamic elements
        $('#active-plot').on('change', '.plot-stage-checkbox', (e) => {
            const actIndex = $(e.target).data('act');
            const stageIndex = $(e.target).data('stage');
            const isCompleted = $(e.target).prop('checked');

            this.extension.plotProgress.setStageCompleted(actIndex, stageIndex, isCompleted);
            this.visualizePlot();
        });

        $('#active-plot').on('click', '.plot-point-edit', (e) => {
            const actIndex = $(e.target).closest('.plot-point-edit').data('act');
            const stageIndex = $(e.target).closest('.plot-point-edit').data('stage');
            this.showEditStageDialog(actIndex, stageIndex);
        });

        $('#active-plot').on('click', '.plot-point-inject', (e) => {
            const actIndex = $(e.target).closest('.plot-point-inject').data('act');
            const stageIndex = $(e.target).closest('.plot-point-inject').data('stage');
            this.extension.injectStageIntoPrompt(actIndex, stageIndex);
        });
    }

    /**
     * Show dialog to edit a stage
     */
    showEditStageDialog(actIndex, stageIndex) {
        // Implementation will use SillyTavern's dialog system
        // This is a placeholder for now
        console.log(`Edit stage ${actIndex}-${stageIndex}`);
    }

    /**
     * Show dialog to create a new plot
     */
    showNewPlotDialog() {
        // Implementation will use SillyTavern's dialog system
        // This is a placeholder for now
        console.log('Create new plot');
    }

    /**
     * Visualize the current plot structure
     */
    visualizePlot() {
        if (!this.extension.settings.activePlot) {
            $('#plot-visualization').html('<p class="no-plot-message">No active plot structure. Select a template to get started.</p>');
            return;
        }

        // In a full implementation, this would render a visual representation
        // of the plot structure, perhaps using a library like D3.js
        // For now, we'll use a placeholder visualization
        $('#plot-visualization').html('<p>Plot visualization placeholder</p>');
    }
}
