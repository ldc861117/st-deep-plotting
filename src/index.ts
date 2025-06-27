import { st_echo } from 'sillytavern-utils-lib/config';
import iconUrl from './images/icon.png';

const extensionName = 'deep-plotter';

function onExtensionLoaded() {
  st_echo('success', `[${extensionName}] Extension loaded (MVP scaffold)`);
}

// SillyTavern calls default export when the extension is loaded
export default {
  onExtensionLoaded,
};

SillyTavern.registerExtension({
  id: 'deep-plotter',
  name: 'Deep Plotter',
  icon: iconUrl,
  onClick: () => Popup.show()   // will open our upcoming popup
}); 