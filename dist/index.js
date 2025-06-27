// Deep Plotter SillyTavern extension – minimal bootstrap
// Version 0.0.4

const extensionName = 'deep-plotter';
const TARGETS = '.form_create_bottom_buttons_block, #GroupFavDelOkBack, #form_character_search_form';

function injectIcon() {
  // Avoid duplicates
  if (document.querySelector('.deepPlotter-icon')) return;

  const icon = document.createElement('div');
  // Using wpexplorer icon which is bundled with ST FA set (same as reference extension)
  icon.className = 'menu_button fa-brands fa-wpexplorer interactable deepPlotter-icon';
  icon.textContent = '';
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

function observeContainers() {
  document.querySelectorAll(TARGETS).forEach((parent) => {
    const obs = new MutationObserver(() => injectIcon());
    obs.observe(parent, { childList: true });
  });
}

function waitForToolbars() {
  if (document.querySelectorAll(TARGETS).length) {
    injectIcon();
    // Ensure we have basic styling so the icon is visible
    const styleId = 'deep-plotter-inline-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .deepPlotter-icon {
          font-size: 18px;
          line-height: 1;
          margin-right: 4px;
          color: var(--SmartThemeBodyColor, #fff);
        }
        .deepPlotter-icon:hover {
          color: var(--SmartThemeAccent, #64b5f6);
        }
      `;
      document.head.appendChild(style);
    }

    const echo = window?.st_echo;
    if (typeof echo === 'function') {
      echo('success', '[Deep-Plotter] Button added.');
    } else {
      console.log('[Deep-Plotter] Button added.');
    }
    observeContainers();
  } else {
    setTimeout(waitForToolbars, 500);
  }
}

function main() {
  const echo = window?.st_echo;
  if (typeof echo === 'function') {
    echo('success', `[${extensionName}] Extension loaded.`);
  } else {
    console.log(`[${extensionName}] Extension loaded.`);
  }

  // Preferred: use SillyTavern helper if present
  if (typeof window !== 'undefined' && window.SillyTavern && typeof window.SillyTavern.registerExtension === 'function') {
    window.SillyTavern.registerExtension({
      id: extensionName,
      name: 'Deep Plotter',
      icon: 'fa-brands fa-wpexplorer',
      onClick: () => {
        const echo = window?.st_echo;
        if (typeof echo === 'function') {
          echo('info', '[Deep-Plotter] Popup coming soon!');
        } else {
          alert('Deep Plotter popup coming soon!');
        }
      },
    });
  } else {
    // Fallback to raw DOM injection if registerExtension is unavailable
    waitForToolbars();
  }
}

// Ensure we run after the DOM is ready so the toolbar exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

export default { onExtensionLoaded: main }; 