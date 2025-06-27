// Deep Plotter SillyTavern extension – TypeScript source
// See dist/index.js for the transpiled output.

const EXTENSION_ID = 'deep-plotter';

/**
 * Shows a SillyTavern toast or falls back to console if st_echo is unavailable.
 * @param level The log level understood by SillyTavern (`success`, `info`, `warning`, `error`).
 * @param message Text to display.
 */
function echo(level: string, message: string): void {
  const stEcho = (window as any)?.st_echo;
  if (typeof stEcho === 'function') {
    stEcho(level, message);
  } else {
    console.log(`[${level}] ${message}`);
  }
}

/**
 * Called automatically by SillyTavern when the extension bundle is loaded.
 */
function onExtensionLoaded(): void {
  echo('success', `[${EXTENSION_ID}] Extension loaded.`);
}

// Prefer the built-in helper to add a toolbar button if available.
if (
  typeof window !== 'undefined' &&
  (window as any).SillyTavern &&
  typeof (window as any).SillyTavern.registerExtension === 'function'
) {
  (window as any).SillyTavern.registerExtension({
    id: EXTENSION_ID,
    name: 'Deep Plotter',
    // Font Awesome icon already shipped with SillyTavern; no separate assets required.
    icon: 'fa-brands fa-wpexplorer',
    onClick: () => {
      echo('info', '[Deep-Plotter] Popup coming soon!');
    },
  });
} else {
  // Fallback: just log so we know the script executed even if ST helper is missing.
  console.log('[Deep-Plotter] SillyTavern.registerExtension not found.');
  // Fallback toolbar injection when the SillyTavern helper is unavailable.
  const TARGET_SELECTORS =
    '.form_create_bottom_buttons_block, #GroupFavDelOkBack, #form_character_search_form';

  /**
   * Builds the icon element that mimics a standard SillyTavern toolbar button.
   */
  function buildIcon(): HTMLDivElement {
    const icon = document.createElement('div');
    icon.className = 'menu_button fa-brands fa-wpexplorer interactable deepPlotter-icon';
    icon.title = 'Deep Plotter';
    icon.addEventListener('click', () => {
      echo('info', '[Deep-Plotter] Popup coming soon!');
    });
    return icon;
  }

  /**
   * Injects the Deep Plotter icon into all matching toolbar containers.
   */
  function injectIcon(): void {
    if (document.querySelector('.deepPlotter-icon')) return; // avoid duplicates
    document.querySelectorAll(TARGET_SELECTORS).forEach((parent) => {
      parent.prepend(buildIcon().cloneNode(true) as HTMLElement);
    });
    // basic styling to ensure visibility (only once)
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
    echo('success', '[Deep-Plotter] Button added (fallback).');
  }

  /**
   * Observe dynamic mutations so the button persists when ST rebuilds its toolbars.
   */
  function observeContainers(): void {
    document.querySelectorAll(TARGET_SELECTORS).forEach((parent) => {
      const obs = new MutationObserver(() => injectIcon());
      obs.observe(parent, { childList: true });
    });
  }

  /**
   * Waits until the toolbar containers exist and then performs injection.
   */
  function waitForContainers(): void {
    if (document.querySelectorAll(TARGET_SELECTORS).length) {
      injectIcon();
      observeContainers();
    } else {
      setTimeout(waitForContainers, 500);
    }
  }

  // Ensure the DOM is ready before looking for toolbars.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForContainers);
  } else {
    waitForContainers();
  }
}

export default { onExtensionLoaded }; 