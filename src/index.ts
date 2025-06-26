import { st_echo } from 'sillytavern-utils-lib/config';

const extensionName = 'deep-plotter';

function onExtensionLoaded() {
  st_echo('success', `[${extensionName}] Extension loaded (MVP scaffold)`);
}

// SillyTavern calls default export when the extension is loaded
export default {
  onExtensionLoaded,
}; 