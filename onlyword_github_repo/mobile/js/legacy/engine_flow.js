/* =========================================================
 * Main engine flow (start/stop/next/prev/modes)
 * Generated: 2026-02-10 20:55:40
 * Notes:
 * - This file is part of the "split/annotated" refactor.
 * - Functions/variables are kept global (non-module) to avoid breaking behavior.
 * ========================================================= */


// ---------------------------------------------------------
// selectMode
// ---------------------------------------------------------

        function selectMode(mode, ev, btnEl) {
            currentMode = mode;
            // stopApp() touches many DOM ids; keep mode switching resilient.
            try { stopApp(); } catch (e) { console.warn('[selectMode] stopApp error ignored:', e); }
            
            // Update mode button highlight robustly (do not rely on event object).
            document.querySelectorAll('.mode-btn').forEach(btn => {
                btn.classList.toggle('active', (btn.getAttribute('data-mode') === mode));
            });
            // Fullscreen quick modebar buttons (optional highlight)
            document.querySelectorAll('.fs-modebtn').forEach(btn => {
                btn.classList.toggle('active', (btn.getAttribute('data-mode') === mode));
            });
            
            document.getElementById('studyControls').style.display = 'none';
            document.getElementById('quizControls').style.display = 'none';
            document.getElementById('srsControls').style.display = 'none';
            document.getElementById('dialogControls').style.display = 'none';
            
            if (mode === 'study') {
                document.getElementById('studyControls').style.display = 'flex';
            } else if (mode === 'quiz') {
                document.getElementById('quizControls').style.display = 'flex';
            } else if (mode === 'srs') {
                document.getElementById('srsControls').style.display = 'flex';
            } else if (mode === 'dialog') {
                document.getElementById('dialogControls').style.display = 'flex';
            }

            // 🔁 쉐도잉 반복 플로팅 버튼 상태/표시 업데이트
            try { refreshShadowLoopFloatingVisibility(); } catch (e) { /* ignore */ }
            try { syncShadowLoopFloatingBtn(); } catch (e) { /* ignore */ }
            
            try { updateDisplay(); } catch (e) { console.warn('[selectMode] updateDisplay error ignored:', e); }
        }

        // ---------------------------------------------------------
        // Shadowing loop floating button helpers (mobile UX)
        // ---------------------------------------------------------
        function syncShadowLoopFloatingBtn() {
            const btn = document.getElementById('shadowLoopFloatingBtn');
            const cb = document.getElementById('shadowLoop');
            if (!btn || !cb) return;
            const on = !!cb.checked;
            btn.classList.toggle('on', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        }

        function refreshShadowLoopFloatingVisibility() {
            const btn = document.getElementById('shadowLoopFloatingBtn');
            if (!btn) return;
            const sh = document.getElementById('shadowingMode');
            const enabled = (currentMode === 'dialog') && !!(sh && sh.checked) && !!isRunning;
            btn.style.display = enabled ? 'flex' : 'none';
        }

        function toggleShadowLoopFloating() {
            const cb = document.getElementById('shadowLoop');
            if (!cb) return;
            cb.checked = !cb.checked;
            syncShadowLoopFloatingBtn();
        }

        // 팝업 제어
// ---------------------------------------------------------
// restartFromBeginning
// ---------------------------------------------------------

        function restartFromBeginning() {
            if (vocabulary.length === 0) {
                alert(UI_TEXT[currentUILang].loadFileFirst);
                return;
            }
            currentIndex = 0;
            stopApp();
            updateDisplay();
            App.Timers.setTimeout(() => togglePlayPause(), 100);
        }

        // 퀴즈 시작 (컨트롤에서)
// ---------------------------------------------------------
// startQuizFromControl
// ---------------------------------------------------------

        function startQuizFromControl() {
            if (vocabulary.length === 0) {
                alert(UI_TEXT[currentUILang].loadFileFirst);
                return;
            }
            currentIndex = 0;
            stopApp();
            startQuiz();
        }

        // 계속 재생
// ---------------------------------------------------------
// continueApp
// ---------------------------------------------------------

        function continueApp() {
            const p = currentMode === 'srs' ? getSRSItems() : getFiltered();
            if (p.length === 0) {
                alert(currentMode === 'srs' ? UI_TEXT[currentUILang].noSRSToday : UI_TEXT[currentUILang].noWordsMatch);
                return;
            }

            isRunning = true;
            currentPool = p;
            document.getElementById('playPauseBtn').textContent = '⏸';

            const speed = settings.speed * 1000;
// ---------------------------------------------------------
// playNext
// ---------------------------------------------------------

            
            function playNext() {
                if (!isRunning) return;
                
                updateDisplay();
                
                if (settings.autoSpeak) {
                    const word = currentPool[currentIndex].eng;
                    speakWordWithCallback(word, () => {
                        App.Timers.setTimeout(() => {
                            if (!isRunning) return;
                            
                            if (currentMode === 'srs') {
                                const it = currentPool[currentIndex];
                                if (it.m) updateSRS(it, true);
                            }
                            
                            currentIndex = (currentIndex + 1) % currentPool.length;
                            logStudy(1);
                            playNext();
                        }, 500);
                    });
                } else {
                    App.Timers.setTimeout(() => {
                        if (!isRunning) return;
                        
                        if (currentMode === 'srs') {
                            const it = currentPool[currentIndex];
                            if (it.m) updateSRS(it, true);
                        }
                        
                        currentIndex = (currentIndex + 1) % currentPool.length;
                        logStudy(1);
                        playNext();
                    }, speed);
                }
            }
            
            playNext();
        }

        // 시작
// ---------------------------------------------------------
// startApp
// ---------------------------------------------------------

        function startApp() {
            // 🗣️ 회화 모드 - 최우선 체크
            if (currentMode === 'dialog') {
                if (dialogScript.length === 0) {
                    alert('대화 파일을 먼저 로드해 주세요');
                    return;
                }
                isRunning = true;
                if (currentIndex >= dialogScript.length) currentIndex = 0;
                document.getElementById('playPauseBtn').textContent = '⏸';
                // 🔁 쉐도잉 반복 플로팅 버튼 표시/상태 업데이트
                try { refreshShadowLoopFloatingVisibility(); } catch (e) { /* ignore */ }
                try { syncShadowLoopFloatingBtn(); } catch (e) { /* ignore */ }
                runDialog();
                return;
            }
            
            // 기존 단어장 모드 - vocabulary 필요
            if (vocabulary.length === 0) {
                alert(UI_TEXT[currentUILang].loadWordFileFirst);
                return;
            }

            if (currentMode === 'quiz') {
                startQuiz();
                return;
            }

            const p = currentMode === 'srs' ? getSRSItems() : getFiltered();
            if (p.length === 0) {
                alert(currentMode === 'srs' ? UI_TEXT[currentUILang].noSRSToday : UI_TEXT[currentUILang].noWordsMatch);
                return;
            }

            isRunning = true;
            currentPool = p;
            currentIndex = 0;
            updateDisplay();

            document.getElementById('playPauseBtn').textContent = '⏸';

            const speed = settings.speed * 1000;
// ---------------------------------------------------------
// playNext
// ---------------------------------------------------------

            
            function playNext() {
                if (!isRunning) return;
                
                updateDisplay();
                
                if (settings.autoSpeak) {
                    const word = currentPool[currentIndex].eng;
                    speakWordWithCallback(word, () => {
                        App.Timers.setTimeout(() => {
                            if (!isRunning) return;
                            
                            if (currentMode === 'srs') {
                                const it = currentPool[currentIndex];
                                if (it.m) updateSRS(it, true);
                            }
                            
                            currentIndex = (currentIndex + 1) % currentPool.length;
                            logStudy(1);
                            playNext();
                        }, 500);
                    });
                } else {
                    App.Timers.setTimeout(() => {
                        if (!isRunning) return;
                        
                        if (currentMode === 'srs') {
                            const it = currentPool[currentIndex];
                            if (it.m) updateSRS(it, true);
                        }
                        
                        currentIndex = (currentIndex + 1) % currentPool.length;
                        logStudy(1);
                        playNext();
                    }, speed);
                }
            }
            
            playNext();
        }

        // 정지
// ---------------------------------------------------------
// stopApp
// ---------------------------------------------------------

        function stopApp() {
            isRunning = false;
            speechSynthesis.cancel(); // 음성 중지
            window.readingStep = undefined; // 🔍 독해모드 상태 초기화
            
            // 수동 답보기 버튼 숨기기
            const manualBtn = document.getElementById('manualAnswerBtn');
            if (manualBtn) manualBtn.style.display = 'none';
            
            // 🎧 쉐도잉 정리
            shadowStopFlag = true;
            if (shadowTimer) {
                App.Timers.clearTimeout(shadowTimer);
                shadowTimer = null;
            }
            const btn = document.getElementById('shadowFinishBtn');
            if (btn) btn.style.display = 'none';
            
            const pp = document.getElementById('playPauseBtn');
            if (pp) pp.textContent = '▶';

            // 🔁 쉐도잉 반복 플로팅 버튼 숨김
            try { refreshShadowLoopFloatingVisibility(); } catch (e) { /* ignore */ }
            const qopt = document.getElementById('quizOpt');
            if (qopt) qopt.style.display = 'none';
            try { updateDisplay(); } catch (e) { console.warn('[stopApp] updateDisplay error ignored:', e); }
        }

        // 퀴즈 시작
// ---------------------------------------------------------
// prevWord
// ---------------------------------------------------------

        function prevWord() {
            // 🗣️ 회화 모드
            if (currentMode === 'dialog') {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateDisplay();
                }
                return;
            }
            
            // 기존 단어장 모드
            const p = isRunning ? currentPool : (currentMode === 'srs' ? getSRSItems() : getFiltered());
            if (p.length === 0) return;
            currentIndex = (currentIndex - 1 + p.length) % p.length;
            updateDisplay();
        }
// ---------------------------------------------------------
// nextWord
// ---------------------------------------------------------


        function nextWord() {
            // 🗣️ 회화 모드
            if (currentMode === 'dialog') {
                if (isRunning) {
                    nextDialogLine();
                } else {
                    if (currentIndex < dialogScript.length - 1) {
                        currentIndex++;
                        updateDisplay();
                    }
                }
                return;
            }
            
            // 기존 단어장 모드
            const p = isRunning ? currentPool : (currentMode === 'srs' ? getSRSItems() : getFiltered());
            if (p.length === 0) return;
            
            if (currentMode === 'srs' && isRunning) {
                const it = p[currentIndex];
                if (it.m) updateSRS(it, true);
            }
            
            currentIndex = (currentIndex + 1) % p.length;
            if (isRunning) logStudy(1);
            updateDisplay();
        }

        // 외움/별표
// ---------------------------------------------------------
// toggleMem
// ---------------------------------------------------------

        function toggleMem() {
            const p = isRunning ? currentPool : (currentMode === 'srs' ? getSRSItems() : getFiltered());
            const it = p[currentIndex];
            if (it) {
                it.m = !it.m;
                if (currentMode === 'srs') updateSRS(it, it.m);
                saveLocal();
                updateDisplay();
            }
        }
// ---------------------------------------------------------
// toggleStar
// ---------------------------------------------------------


        function toggleStar() {
            const p = isRunning ? currentPool : (currentMode === 'srs' ? getSRSItems() : getFiltered());
            const it = p[currentIndex];
            if (it) {
                it.star = !it.star;
                saveLocal();
                updateDisplay();
            }
        }

        // 저장/불러오기