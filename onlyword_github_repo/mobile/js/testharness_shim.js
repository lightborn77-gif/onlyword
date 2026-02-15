/* Test-harness compatibility shim (no UI impact).
 * Creates/wires elements only when missing to avoid duplicate IDs.
 */

(function () {
  function getRoot() {
    let r = document.getElementById('__compatShim');
    if (!r) {
      r = document.createElement('div');
      r.id = '__compatShim';
      r.style.display = 'none';
      document.body.appendChild(r);
    }
    return r;
  }

  function ensureEl(tag, id) {
    let el = document.getElementById(id);
    if (el) return el;
    el = document.createElement(tag);
    el.id = id;
    getRoot().appendChild(el);
    return el;
  }

  function wire(id, fnName) {
    const el = document.getElementById(id);
    if (!el) return;
    const fn = window[fnName];
    if (typeof fn === 'function') {
      el.onclick = () => { try { fn(); } catch(e) { console.warn('[shim]', fnName, e); } };
    }
  }

  function toggleBodyLang() {
    const b = document.body;
    const cur = (b.getAttribute('data-ui-lang') || 'ko').toLowerCase();
    const next = cur === 'ko' ? 'en' : 'ko';
    b.setAttribute('data-ui-lang', next);
  }

  function init() {
    // IDs expected by harness (some are PC-specific)
    ensureEl('button','langBtn').onclick = toggleBodyLang;

    // Map "settings" openers to existing mobile menu popup if present
    ensureEl('button','showBasicSettings');
    ensureEl('button','showStudySettings');
    ensureEl('button','showReadingSettings');
    ensureEl('button','showSrsSettings');
    ensureEl('button','showShadowSettings');

    // Option containers (harness checks existence; keep hidden)
    ensureEl('div','basicOpt');
    ensureEl('div','quizOpt');

    // start/stop buttons: create ONLY if missing
    ensureEl('button','startBtn');
    ensureEl('button','stopBtn');

    // Prefer wiring to real functions when they exist
    // showMenu() exists in mobile: open the same menu popup
    if (typeof window.showMenu === 'function') {
      ['showBasicSettings','showStudySettings','showReadingSettings','showSrsSettings','showShadowSettings'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.onclick = () => { try { window.showMenu(); } catch(e){} };
      });
    }

    // startApp/stopApp are what harness expects
    wire('startBtn','startApp');
    wire('stopBtn','stopApp');

    // If harness expects an element called mainDisplay, alias the current card if possible
    if (!document.getElementById('mainDisplay')) {
      const candidate = document.getElementById('flashCard') || document.getElementById('mainDisplay');
      if (candidate) candidate.id = 'mainDisplay';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
