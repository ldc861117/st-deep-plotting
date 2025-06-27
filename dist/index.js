const extensionName = 'deep-plotter';

const TARGETS = '.form_create_bottom_buttons_block, #GroupFavDelOkBack, #form_character_search_form';

function addIconOnce() {
  if (document.querySelector('.deepPlotter-icon')) return; // already present

  const tpl = document.createElement('div');
  tpl.innerHTML = `<div class="menu_button fa-solid fa-sitemap interactable deepPlotter-icon" title="Deep Plotter"></div>`;
  const iconNode = tpl.firstChild;
  if (!iconNode) return;

  document.querySelectorAll(TARGETS).forEach((target) => {
    target.insertBefore(iconNode.cloneNode(true), target.firstChild);
  });

  document.querySelectorAll('.deepPlotter-icon').forEach((el) => {
    el.addEventListener('click', () => {
      const echo = typeof window !== 'undefined' ? window.st_echo : undefined;
      if (typeof echo === 'function') {
        echo('info', '[Deep-Plotter] Popup coming soon!');
      }
    });
  });
}

function ensureIcon() {
  addIconOnce();
  // keep trying until it exists, then observe DOM changes to restore if removed
  const intervalId = setInterval(() => {
    if (document.querySelector('.deepPlotter-icon')) {
      clearInterval(intervalId);
      // observe toolbar containers
      const observer = new MutationObserver(() => addIconOnce());
      document.querySelectorAll(TARGETS).forEach((t) => observer.observe(t, { childList: true }));
    } else {
      addIconOnce();
    }
  }, 1000);
}

function onExtensionLoaded() {
  const echo = typeof window !== 'undefined' ? window.st_echo : undefined;
  if (typeof echo === 'function') {
    echo('success', `[${extensionName}] Extension loaded.`);
  } else {
    console.log(`[${extensionName}] Extension loaded.`);
  }
  if (typeof window !== 'undefined') {
    const attempt = () => {
      const targets = document.querySelectorAll('.form_create_bottom_buttons_block, #GroupFavDelOkBack, #form_character_search_form');
      if (targets.length) {
        ensureIcon();
      } else {
        setTimeout(attempt, 500);
      }
    };
    attempt();
  }
}

onExtensionLoaded();

export default {
  onExtensionLoaded,
}; 