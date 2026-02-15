
// --- TTS guard helper ---
function __getTTS(){ return (window.TTS ? TTS : null); }
/* ========== 🛠️ 유틸리티 함수 ========== */
        function clearCache() {
            cache = {};
            currentSettingsHash = '';
            document.getElementById('customEaseInput').style.display = 
                document.getElementById('easeMode').value === 'custom' ? (getCurrentMode() === 'srsMode') ? 'inline' : 'none' : 'none';
        }

        function getSettingsHash() {
            const settings = {
                start: document.getElementById('startIdx').value,
                end: document.getElementById('endIdx').value,
                unmem: document.getElementById('unmemOnly').checked,
                wrong: document.getElementById('wrongOnly').checked,
                safe: document.getElementById('starOnly').checked,
                mode: getCurrentMode(),
                dir: document.querySelector('input[name="quizDirection"]:checked')?.id,
                count: document.getElementById('quizCount')?.value,
                revive: document.getElementById('wrongRevive')?.checked,
                wrongDays: document.getElementById('wrongDays')?.value,
                shuffle: document.getElementById('shuffle')?.checked,
                srsNew: document.getElementById('srsNewOnly')?.checked,
                srsHard: document.getElementById('srsHardOnly')?.checked,
                ease: document.getElementById('easeMode')?.value,
                customEase: document.getElementById('customEase')?.value,
            };
            return JSON.stringify(settings);
        }

        
        /* ========== 🎨 UI 관련 함수 ========== */
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            Storage.set('darkMode', isDark ? 'enabled' : 'disabled');
            document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
            saveLocal();
        }

        
        /* ========== 💾 데이터 저장/불러오기 ========== */
        function saveLocal() {
            try {
                if (currentFileName) {
                    Storage.set('mem_' + currentFileName, JSON.stringify(vocabulary.map(v => ({ 
                            n: v.num, m: v.m, w: v.w, lastSeen: v.lastSeen, interval: v.interval, wrongDates: v.wrongDates,
                            quizCount: v.quizCount, correctStreak: v.correctStreak, totalCorrect: v.totalCorrect, isSafe: v.isSafe
                        }))));
}

                const colorToggles = {
                    learning: document.getElementById('toggleColorLearning') ? document.getElementById('toggleColorLearning').checked : false,
                    wrong: document.getElementById('toggleColorWrong') ? document.getElementById('toggleColorWrong').checked : false,
                    safe: document.getElementById('toggleColorSafe') ? document.getElementById('toggleColorSafe').checked : false,
                };
                Storage.setJSON('colorToggles', colorToggles);
                Storage.setJSON('studyLog', studyLog);
                Storage.setJSON('totalQuiz', totalQuizHistory);
                
                // 음성 선택 저장
                const voiceSelect = document.getElementById('voiceSelect');
                if (voiceSelect && voiceSelect.value) {
                    Storage.set('selectedVoice_' + currentStudyLang, voiceSelect.value);
                }
            } catch(err) {
                console.error('데이터 저장 실패:', err);
            }
        }

        function loadSettings() {
            try {
                // UI 언어 복원
                I18N.init();
// 학습 언어 복원
                const savedStudyLang = Storage.get('studyLang');
                if (savedStudyLang) {
                    currentStudyLang = savedStudyLang;
                    document.getElementById('studyLangSelect').value = savedStudyLang;
                }
                
                const savedToggles = Storage.getJSON('colorToggles', {});
                if (document.getElementById('toggleColorLearning')) {
                    document.getElementById('toggleColorLearning').checked = savedToggles.learning !== undefined ? savedToggles.learning : false;
                }
                if (document.getElementById('toggleColorWrong')) {
                    document.getElementById('toggleColorWrong').checked = savedToggles.wrong !== undefined ? savedToggles.wrong : false;
                }
                if (document.getElementById('toggleColorSafe')) {
                    document.getElementById('toggleColorSafe').checked = savedToggles.safe !== undefined ? savedToggles.safe : false;
                }
                clearCache();
            } catch(err) {
                console.error('설정 로드 실패:', err);
            }
        }
        
        

        
        /* ========== 📁 파일 로드 및 파싱 ========== */
        


        


        


        



        
        
        // ===== 모듈화(1파일) : FileLoader =====
        // 파일 읽기/형식 감지/파싱(단어장·회화) 관련 진입점을 한 곳으로 묶습니다.
        



        /* ========== 🔍 데이터 필터링 ========== */
        
// [getFiltered] moved to separate module (see js/app_pool.js)


        // (B안 1차) Quiz 풀 생성 로직은 js/quiz.js로 분리
        // 기존 호출부는 그대로 두기 위해 wrapper만 유지합니다.
        function getQuizPool() {
            try {
                if (window.App?.Quiz?.getQuizPool) return window.App.Quiz.getQuizPool();
            } catch (e) {}
            // Fallback: global function (quiz.js가 old-style로 제공)
            try {
                if (window.getQuizPool && window.getQuizPool !== getQuizPool) return window.getQuizPool();
            } catch (e) {}
            return [];
        }

        
        /* ========== 🔄 SRS (간격 반복) 시스템 ========== */
        // (B안 1차) SRS 로직은 js/srs.js로 분리 (wrapper 유지)
        function updateSRS(item, correct) {
            try {
                if (window.App?.SRS?.updateSRS) return window.App.SRS.updateSRS(item, correct);
            } catch (e) {}
            try {
                if (window.updateSRS && window.updateSRS !== updateSRS) return window.updateSRS(item, correct);
            } catch (e) {}
        }

        function getSRSItems() {
            try {
                if (window.App?.SRS?.getSRSItems) return window.App.SRS.getSRSItems();
            } catch (e) {}
            try {
                if (window.getSRSItems && window.getSRSItems !== getSRSItems) return window.getSRSItems();
            } catch (e) {}
            return [];
        }

        
        /* ========== 🎯 모드 관리 ========== */
        /* ========== 🎯 모드 관리 ========== */
        function getCurrentMode() {
            // ✅ 단어장 전용: 문장/회화/쉐도잉/독해 모드는 사용하지 않음
                        if (document.getElementById('showQuizSettings') && document.getElementById('showQuizSettings').checked) return 'quizMode';
            if (document.getElementById('showSrsSettings') && document.getElementById('showSrsSettings').checked) return 'srsMode';
            // 기본은 깜박이/학습 모드
            return 'studyMode';
        }
        
        // 🔍 독해/영작 모드 UI 업데이트
        function updateReadingMode() {
            const mode = document.getElementById('readingMode').value;
            const container = document.getElementById('thinkTimeContainer');
            
            if (mode === 'off') {
                container.style.display = 'none';
            } else {
                container.style.display = 'inline';
            }
        }

        
        /* ========== 🎴 카드 표시 (메인 디스플레이) ========== */
        
// [updateDisplay] moved to separate module (see js/ui_render_core.js)


        
        /* ========== ▶️ 자동 진행 ========== */
        /* ========== ▶️ 자동 진행 ========== */
        function startApp() {
            stopApp();
            const mode = getCurrentMode();
            clearCache();

            isRunning = true;
            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;

            // ✅ 단어장 전용: 풀(pool)은 현재 모드(Study/Quiz/SRS)만 사용
            if (mode === 'srsMode') {
                currentPool = getSRSItems();
            } else if (mode === 'quizMode') {
                currentPool = getQuizPool();
            } else {
                currentPool = [...getFiltered()];
            }

            if (currentPool.length === 0) {
                alert(I18N.bundle().no_words_range);
                stopApp();
                return;
            }

            if (currentIndex >= currentPool.length) currentIndex = 0;
            currentStep = 0;

            if (mode === 'quizMode') {
                if (document.getElementById('shuffle') && document.getElementById('shuffle').checked) currentPool.sort(() => 0.5 - Math.random());
                quizHistory = [];
                showQuiz();
            } else {
                runStudy();
            }
        }
        
        // 🔍 독해/영작 모드 실행 함수
        function runReading() {
            if (!isRunning || currentIndex >= currentPool.length) return stopApp();
            
            updateDisplay();
            
            const readingMode = document.getElementById('readingMode').value;
            const thinkTime = parseFloat(document.getElementById('thinkTime').value) * 1000; // 생각시간
            const answerTime = parseFloat(document.getElementById('answerTime').value) * 1000; // 답 표시시간 (설정값 사용)
            
            if (window.readingStep === 0) {
                // Step 0: 문제 표시 (생각시간)
                runBar(thinkTime);
                const msg = readingMode === 'eng-kor' ? '영어를 보고 한글로 생각해보세요' : '한글을 보고 영어로 생각해보세요';
                document.getElementById('stMsg').innerText = msg;
                
                timer = setTimeout(() => {
                    window.readingStep = 1;
                    runReading();
                }, thinkTime);
            } else {
                // Step 1: 답 표시 (설정된 시간)
                runBar(answerTime);
                document.getElementById('stMsg').innerText = '답을 확인하세요';
                
                timer = setTimeout(() => {
                    window.readingStep = 0;
                    currentIndex++;
                    logStudy(1);
                    runReading();
                }, answerTime);
            }
        }
        
        // 👁️ 수동 답보기 함수
        function showManualAnswer() {
            if (!isRunning || window.readingStep === undefined) return;
            
            // 문제 표시 상태(step=0)일 때만 답을 보여줌
            if (window.readingStep === 0) {
                // 타이머 취소
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                // 답 표시로 전환
                window.readingStep = 1;
                updateDisplay();
                
                // 답 표시 상태로 타이머 재시작
                const answerTime = parseFloat(document.getElementById('answerTime').value) * 1000;
                runBar(answerTime);
                document.getElementById('stMsg').innerText = '답을 확인하세요';
                
                timer = setTimeout(() => {
                    window.readingStep = 0;
                    currentIndex++;
                    logStudy(1);
                    runReading();
                }, answerTime);
            }
        }
        
        function runDialog() {
            if (document.getElementById('shadowingMode') && document.getElementById('shadowingMode').checked) {
                runShadowingStable();
                return;
            }
            if (!isRunning || currentIndex >= dialogScript.length) return stopApp();
            
            const item = dialogScript[currentIndex];
            
            // 🎨 동시 표시 모드를 위한 현재 읽는 역할 설정
            const showBoth = document.getElementById('dialogShowBoth').checked;
            if (showBoth) {
                window.currentReadingRole = item.role;
            }
            
            updateDisplay();

            const roleA = document.getElementById('dialogRoleA').value;
            const isCompTurn = item.role === roleA;
            
            const compSpeed = parseFloat(document.getElementById('dialogCompSpeed').value) || 0;
            const userSpeed = parseFloat(document.getElementById('dialogUserSpeed').value) || 0;
            
            const waitTime = isCompTurn ? compSpeed : userSpeed;

            if (waitTime > 0) {
                if (isCompTurn && document.getElementById('autoSpeak').checked) {
                    speak(item.text);
                }
                
                // 🎨 타이머 카운트다운 표시
                let remainingTime = waitTime;
                document.getElementById('timerMsg').innerText = `⏱ ${remainingTime.toFixed(1)}초`;
                
                const timerInterval = setInterval(() => {
                    remainingTime -= 0.1;
                    if (remainingTime > 0) {
                        document.getElementById('timerMsg').innerText = `⏱ ${remainingTime.toFixed(1)}초`;
                    } else {
                        document.getElementById('timerMsg').innerText = '';
                        clearInterval(timerInterval);
                    }
                }, 100);
                
                runBar(waitTime * 1000);
                const msg = isCompTurn ? `컴퓨터 차례` : `사용자 차례 (Enter로 바로 넘김)`;
                document.getElementById('stMsg').innerText = msg;
                
                timer = setTimeout(() => {
                    clearInterval(timerInterval);
                    document.getElementById('timerMsg').innerText = '';
                    currentIndex++;
                    logStudy(1);
                    runDialog();
                }, waitTime * 1000);
            } else {
                if (gaugeTimer) clearInterval(gaugeTimer);
                document.getElementById('progressBar').style.width = "0%";
                document.getElementById('timerMsg').innerText = ''; // 타이머 초기화
                const msg = isCompTurn ? `컴퓨터 차례 (Enter/다음)` : `사용자 차례 (Enter/다음)`;
                document.getElementById('stMsg').innerText = msg;
                
                if (isCompTurn && document.getElementById('autoSpeak').checked) {
                    speak(item.text);
                }
            }
        }

        function nextDialogLine() {
            const mode = getCurrentMode();
            if (mode !== 'dialogMode' || !isRunning) return;
            
            // 기존 타이머가 있다면 클리어
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            if (gaugeTimer) {
                clearInterval(gaugeTimer);
                gaugeTimer = null;
            }
            
            document.getElementById('timerMsg').innerText = ''; // 🎨 타이머 표시 초기화
            
            const item = dialogScript[currentIndex];
            const roleA = document.getElementById('dialogRoleA').value;
            const isCompTurn = item.role === roleA;
            
            // 사용자 차례이거나 수동 모드일 때 다음으로 넘어감
            currentIndex++;
            logStudy(1);
            runDialog();
        }


        let recursionDepth = 0;
        const MAX_RECURSION = 1000;

        // 기존 runStudy (깜빡이/SRS) 로직
        function runStudy() {
            if (!isRunning || currentIndex >= currentPool.length) return stopApp();
            recursionDepth = 0;
            updateDisplay();
            const spd = parseFloat(document.getElementById('wordSpeed').value) * 1000;
            recursionDepth++;
            if (recursionDepth >= MAX_RECURSION) {
                recursionDepth = 0;
                setTimeout(() => runStudy(), 0);
                return;
            }
            const item = currentPool[currentIndex];
            
            // 영단어와 한글을 동시에 표시
            document.getElementById('subDisplay').style.visibility = "visible";
            if (document.getElementById('autoSpeak').checked) speak(item.eng);
            runBar(spd); 
            timer = setTimeout(() => { 
                if ((getCurrentMode() === 'srsMode')) {
                    updateSRS(vocabulary.find(v => v.num === item.num), true);
                }
                currentIndex++; 
                logStudy(1); 
                runStudy(); 
            }, spd);
        }

        function stopApp() {
            // (문장 기능 제거 전까지 남아있는 변수/타이머는 안전하게 정리)
            try { shadowStopFlag = true; } catch (e) {}
            try { if (shadowTimer) clearTimeout(shadowTimer); } catch (e) {}
            try { if (typeof setShadowFinishBtnVisible === 'function') setShadowFinishBtnVisible(false); } catch (e) {}
            try { window.speechSynthesis.cancel(); } catch (e) {}
            isRunning = false;
            try { window.speechSynthesis.cancel(); } catch (e) {}
            recursionDepth = 0;

            // 독해/문장 관련 잔여 상태(현재 단계에서는 사용하지 않지만, 존재 시 안전하게 리셋)
            try { window.currentReadingRole = null; } catch (e) {}
            try { window.readingStep = undefined; } catch (e) {}

            // 수동 답보기 버튼(없을 수 있으므로 안전 처리)
            const __manualBtn = document.getElementById('manualAnswerBtn');
            if (__manualBtn) __manualBtn.style.display = 'none';

            if (timer) clearTimeout(timer);
            if (gaugeTimer) clearInterval(gaugeTimer);
            timer = null;
            gaugeTimer = null;

            const __timerMsg = document.getElementById('timerMsg');
            if (__timerMsg) __timerMsg.innerText = '';

            document.getElementById('startBtn').disabled = false;
            document.getElementById('stopBtn').disabled = true;

            const __bar = document.getElementById('progressBar');
            if (__bar) __bar.style.width = '0%';

            updateDisplay();
        }
        function runBar(ms) {
            let s = Date.now(); 
            if (gaugeTimer) clearInterval(gaugeTimer); // 기존 게이지 타이머 정리
            gaugeTimer = setInterval(() => { 
                if (!isRunning) { // isRunning 플래그를 확인하여 정지 시 중단
                    clearInterval(gaugeTimer);
                    return;
                }
                document.getElementById('progressBar').style.width = Math.min(100, (Date.now() - s) / ms * 100) + "%"; 
            }, 30);
        }

        // 기존 showQuiz 로직
        
// [showQuiz] moved to separate module (see js/engine_quiz.js)


        // 기존 toggleMem 로직
        
        /* ========== ⭐ 외움 표시 ========== */
        function toggleMem() { 
            const mode = getCurrentMode();
            const p = isRunning ? currentPool : (mode === 'srsMode' ? getSRSItems() : getFiltered()); 
            if (p.length === 0) return;
            
            const currentItemInPool = p[currentIndex];
            const it = vocabulary.find(v => v.num === currentItemInPool.num);

            if (it) { 
                it.m = !it.m; 
                
                if (it.m && mode === 'studyMode') {
                    it.isSafe = true;
                    it.w = 0;
                    it.correctStreak = 5;
                    it.totalCorrect = 10;
                } else if (!it.m) {
                    it.isSafe = false;
                }
                
                if (mode === 'srsMode') updateSRS(it, it.m);
                
                saveLocal(); 
                updateDisplay(); 
                clearCache(); // 단어의 상태(외움/별표)가 바뀌었으므로 캐시 초기화
            } 
        }

        function exportData() { 
            try {
                const data = vocabulary.map(v => ({ 
                    n: v.num, m: v.m, w: v.w, lastSeen: v.lastSeen, interval: v.interval, wrongDates: v.wrongDates,
                    quizCount: v.quizCount, correctStreak: v.correctStreak, totalCorrect: v.totalCorrect, isSafe: v.isSafe
                }));
                
                const a = document.createElement('a'); 
                a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' })); 
                a.download = `save_${currentFileName || 'vocabulary'}.json`; 
                a.click();
                
                setTimeout(() => URL.revokeObjectURL(a.href), 100);
            } catch(err) {
                alert('데이터 내보내기 실패: ' + err.message);
            }
        }
        
        function importData(input) { 
            if (!input.files[0]) return;
            
            const reader = new FileReader();
            
            reader.onerror = () => {
                alert('파일 읽기 실패!');
            };
            
            reader.onload = e => { 
                try { 
                    const data = JSON.parse(e.target.result);
                    
                    if (!Array.isArray(data)) {
                        alert('잘못된 파일 형식입니다.');
                        return;
                    }
                    
                    let importCount = 0;
                    data.forEach(d => { 
                        const it = vocabulary.find(v => v.num === d.n); 
                        if (it) { 
                            it.m = d.m; 
                            it.w = d.w;
                            if (d.lastSeen) it.lastSeen = d.lastSeen;
                            if (d.interval) it.interval = d.interval;
                            if (d.wrongDates) it.wrongDates = d.wrongDates; 
                            if (d.quizCount) it.quizCount = d.quizCount;
                            if (d.correctStreak) it.correctStreak = d.correctStreak;
                            if (d.totalCorrect) it.totalCorrect = d.totalCorrect;
                            if (d.isSafe !== undefined) it.isSafe = d.isSafe;
                            importCount++;
                        } 
                    });
                    
                    saveLocal();
                    clearCache();
                    updateDisplay();
                    alert(`데이터 로드 완료: ${importCount}개 항목`);
                    
                } catch(err) { 
                    alert("잘못된 파일 형식입니다: " + err.message); 
                } 
            }; 
            
            reader.readAsText(input.files[0]); 
        }
        
        /* (legacy) 이전 영어 전용 음성 로더 - 현재 미사용 */
        function loadVoices() {
            // (legacy) 기존 영어 전용 로더 → 현재는 통합 TTS 로더 사용
            updateVoiceList();
        }

        function updateStats() {
            if (vocabulary.length === 0) return;

            const today = new Date().toISOString().slice(0,10);
            
            const totalWords = vocabulary.length;
            const safeCount = vocabulary.filter(v => v.isSafe).length;
            const memRate = totalWords > 0 ? Math.round(safeCount / totalWords * 100) : 0;

            const todayCount = studyLog[today] || 0;
            let weekCount = 0;
            for (let i = 0; i < 7; i++) {
                const d = new Date(Date.now() - i * 86400000).toISOString().slice(0,10);
                weekCount += studyLog[d] || 0;
            }

            const recentQuiz = totalQuizHistory.filter(h => {
                const diffDays = (Date.now() - new Date(h.date).getTime()) / 86400000;
                return diffDays < 30;
            });
            const correct = recentQuiz.filter(h => h.ok).length;
            const quizRate = recentQuiz.length > 0 ? Math.round(correct / recentQuiz.length * 100) : 0;

            let streak = 0;
            for (let i = 0; i < 365; i++) {
                const d = new Date(Date.now() - i * 86400000).toISOString().slice(0,10);
                if (studyLog[d]) streak++;
                else if (i > 0) break;
            }

            document.getElementById('todayCount').innerText = todayCount;
            document.getElementById('weekCount').innerText = weekCount;
            document.getElementById('memRate').innerText = memRate + "%";
            document.getElementById('quizRate').innerText = quizRate + "%";
            document.getElementById('streakNum').innerText = streak;

            let chartHtml = '';
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(Date.now() - i * 86400000);
                last7Days.push({
                    date: d.toISOString().slice(5,10).replace('-','/'),
                    count: studyLog[d.toISOString().slice(0,10)] || 0
                });
            }
            const maxVal = Math.max(1, ...last7Days.map(d => d.count));
            last7Days.forEach(day => {
                const width = (day.count / maxVal * 100);
                chartHtml += `<div style="display:flex;align-items:center;margin:6px 0;">
                    <div style="width:45px;font-size:12px;">${day.date}</div>
                    <div style="flex:1;background:#eee;border-radius:5px;overflow:hidden;height:20px;">
                        <div class="chart-bar" style="width:${width}%;">${day.count || ''}</div>
                    </div>
                </div>`;
            });
            document.getElementById('weekChart').innerHTML = chartHtml;

            const wrongSorted = vocabulary.filter(v => v.w > 0).sort((a,b) => b.w - a.w).slice(0,5);
            document.getElementById('topWrongList').innerHTML = wrongSorted.length ? 
                wrongSorted.map(v => `<div style="margin:6px 0;padding:4px;background:white;border-radius:4px;">${v.eng} → ${v.kor} <strong style="color:#e74c3c;">${v.w}번</strong></div>`).join('') :
                '<div style="color:#28a745;">아직 틀린 단어가 없어요!</div>';
        }
        
        function logStudy(count = 1) {
            const today = new Date().toISOString().slice(0,10);
            studyLog[today] = (studyLog[today] || 0) + count;
            Storage.setJSON('studyLog', studyLog);
            updateStats();
        }
        function renderReport() {
             // ... (기존 renderReport 로직 그대로 유지) ...
            const ok = quizHistory.filter(h => h.ok).length;
            document.getElementById('repSum').innerText = `결과: ${ok} / ${quizHistory.length} (${Math.round(ok / quizHistory.length * 100)}%)`;
            
            document.getElementById('repTbody').innerHTML = quizHistory.map((h, i) => {
                const resultMark = h.ok 
                    ? `<span class="text-correct">O</span>` 
                    : `<span class="text-wrong">X (${h.u})</span>`;
                
                return `<tr>
                    <td>${h.q}</td>
                    <td>${h.a}</td>
                    <td>${resultMark}</td>
                    <td><span class="speaker-btn" onclick="speakReportByIndex(${i})">🔊</span></td>
                </tr>`;
            }).join('');
            
            document.getElementById('reportModal').style.display = 'flex';
        }
        
        /* ========== 📋 모아보기 ========== */
        function openListView() { const list = getFiltered(); listPage = 0; renderList(list); document.getElementById('listModal').style.display = 'flex'; }
        function renderList(list) {
            document.getElementById('listTbody').innerHTML = list.slice(listPage * 5, listPage * 5 + 5).map(v => 
                `<tr onclick="speakVocabByNum(${v.num})"><td>${v.eng}</td><td>${v.kor}</td><td>🔊</td></tr>`
            ).join('');
            document.getElementById('listPageInfo').innerText = `${listPage + 1} / ${Math.ceil(list.length / 5) || 1}`;
        }
        function moveListPage(d) { const list = getFiltered(); listPage = Math.max(0, Math.min(Math.ceil(list.length / 5) - 1, listPage + d)); renderList(list); }
        function toggleListAuto() {
            if (listAutoTimer) { clearInterval(listAutoTimer); listAutoTimer = null; document.getElementById('listPlayBtn').innerText = "재생"; }
            else { listAutoTimer = setInterval(() => moveListPage(1), parseFloat(document.getElementById('listSpeed').value) * 1000); document.getElementById('listPlayBtn').innerText = "정지"; }
        }
        function closeListView() { if (listAutoTimer) clearInterval(listAutoTimer); document.getElementById('listModal').style.display = 'none'; }
        
        
        // === TTS 대상 텍스트 선택 헬퍼 ===
        function hasHangul(s) { return /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/.test(s || ''); }
        function hasLatin(s) { return /[A-Za-z]/.test(s || ''); }
        function pickTextByStudyLang(a, b) {
            const t1 = (a ?? '').toString();
            const t2 = (b ?? '').toString();
            if (currentStudyLang === 'ko') {
                if (hasHangul(t1)) return t1;
                if (hasHangul(t2)) return t2;
                return t1 || t2;
            } else {
                if (hasLatin(t1)) return t1;
                if (hasLatin(t2)) return t2;
                return t1 || t2;
            }
        }
        function getVocabSpeakText(v) {
            if (!v) return '';
            if (currentStudyLang === 'ko') return (v.kor ?? v.eng ?? '').toString();
            return (v.eng ?? v.kor ?? '').toString();
        }
        function speakVocabByNum(num) {
            const v = vocabulary.find(x => x.num === num) || getFiltered().find(x => x.num === num);
            speak(getVocabSpeakText(v));
        }
        function speakReportByIndex(i) {
            const h = quizHistory[i];
            if (!h) return;
            speak(pickTextByStudyLang(h.a, h.q));
        }
		function speak(t) {
            return TTS.speak(t);
        }

        // 🗣️ 회화 모드용으로 manualSpeak 로직 수정
        function manualSpeak() { 
            const mode = getCurrentMode();
            
            if (mode === 'dialogMode' && dialogScript.length > 0 && dialogScript[currentIndex]) {
                speak(dialogScript[currentIndex].text);
            } else {
                const p = isRunning ? currentPool : (mode === 'srsMode' ? getSRSItems() : getFiltered()); 
                if (p.length > 0 && p[currentIndex]) speak(getVocabSpeakText(p[currentIndex])); }
        }
        
        // 🗣️ 회화 모드에서 다음으로 넘어가는 로직 수정 (Dialog Mode일 경우 nextDialogLine 호출)
        
        /* ========== ⬅️➡️ 카드 네비게이션 ========== */
        function nextCard() { 
            const mode = getCurrentMode();
            
            if (mode === 'dialogMode') {
                nextDialogLine();
                return;
            }
            
            const p = isRunning ? currentPool : (mode === 'srsMode' ? getSRSItems() : getFiltered()); 
            const originalItem = vocabulary.find(v => v.num === p[currentIndex].num); 

            if (p.length > 0) {
                if (isRunning && (getCurrentMode() === 'srsMode') && originalItem) {
                    updateSRS(originalItem, true);
                }
                currentIndex = (currentIndex + 1) % p.length;
                if (isRunning) logStudy(1); 
            }
            updateDisplay(); 
        }

        function prevCard() { 
            const mode = getCurrentMode();
            if (mode === 'dialogMode') {
                 if (currentIndex > 0) currentIndex--;
            } else {
                 if (currentIndex > 0) currentIndex--;
            }
            updateDisplay(); 
        }

        // ⚙️ 설정 표시 토글 함수
        
        /* ========== ⚙️ 설정 표시 토글 ========== */
        function toggleSettings() {
            const showBasic = document.getElementById('showBasicSettings').checked;
            const showStudy = document.getElementById('showStudySettings').checked;
            const __readCb = document.getElementById('showReadingSettings');
            const showReading = __readCb ? __readCb.checked : false;
            const showQuiz = document.getElementById('showQuizSettings').checked;
            const showSrs = document.getElementById('showSrsSettings').checked;
            const __dialogCb = document.getElementById('showDialogSettings');
            const showDialog = __dialogCb ? __dialogCb.checked : false;
            const showShadow = document.getElementById('showShadowSettings') ? (document.getElementById('showShadowSettings') && document.getElementById('showShadowSettings').checked) : false;

            // 각 설정 영역 표시/숨김
            document.getElementById('basicOpt').style.display = showBasic ? 'block' : 'none';
            document.getElementById('studyOpt').style.display = showStudy ? 'flex' : 'none';
            const __readingOpt = document.getElementById('readingOpt');
            if (__readingOpt) __readingOpt.style.display = showReading ? 'flex' : 'none';
            document.getElementById('quizOpt').style.display = showQuiz ? 'flex' : 'none';
            document.getElementById('srsOpt').style.display = showSrs ? 'flex' : 'none';
            const __dialogOpt = document.getElementById('dialogOpt');
            if (__dialogOpt) __dialogOpt.style.display = showDialog ? 'flex' : 'none';
            if (document.getElementById('shadowOpt')) document.getElementById('shadowOpt').style.display = showShadow ? 'block' : 'none';
            
            // 설정 저장 (localStorage)
            Storage.set('showBasicSettings', showBasic);
            Storage.set('showStudySettings', showStudy);
            Storage.set('showReadingSettings', showReading);
            Storage.set('showQuizSettings', showQuiz);
            Storage.set('showSrsSettings', showSrs);
            Storage.set('showDialogSettings', showDialog);
        }

        // ⭐️ modeToggle 로직 (설정 표시는 toggleSettings가 관리)
        function modeToggle() { 
            stopApp(); 
            
            const srs = (getCurrentMode() === 'srsMode');
            document.getElementById('customEaseInput').style.display = 
                document.getElementById('easeMode').value === 'custom' && srs ? 'inline' : 'none';

            clearCache(); // 모드가 바뀌면 캐시 초기화
            updateDisplay();
        }

        // ⭐️ DOMContentLoaded로 모든 초기화 및 이벤트 리스너 통합 (안정성 확보)
        
        
        /* ========== 🧩 Modes (학습 모드 로직 묶음) ========== */
        // ✅ 한 파일 안에서 "모드별 진입점"을 한 곳에서 찾을 수 있게 정리한 매핑입니다.
        // - 기존 함수/동작은 그대로 두고, 참조만 모아둔 형태(안전한 모듈화)
        const Modes = {
            // 현재 모드/공용
            getCurrentMode,
            start: startApp,
            stop: stopApp,
            updateDisplay,

            // 단어/읽기/깜빡이 계열
            reading: { run: runReading, updateReadingMode },
            study: { run: runStudy },

            // 퀴즈
            quiz: { show: showQuiz, toggleMem, getQuizPool, getFiltered },

            // 회화(대화)
            dialog: { run: runDialog, next: nextDialogLine },

            // 쉐도잉(안정 버전)
            shadowing: { run: runShadowingStable, speak: speakShadowStable, finish: finishShadowing, setFinishButtonVisible: setShadowFinishBtnVisible },
        };

/* ========== 🚀 초기화 (DOMContentLoaded) ========== */
        document.addEventListener('DOMContentLoaded', () => {
            // 1. 다크 모드 및 설정 로드
            if (Storage.get('darkMode') === 'enabled') {
                document.body.classList.add('dark-mode');
                document.getElementById('themeBtn').textContent = '☀️';
            }
            loadSettings(); // 컬러 토글 설정 로드
            
            // 1-1. 설정 토글 상태 로드
            if (Storage.get('showBasicSettings') !== null) {
                document.getElementById('showBasicSettings').checked = Storage.get('showBasicSettings') === 'true';
            }
            if (Storage.get('showStudySettings') !== null) {
                document.getElementById('showStudySettings').checked = Storage.get('showStudySettings') === 'true';
            }
            if (Storage.get('showReadingSettings') !== null) {
                const __cb = document.getElementById('showReadingSettings');
                if (__cb) __cb.checked = Storage.get('showReadingSettings') === 'true';
            }
            if (Storage.get('showQuizSettings') !== null) {
                document.getElementById('showQuizSettings').checked = Storage.get('showQuizSettings') === 'true';
            }
            if (Storage.get('showSrsSettings') !== null) {
                document.getElementById('showSrsSettings').checked = Storage.get('showSrsSettings') === 'true';
            }
            if (Storage.get('showDialogSettings') !== null) {
                const __cb = document.getElementById('showDialogSettings');
                if (__cb) __cb.checked = Storage.get('showDialogSettings') === 'true';
            }
            toggleSettings(); // 설정 표시 초기화
            
            // 1-2. TTS 음성 목록 로드
            updateVoiceList(); // 다국어 지원 버전으로 변경
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = updateVoiceList;
            }

            // voice 변경 시 즉시 저장
            // 2. 이벤트 리스너(버튼/키/입력) 일괄 바인딩
            App.init();

            // 4. 초기 상태 업데이트
            modeToggle(); // 모드 토글로 초기 UI 상태 설정
            clearCache();
            updateDisplay();
            updateStats();
            updateUILanguage(); // UI 언어 적용
        });
    
        // ===== Shadowing (Stable) =====
        let shadowTimer = null;
        let shadowStopFlag = false;
        let shadowFinishFlag = false;

        function setShadowFinishBtnVisible(visible) {
            const btn = document.getElementById('shadowFinishBtn');
            if (btn) btn.style.display = visible ? 'inline-block' : 'none';
        }

        function finishShadowing() {
            shadowFinishFlag = true;
        }

        function speakShadowStable(text, rateOverride, callback) {
            return TTS.speakShadowStable(text, rateOverride, callback);
        }

        function runShadowingStable() {
            if (!isRunning) return;
            if (!dialogScript || dialogScript.length < 2) {
                alert(I18N.bundle().err_load_dialog);
                return;
            }

            shadowStopFlag = false;
            shadowFinishFlag = false;
            setShadowFinishBtnVisible(true);

            // 시작 시 한 번만 큐 정리
            window.speechSynthesis.cancel();

            const mySec = parseFloat(document.getElementById('shadowMyTime').value);
            const myDelay = (isNaN(mySec) ? 0 : mySec) * 1000;
            const rateA = parseFloat(document.getElementById('shadowRateA').value);
            const rateB = parseFloat(document.getElementById('shadowRateB').value);
            const systemRest = 250;

            let pairBase = currentIndex - (currentIndex % 2); // 항상 A(짝수 index)부터 시작하도록 정렬

            function loopEnabled() {
                const el = document.getElementById('shadowLoop');
                return el ? el.checked : false;
            }

            function ensurePair() {
                if (pairBase < 0) pairBase = 0;
                if (pairBase >= dialogScript.length) return false;
                return !!(dialogScript[pairBase] && dialogScript[pairBase + 1]);
            }

            function stepA() {
                if (shadowStopFlag) return;
                if (!ensurePair()) { stopApp(); return; }

                const A = dialogScript[pairBase];

                currentIndex = pairBase;
                window.currentReadingRole = 'A';
                updateDisplay();

                speakShadowStable(A.text, rateA, () => {
                    if (shadowStopFlag) return;
                    shadowTimer = setTimeout(() => {
                        if (shadowStopFlag) return;
                        shadowTimer = setTimeout(() => { if (!shadowStopFlag) stepB(); }, myDelay);
                    }, systemRest);
                });
            }

            function stepB() {
                if (shadowStopFlag) return;
                if (!ensurePair()) { stopApp(); return; }

                const B = dialogScript[pairBase + 1];

                currentIndex = pairBase + 1;
                window.currentReadingRole = 'B';
                updateDisplay();

                speakShadowStable(B.text, rateB, () => {
                    if (shadowStopFlag) return;
                    shadowTimer = setTimeout(() => {
                        if (shadowStopFlag) return;
                        shadowTimer = setTimeout(() => {
                            if (shadowStopFlag) return;

                            if (shadowFinishFlag) { stopApp(); return; }

                            if (loopEnabled()) {
                                shadowTimer = setTimeout(() => { if (!shadowStopFlag) stepA(); }, systemRest);
                            } else {
                                pairBase += 2;
                                shadowTimer = setTimeout(() => { if (!shadowStopFlag) stepA(); }, systemRest);
                            }
                        }, myDelay);
                    }, systemRest);
                });
            }

            stepA();
        }


        // ========== ⛶ Fullscreen (PC) ==========
        function toggleFullscreen() {
            try {
                if (!document.fullscreenElement) {
                    (document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() :
                     document.body.requestFullscreen ? document.body.requestFullscreen() : null);
                } else {
                    document.exitFullscreen && document.exitFullscreen();
                }
            } catch (e) {
                console.log('Fullscreen error:', e);
            }
        }

        function updateFullscreenButton() {
            const btn = document.getElementById('fullscreenBtn');
            if (!btn) return;
            const isFs = !!document.fullscreenElement;
            btn.textContent = isFs ? '🡼' : '⛶';
            // i18n title
            try {
                const isEn = (window.I18N && I18N.current === 'en');
                btn.title = isFs ? (isEn ? 'Exit Fullscreen' : '전체화면 종료') : (isEn ? 'Enter Fullscreen' : '전체화면');
            } catch (e) {}
        }

        // Bind fullscreen button safely (do not interfere with existing init logic)
        document.addEventListener('DOMContentLoaded', () => {
            const btn = document.getElementById('fullscreenBtn');
            if (btn && !btn.__fsBound) {
                btn.addEventListener('click', (e) => { e.preventDefault(); toggleFullscreen(); });
                btn.__fsBound = true;
            }
            document.addEventListener('fullscreenchange', updateFullscreenButton);
            updateFullscreenButton();
        });


        // ========== ▣ Study-stage Fullscreen (internal) ==========
        function setStageToolbarTitles(){
            const isEn = (window.I18N && I18N.current === 'en');
            const btn = document.getElementById('stageFsBtn');
            if(btn) btn.title = isEn ? 'Study Fullscreen' : '학습창 풀화면';

            const exitBtn = document.getElementById('stageExitBtn');
            if(exitBtn) exitBtn.title = isEn ? 'Exit' : '닫기';

            const fp = document.getElementById('stageFontPlus');
            if(fp) fp.title = isEn ? 'Font +' : '글씨 크게';

            const fm = document.getElementById('stageFontMinus');
            if(fm) fm.title = isEn ? 'Font -' : '글씨 작게';

            const sb = document.getElementById('stageSettingsBtn');
            if(sb) sb.title = isEn ? 'Options' : '옵션';
        }

        function updateStageFsButton(){
            const btn = document.getElementById('stageFsBtn');
            if(!btn) return;
            const on = document.body.classList.contains('stage-full');
            btn.textContent = on ? '▣' : '▣';
            // keep title synced
            setStageToolbarTitles();
        }

        function toggleStudyStageFullscreen(){
            const entering = !document.body.classList.contains('stage-full');
            document.body.classList.toggle('stage-full');
            if(entering){
                // default: hide settings; user can open with ⚙
                document.body.classList.remove('stage-show-settings');
                // scroll stage to top for clean start
                try{ document.getElementById('studyStage')?.scrollTo(0,0); }catch(e){}
            }
            updateStageFsButton();
        }

        function toggleStageSettings(){
            document.body.classList.toggle('stage-show-settings');
        }

        function bumpStageFont(delta){
            const inp = document.getElementById('fontSize');
            if(!inp) return;
            let v = parseInt(inp.value || '38', 10);
            if(isNaN(v)) v = 38;
            v = Math.max(10, Math.min(200, v + delta));
            inp.value = v;
            if(typeof updateDisplay === 'function') updateDisplay();
        }

        document.addEventListener('DOMContentLoaded', () => {
            const stageBtn = document.getElementById('stageFsBtn');
            if(stageBtn && !stageBtn.__bound){
                stageBtn.addEventListener('click', (e)=>{ e.preventDefault(); toggleStudyStageFullscreen(); });
                stageBtn.__bound = true;
            }
            document.getElementById('stageExitBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); document.body.classList.remove('stage-full'); updateStageFsButton(); });
            document.getElementById('stageLangBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); toggleLanguage(); });
            document.getElementById('stageSettingsBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); toggleStageSettings(); });
            document.getElementById('stageFontPlus')?.addEventListener('click', (e)=>{ e.preventDefault(); bumpStageFont(+4); });
            document.getElementById('stageFontMinus')?.addEventListener('click', (e)=>{ e.preventDefault(); bumpStageFont(-4); });

            // ESC exits study-stage fullscreen (doesn't affect browser fullscreen)
            document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ App.dispatch('ESCAPE'); } });

            setStageToolbarTitles();
            updateStageFsButton();
        });


        // ===== Improved universal center apply (works in all modes & fullscreen) =====

        document.addEventListener('DOMContentLoaded', ()=>{        });