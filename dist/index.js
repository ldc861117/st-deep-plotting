import { st_echo } from '../../../../../script.js'; // fallback to SillyTavern global utils

const extensionName = 'deep-plotter';

function onExtensionLoaded() {
  if (typeof st_echo === 'function') {
    st_echo('success', `[${extensionName}] Extension loaded.`);
  } else {
    console.log(`[${extensionName}] Extension loaded.`);
  }
}

export default {
  onExtensionLoaded,
}; 