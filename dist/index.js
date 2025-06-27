const extensionName = 'deep-plotter';

function injectIcon() {
  const iconHtml = `<div class="menu_button fa-solid fa-sitemap interactable deepPlotter-icon" title="Deep Plotter"></div>`;
  const tmp = document.createElement('div');
  tmp.innerHTML = iconHtml.trim();
  const iconTemplate = tmp.firstChild;
  if (!iconTemplate) return;
  document.querySelectorAll('.form_create_bottom_buttons_block, #GroupFavDelOkBack, #form_character_search_form').forEach((target) => {
    target.insertBefore(iconTemplate.cloneNode(true), target.firstChild);
  });

  const icons = document.querySelectorAll('.deepPlotter-icon');
  icons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const echo = typeof window !== 'undefined' ? window.st_echo : undefined;
      if (typeof echo === 'function') {
        echo('info', '[deep-plotter] Popup coming soon!');
      }
    });
  });
}

function onExtensionLoaded() {
  const echo = typeof window !== 'undefined' ? window.st_echo : undefined;
  if (typeof echo === 'function') {
    echo('success', `[${extensionName}] Extension loaded.`);
  } else {
    console.log(`[${extensionName}] Extension loaded.`);
  }
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectIcon);
    } else {
      injectIcon();
    }
  }
}

onExtensionLoaded();

export default {
  onExtensionLoaded,
}; 