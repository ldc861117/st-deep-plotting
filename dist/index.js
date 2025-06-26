const extensionName = 'deep-plotter';

function onExtensionLoaded() {
  const echo = typeof window !== 'undefined' ? window.st_echo : undefined;
  if (typeof echo === 'function') {
    echo('success', `[${extensionName}] Extension loaded.`);
  } else {
    console.log(`[${extensionName}] Extension loaded.`);
  }
}

export default {
  onExtensionLoaded,
}; 