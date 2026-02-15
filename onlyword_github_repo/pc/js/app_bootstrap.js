// 학습 언어 변경
        function changeStudyLanguage() {
            currentStudyLang = document.getElementById('studyLangSelect').value;
            Storage.set('studyLang', currentStudyLang);
            updateVoiceList();
            clearCache();
            updateDisplay();
        }
        
        
// --- 기존 함수명 호환 래퍼(기존 코드 수정 최소화) ---
// --- TTS wrapper (robust): **DO NOT reference bare `TTS` identifier**
// Some browsers do not create a global binding for `window.TTS`. Use `window.TTS` only.
function getTTSLang() {
  const t = window.TTS;
  return (t && typeof t.getLang === 'function') ? t.getLang() : 'en-US';
}
function shouldSkipTTS(text) {
  const t = window.TTS;
  return (t && typeof t.shouldSkip === 'function') ? t.shouldSkip(text) : false;
}
function updateVoiceList() {
  const t = window.TTS;
  return (t && typeof t.updateVoiceList === 'function') ? t.updateVoiceList() : undefined;
}

        
        


/* ========== 🧩 Events (단축키/버튼/입력 이벤트 묶음) ========== */
// Ensure Events is also reachable via `window.Events` (legacy callers sometimes expect it).
const Events = {
    init() {
        this.bindKeyboardShortcuts();
        this.bindUIEvents();
    },
    bindKeyboardShortcuts() {
        if (this._keyboardBound) return;
        this._keyboardBound = true;

        document.addEventListener('keydown', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) return;

            if (e.code === 'Space') {
                e.preventDefault();
                App.dispatch('TOGGLE_RUN');
                return;
            }
            if (e.code === 'ArrowLeft') { App.dispatch('PREV'); return; }
            if (e.code === 'ArrowRight') { App.dispatch('NEXT'); return; }
            if (e.code === 'Enter') {
                if ((getCurrentMode() === 'dialogMode') && isRunning) {
                    nextDialogLine();
                } else {
                    App.dispatch('TOGGLE_MEM');
                }
            }
        });
    },
    bindUIEvents() {
        if (this._uiBound) return;
        this._uiBound = true;

        const vs = document.getElementById('voiceSelect');
        if (vs) vs.addEventListener('change', saveLocal);

        const lb = document.getElementById('langBtn');
        if (lb) lb.addEventListener('click', (e) => { e.preventDefault(); toggleLanguage(); });

        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.addEventListener('change', FileLoader.loadFile);

        const easeMode = document.getElementById('easeMode');
        if (easeMode) easeMode.addEventListener('change', clearCache);

        const customEase = document.getElementById('customEase');
        if (customEase) customEase.addEventListener('input', clearCache);

        const wrongDays = document.getElementById('wrongDays');
        if (wrongDays) wrongDays.addEventListener('input', function() {
            let val = parseInt(this.value);
            if (val < 1) this.value = 1;
            if (val > 30) this.value = 30;
            clearCache();
        });

        // 🗣️ 역할극 설정 변경 시 로직 추가
        const roleA = document.getElementById('dialogRoleA');
        if (roleA) roleA.addEventListener('change', function() {
            const role = this.value;
            document.getElementById('dialogRoleB').value = role === 'A' ? 'B' : 'A';
            clearCache();
            updateDisplay();
        });

        const roleB = document.getElementById('dialogRoleB');
        if (roleB) roleB.addEventListener('change', function() {
            const role = this.value;
            document.getElementById('dialogRoleA').value = role === 'A' ? 'B' : 'A';
            clearCache();
            updateDisplay();
        });
    }
};

// Expose Events on window for legacy/inline callers
try { window.Events = window.Events || Events; } catch(e) {}

// Provide legacy `App.init()` expected by app_impl.js
// - app_impl.js calls `App.init()` to bind UI/keyboard events
// - In SLIM setup, Events.init() is the right equivalent
try {
  const App = window.App = window.App || {};
  if (typeof App.init !== 'function') {
    App.init = function(){
      try {
        if (typeof Events !== 'undefined' && Events && typeof Events.init === 'function') {
          Events.init();
        }
      } catch(e) { console.error(e); }
    };
  }
} catch(e) {}

/* ========== 🧠 App (전역/상태/디스패치 엔진은 engine.js가 담당) ========== */
const App = window.App = window.App || {};
// app.js에서는 App 객체를 덮어쓰지 않고, engine.js의 App.dispatch/Timers를 그대로 사용합니다.
App.TTS = App.TTS || { cancel(){ try { window.TTS?.cancel?.(); } catch(e) {} } };


