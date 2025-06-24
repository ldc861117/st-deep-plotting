# Deep Plotting Extension for SillyTavern

An extension for SillyTavern that enhances storytelling through structured plot management, character arcs, and narrative development tools.

## Features

- **Plot Structure Templates**: Choose from classic storytelling structures like Three-Act Structure, Hero's Journey, and more
- **Character Arc Management**: Define and track character development through proven arc templates
- **Plot Point Tracking**: Mark key story moments as they happen in your narrative
- **Context Injection**: Inject plot points and character arc stages directly into the AI's context
- **Visual Progress Tracking**: See your story's progress visually

## Installation

### Method 1: SillyTavern Extension Installer

1. In SillyTavern, go to **Extensions → Install Extension**
2. Enter `https://github.com/ldc861117/st-deep-plotting` in the GitHub URL field
3. Click **Install**
4. Reload SillyTavern when prompted

### Method 2: Manual Installation

1. Download this repository as a ZIP file or clone it
2. Extract the contents to `YOUR_SILLYTAVERN_FOLDER/public/scripts/extensions/third-party/st-deep-plotting`
3. Restart SillyTavern

## Usage

1. **Choose a Plot Structure**: Select a template from the dropdown to get started
2. **Track Progress**: Check off plot points as you reach them in your story
3. **Manage Character Arcs**: Create arcs for individual characters and track their development
4. **Inject Context**: Use the lightning bolt button to inject specific plot points into your AI's context
5. **Take Notes**: Use the plot notes section to write down important story elements

## Development

### Local Development Setup

1. Clone this repository
2. Set up the correct path in `deploy.sh` to point to your SillyTavern installation
3. Run `./deploy.sh` to deploy the extension locally
4. Reload SillyTavern to see your changes

### File Structure

- `index.js` - Main extension code
- `manifest.json` - Extension metadata and configuration
- `templates.js` - Plot and character arc templates
- `ui/` - UI component files
  - `PlotManager.js` - Plot management UI
  - `CharacterArcManager.js` - Character arc management UI

### Testing Changes

1. Make your changes to the code
2. Run `./deploy.sh` to deploy to your local SillyTavern installation
3. Reload SillyTavern to test your changes
4. Once satisfied, commit your changes and push to GitHub

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Plot Structures Included

- **Three-Act Structure**: The classic beginning, middle, and end structure
- **Hero's Journey**: Campbell's monomyth with 12 stages of the hero's adventure
- **Five-Act Structure**: Extended dramatic structure for complex narratives
- **Save the Cat**: Blake Snyder's 15-beat screenplay structure

## Character Arc Templates

- **Heroic Arc**: A character grows from weakness to strength
- **Fall Arc**: A character falls from grace
- **Redemption Arc**: A character redeems themselves after a fall
- **Flat Arc**: A character changes the world around them while staying true to their beliefs

## Requirements

- SillyTavern (latest version recommended)
- No external dependencies

## Compatibility

The Deep Plotting extension is designed to work alongside other SillyTavern extensions. It pairs especially well with:

- Memory extension for persistent world-building
- Vectors extension for retrieving relevant plot information
- Character expressions for visualizing emotional states tied to plot points

## Future Development

- Advanced plot visualization
- Plot branching support
- Theme and motif tracking
- AI-assisted plot suggestions
- Integration with the World Info system

## Contributing

This extension is open-source and contributions are welcome! Check out the GitHub repository for more information on how to contribute.

## License

MIT License 
