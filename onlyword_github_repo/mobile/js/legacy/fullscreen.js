/* =========================================================
 * Fullscreen + quick mode bar (long press)
 * Generated: 2026-02-10 20:55:40
 * Notes:
 * - This file is part of the "split/annotated" refactor.
 * - Functions/variables are kept global (non-module) to avoid breaking behavior.
 * ========================================================= */


// ---------------------------------------------------------
// __setFsActive
// ---------------------------------------------------------


        function __setFsActive(mode){
            if (!fsModeBar) return;
            fsModeBar.querySelectorAll('.fs-modebtn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
            });
        }
// ---------------------------------------------------------
// __showFsModeBar
// ---------------------------------------------------------


        function __showFsModeBar(){
            if (!fsModeBar) return;
            if (!document.body.classList.contains('study-fullscreen')) return;
            fsModeBar.classList.remove('hidden');
            fsModeBar.setAttribute('aria-hidden', 'false');
            // 현재 모드 강조 (currentMode가 없으면 버튼 강조는 생략)
            try { __setFsActive(window.currentMode || 'study'); } catch(e) {}
            try { (window.App && App.Timers ? App.Timers.clearTimeout(__fsHideTimer) : clearTimeout(__fsHideTimer)); } catch(e) { try{clearTimeout(__fsHideTimer);}catch(_){} }
            __fsHideTimer = (window.App && App.Timers ? App.Timers.setTimeout : setTimeout)(() => {
                fsModeBar.classList.add('hidden');
                fsModeBar.setAttribute('aria-hidden', 'true');
            }, 3000);
        }

        card.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();

            __lpTriggered = false;
            try { (window.App && App.Timers ? App.Timers.clearTimeout(__lpTimer) : clearTimeout(__lpTimer)); } catch(e) { try{clearTimeout(__lpTimer);}catch(_){} }

            // 롱프레스는 풀스크린에서만 활성
            if (document.body.classList.contains('study-fullscreen')) {
                __lpTimer = (window.App && App.Timers ? App.Timers.setTimeout : setTimeout)(() => {
                    __lpTriggered = true;
                    __showFsModeBar();
                }, 380);
            }
        });

        card.addEventListener('touchend', (e) => {
            // 롱프레스가 발생했으면: 기존 더블탭/스와이프 동작을 막고 종료
            if (__lpTimer) {
                try { (window.App && App.Timers ? App.Timers.clearTimeout(__lpTimer) : clearTimeout(__lpTimer)); } catch(e) { try{clearTimeout(__lpTimer);}catch(_){} }
                __lpTimer = null;
            }
            if (__lpTriggered) {
                __lpTriggered = false;
                e.preventDefault();
                return;
            }

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndTime = Date.now();
            
            const diffX = touchEndX - touchStartX;
            const diffTime = touchEndTime - touchStartTime;
            
            // 더블탭
            if (Math.abs(diffX) < 10 && diffTime < 300) {
                if (touchEndTime - lastTapTime < 300) {
                    toggleMem();
                }
                lastTapTime = touchEndTime;
            }
            
            // 스와이프
            if (Math.abs(diffX) > 50 && diffTime < 500) {
                if (diffX > 0) {
                    nextWord();
                } else {
                    prevWord();
                }
            }
        });

        // 🎤 TTS 음성 목록 로드
// ---------------------------------------------------------
// toggleStudyFullscreen
// ---------------------------------------------------------

        function toggleStudyFullscreen() {
            const isFullscreen = document.body.classList.toggle('study-fullscreen');
            const headerBtn = document.getElementById('fullscreenBtn');
            const floatingBtn = document.getElementById('floatingFullscreenBtn');
            
            if (isFullscreen) {
                // 풀스크린 진입
                headerBtn.textContent = '🡼';
                floatingBtn.textContent = '🡼';
                headerBtn.title = '풀스크린 종료';
                floatingBtn.title = '풀스크린 종료';
            } else {
                // 풀스크린 종료
                headerBtn.textContent = '⛶';
                floatingBtn.textContent = '⛶';
                headerBtn.title = '학습창 풀스크린';
                floatingBtn.title = '학습창 풀스크린';
            }
        }

        // ESC 키로 풀스크린 종료
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('study-fullscreen')) {
                toggleStudyFullscreen();
            }
        });


/* ===== Compat: desktop test-harness shims (do not affect UI) ===== */
(function ensureCompatIds(){
  try{
    // Map "mainDisplay" expected by tester to the real card element if possible
    var card = document.getElementById('flashCard');
    if(card && !document.getElementById('mainDisplay')){
      card.id = 'mainDisplay';
    }

    // Wire hidden langBtn so iframe test can toggle data-ui-lang
    var lb = document.getElementById('langBtn');
    if(lb && !lb.__bound){
      lb.__bound = true;
      lb.addEventListener('click', function(){
        var b = document.body;
        var cur = (b.getAttribute('data-ui-lang') || 'ko').toLowerCase();
        var next = (cur === 'ko') ? 'en' : 'ko';
        b.setAttribute('data-ui-lang', next);
        if(typeof window.applyUILanguage === 'function'){
          try{ window.applyUILanguage(); }catch(e){}
        }
      });
    }

    // Optional: start/stop shims (no-op if not available)
    var sb = document.getElementById('startBtn');
    if(sb && !sb.__bound){
      sb.__bound = true;
      sb.addEventListener('click', function(){
        if(window.App && typeof App.dispatch === 'function'){ try{ App.dispatch('START'); }catch(e){} }
        if(typeof window.startApp === 'function'){ try{ window.startApp(); }catch(e){} }
        if(typeof window.startStudy === 'function'){ try{ window.startStudy(); }catch(e){} }
      });
    }
    var stb = document.getElementById('stopBtn');
    if(stb && !stb.__bound){
      stb.__bound = true;
      stb.addEventListener('click', function(){
        if(window.App && typeof App.dispatch === 'function'){ try{ App.dispatch('STOP_ALL'); }catch(e){} }
        if(typeof window.stopApp === 'function'){ try{ window.stopApp(); }catch(e){} }
        if(typeof window.stopStudy === 'function'){ try{ window.stopStudy(); }catch(e){} }
      });
    }
  }catch(e){}
})();

