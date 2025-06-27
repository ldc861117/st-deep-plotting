// Deep Plotter SillyTavern extension – minimal bootstrap
// Version 0.0.4

const extensionName = 'deep-plotter';
const TARGETS = '.form_create_bottom_buttons_block, #GroupFavDelOkBack, #form_character_search_form';

function injectIcon() {
  // Avoid duplicates
  if (document.querySelector('.deepPlotter-icon')) return;

  const icon = document.createElement('div');
  icon.className = 'menu_button fa-solid fa-sitemap interactable deepPlotter-icon';
  icon.title = 'Deep Plotter';

  icon.addEventListener('click', () => {
    const echo = window?.st_echo;
    if (typeof echo === 'function') {
      echo('info', '[Deep-Plotter] Popup coming soon!');
    }
  });

  document.querySelectorAll(TARGETS).forEach((parent) => {
    parent.prepend(icon.cloneNode(true));
  });
}

function main() {
  const echo = window?.st_echo;
  if (typeof echo === 'function') {
    echo('success', `[${extensionName}] Extension loaded.`);
  } else {
    console.log(`[${extensionName}] Extension loaded.`);
  }

  injectIcon();
}

// Ensure we run after the DOM is ready so the toolbar exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

export default { onExtensionLoaded: main }; 