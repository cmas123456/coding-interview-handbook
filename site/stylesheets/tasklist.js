// Make pymdownx.tasklist checkboxes clickable and persist state to localStorage.
// Keyed by page URL + index, so checkboxes survive across page reloads and rebuilds.

(function () {
  function init() {
    const boxes = document.querySelectorAll('.task-list-item input[type="checkbox"]');
    if (!boxes.length) return;

    const pageKey = 'cih:tasks:' + location.pathname;
    let state = {};
    try {
      state = JSON.parse(localStorage.getItem(pageKey) || '{}');
    } catch (_) {
      state = {};
    }

    boxes.forEach((box, i) => {
      box.disabled = false;
      box.removeAttribute('disabled');
      if (state[i]) box.checked = true;

      box.addEventListener('change', () => {
        state[i] = box.checked;
        localStorage.setItem(pageKey, JSON.stringify(state));
      });
    });
  }

  // Run on initial load and on every MkDocs Material instant-navigation switch.
  if (window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
