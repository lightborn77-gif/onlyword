/* =========================================================
 * Main engine flow (start/stop/next/prev/modes)
 * Generated: 2026-02-10 20:55:40
 * Notes:
 * - This file is part of the "split/annotated" refactor.
 * - Functions/variables are kept global (non-module) to avoid breaking behavior.
 * ========================================================= */


// 쉐도잉 관련 전역 변수 (모바일 슬림 버전 호환)
let shadowTimer = null;
let shadowStopFlag = false;
let shadowFinishFlag = false;


// ---------------------------------------------------------
// selectMode
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
            // 회화 모드 제거: dialog 모드 처리 삭제
            // if (currentMode === 'dialog') { ... }
            
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
            try { if (window.App && App.dispatch) App.dispatch('STOP_ALL'); } catch(e) {}
            try { if (window.App && App.TTS && App.TTS.cancel) App.TTS.cancel(); else speechSynthesis.cancel(); } catch(e) {} // 음성 중지
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