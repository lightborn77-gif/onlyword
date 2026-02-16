// post_export.js - app.js 로드 이후, 기존 전역 함수/상태를 App 모듈로 연결(호환 브릿지)
(() => {
  const W = window;
  const App = W.App = W.App || {};

  // ---- UI 바인딩 ----
  App.UI = App.UI || {};
  if (typeof W.updateDisplay === "function") App.UI.updateDisplay = W.updateDisplay;
  if (typeof W.clearCache === "function") App.UI.clearCache = W.clearCache;
  if (typeof W.renderReport === "function") App.UI.renderReport = W.renderReport;

  // ---- Quiz UI (B안2차): showQuiz / quiz 흐름을 Quiz 모듈로 노출 ----
  App.Quiz = App.Quiz || {};
  ["showQuiz","gradeQuiz","renderQuiz","resetQuiz","renderReport"].forEach(fn => {
    if (typeof W[fn] === "function") App.Quiz[fn] = W[fn];
  });

  // ---- Engine 상태 참고: 기존 전역 isRunning/currentMode가 있으면 연결 ----
  App.state = App.state || {};
  if ("isRunning" in W) App.state.isRunningRef = () => W.isRunning;
  if ("currentMode" in W) App.state.modeRef = () => W.currentMode;

  // ---- 키 입력 통일(가능하면) ----
  // 기존 keydown 핸들러가 있으면 건드리지 않음. 없으면 기본 핫키만 제공.
  const hasKey = !!(W.__APP_KEY_BINDING__);
  if (!hasKey) {
    W.__APP_KEY_BINDING__ = true;
    document.addEventListener("keydown", (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (e.code === "Space") { e.preventDefault(); App.dispatch("TOGGLE_RUN"); }
      if (e.code === "Escape") { App.dispatch("STOP_ALL"); }
    }, {capture:true});
  }


  // ---- 언어 토글 버튼 바인딩(안전 보강) ----
  function __bindLangButtons(){
    const bind = (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.__langBound) return;
      el.__langBound = true;
      el.addEventListener("click", (e) => {
        try { e.preventDefault(); } catch {}
        // 1) legacy global
        if (typeof W.toggleLanguage === "function") return W.toggleLanguage();
        // 2) i18n module
        if (W.I18N && typeof W.I18N.toggle === "function") return W.I18N.toggle();
        if (App.I18N && typeof App.I18N.toggle === "function") return App.I18N.toggle();
        // 3) fallback: toggle body attr
        const cur = document.body.getAttribute("data-ui-lang") || "ko";
        const next = cur === "ko" ? "en" : "ko";
        document.body.setAttribute("data-ui-lang", next);
      }, {capture:true});
    };
    bind("langBtn");
    bind("stageLangBtn");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", __bindLangButtons, {once:true});
  } else {
    __bindLangButtons();
  }

  console.log("[B2+3] post_export bridge ready");
})();


// ---- Patch Lang4: hard-bind UI language toggle + fileInput change (failsafe) ----
(function(){
  function safeSetAttr(next){
    try{ document.body.setAttribute('data-ui-lang', next); }catch(e){}
  }
  window.__forceToggleUILang = function(){
    const body = document.body;
    const curAttr = (body.getAttribute('data-ui-lang') || '').toLowerCase();
    const cur = (curAttr === 'en' || curAttr === 'ko') ? curAttr : (window.I18N?.current || 'ko');
    const next = (cur === 'ko') ? 'en' : 'ko';
    // 1) CSS toggle always
    safeSetAttr(next);

    // 2) Update i18n model & texts if available
    try{
      if (window.I18N){
        if (typeof window.I18N.set === 'function') window.I18N.set(next);
        else if (typeof window.I18N.current === 'string') window.I18N.current = next;
        if (typeof window.I18N.update === 'function') window.I18N.update();
      }
      if (typeof window.applyUILanguage === 'function') window.applyUILanguage();
      if (typeof window.updateUIStrings === 'function') window.updateUIStrings();
    }catch(e){
      // ignore
    }
    return next;
  };

  function bindOnce(){
    const langBtn = document.getElementById('langBtn');
    const stageLangBtn = document.getElementById('stageLangBtn');
    if (langBtn && !langBtn.__langBound){
      langBtn.__langBound = true;
      langBtn.addEventListener('click', (e)=>{ e.preventDefault(); window.__forceToggleUILang(); });
    }
    if (stageLangBtn && !stageLangBtn.__langBound){
      stageLangBtn.__langBound = true;
      stageLangBtn.addEventListener('click', (e)=>{ e.preventDefault(); window.__forceToggleUILang(); });
    }

    const fileInput = document.getElementById('fileInput');
    if (fileInput && !fileInput.__fileBound){
      fileInput.__fileBound = true;
      fileInput.addEventListener('change', (e)=>{
        try{
          if (window.FileLoader?.loadFile) window.FileLoader.loadFile(e);
        }catch(err){}
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindOnce);
  } else {
    bindOnce();
  }
  // also retry a bit later in case DOM is injected after
  setTimeout(bindOnce, 250);
  setTimeout(bindOnce, 800);
})();


// ---- Patch Font: fullscreen stage A+/A- failsafe ----
(function(){
  window.__forceStageFont = function(delta){
    try{
      const main = document.getElementById('mainDisplay');
      const sub  = document.getElementById('subDisplay');
      let cur = 38;
      if (main){
        const fs = getComputedStyle(main).fontSize || '38px';
        const n = parseFloat(fs);
        cur = isNaN(n) ? 38 : n;
      }
      let v = Math.max(10, Math.min(200, cur + (Number(delta)||0)));
      if (main) main.style.fontSize = v + 'px';
      if (sub)  sub.style.fontSize  = (v * 0.7) + 'px';

      const inp = document.getElementById('fontSize');
      if (inp) inp.value = Math.round(v);

      if (typeof window.updateDisplay === 'function'){
        try{ window.updateDisplay(); }catch(e){}
      }
      return v;
    }catch(e){}
  };
})();
