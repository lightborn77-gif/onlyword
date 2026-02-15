/* =========================================================
 * File detect/load + import/export + cache
 * Generated: 2026-02-10 20:55:40
 * Notes:
 * - This file is part of the "split/annotated" refactor.
 * - Functions/variables are kept global (non-module) to avoid breaking behavior.
 * ========================================================= */


// ---------------------------------------------------------
// clearCache
// ---------------------------------------------------------

        function clearCache() {
            cache = {};
            currentSettingsHash = '';
        }
        
        // 💡 설정 해시 생성
// ---------------------------------------------------------
// getSettingsHash
// ---------------------------------------------------------

        function getSettingsHash() {
            return JSON.stringify({
                mode: currentMode,
                unmem: settings.unmem,
                star: settings.star,
                safe: settings.safe,
                wrongRevive: settings.wrongRevive,
                wrongDays: settings.wrongDays,
                srsNew: settings.srsNewOnly,
                srsHard: settings.srsHardOnly
            });
        }

        // 파일 로드
        // 📁 통합 파일 로드 (자동 감지)
        document.getElementById('fileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            
            reader.onerror = () => alert('파일 읽기 실패!');
            
            reader.onload = function(e) {
                try {
                    const content = e.target.result;
                    const lines = content.split(/\r?\n/);
                    
                    // 🔍 파일 형식 자동 감지
                    const fileType = detectFileTypeMobile(lines);
                    
                    if (fileType === 'vocabulary') {
                        loadVocabularyMobile(content, file.name);
                    } else if (fileType === 'dialog') {
                        loadDialogMobile(content, file.name);
                    } else {
                        alert('파일 형식을 인식할 수 없습니다.\n\n단어장: "1. apple"\n회화: "A: Hello"');
                    }
                } catch(err) {
                    alert('파일 처리 중 오류: ' + err.message);
                }
            };
            
            reader.readAsText(file, 'UTF-8');
        });
        
        // 🔍 파일 형식 자동 감지
// ---------------------------------------------------------
// detectFileTypeMobile
// ---------------------------------------------------------

        function detectFileTypeMobile(lines) {
            const sampleLines = lines.slice(0, 20).map(l => l.trim()).filter(l => l.length > 0);
            
            let vocabScore = 0;
            let dialogScore = 0;
            
            for (const line of sampleLines) {
                if (/^\d+\s*[\.\s-]+/.test(line)) vocabScore += 2;
                if (/^[AB]\s*:\s*.+/i.test(line)) dialogScore += 2;
            }
            
            if (vocabScore > dialogScore && vocabScore >= 2) return 'vocabulary';
            if (dialogScore > vocabScore && dialogScore >= 2) return 'dialog';
            return 'unknown';
        }
        
        // 📚 단어장 로드 (모바일)
// ---------------------------------------------------------
// loadVocabularyMobile
// ---------------------------------------------------------

        function loadVocabularyMobile(content, fileName) {
            currentFileName = fileName.replace('.txt', '');
            
            const lines = content.trim().split('\n').map(line => line.trim()).filter(line => line);
            const groups = {};
            
            lines.forEach(line => {
                const match = line.match(/^(\d+)\.(.*)/);
                if (match) {
                    const num = parseInt(match[1]);
                    const text = match[2].trim();
                    
                    if (!groups[num]) {
                        groups[num] = { num: num, eng: '', kor: '' };
                    }
                    
                    if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)) {
                        groups[num].kor = text;
                    } else {
                        groups[num].eng = text;
                    }
                }
            });
            
            vocabulary = Object.values(groups)
                .filter(item => item.eng && item.kor)
                .sort((a, b) => a.num - b.num)
                .map(item => ({
                    num: item.num,
                    eng: item.eng,
                    kor: item.kor,
                    m: false,
                    w: 0,
                    star: false,
                    lastSeen: null,
                    interval: 1,
                    wrongDates: [],
                    quizCount: 0,
                    correctStreak: 0,
                    totalCorrect: 0,
                    isSafe: false
                }));
            
            const saved = localStorage.getItem('mem_' + currentFileName);
            if (saved) {
                JSON.parse(saved).forEach(d => {
                    const it = vocabulary.find(v => v.num === d.n);
                    if (it) {
                        it.m = d.m; 
                        it.w = d.w;
                        it.star = d.star || false;
                        if (d.lastSeen) it.lastSeen = d.lastSeen;
                        if (d.interval) it.interval = d.interval;
                        if (d.wrongDates) it.wrongDates = d.wrongDates;
                        if (d.quizCount !== undefined) it.quizCount = d.quizCount;
                        if (d.correctStreak !== undefined) it.correctStreak = d.correctStreak;
                        if (d.totalCorrect !== undefined) it.totalCorrect = d.totalCorrect;
                        if (d.isSafe !== undefined) it.isSafe = d.isSafe;
                    }
                });
            }
            
                        // ✅ 필터 캐시 초기화 (모드 전환/재로드 시 퀴즈 풀 0개 문제 방지)
            try { clearCache(); } catch (e) { /* noop */ }

// 회화 데이터 초기화
            dialogScript = [];
            dialogFileName = '';
            
            document.getElementById('endIdx').value = vocabulary.length;
            setRangeAll();
            
            const cardWord = document.getElementById('cardWord');
            cardWord.innerHTML = '';
            cardWord.style.fontSize = settings.fontSize + 'px';
            
            currentIndex = 0;
            updateDisplay();
            updateStats();
            closePopup('menuPopup');
            alert(`✅ 단어장 로드: ${vocabulary.length}개`);
        }
        
        // 💬 회화 로드 (모바일)
// ---------------------------------------------------------
// loadDialogMobile
// ---------------------------------------------------------

        function loadDialogMobile(content, fileName) {
            dialogFileName = fileName;
            
            const lines = content.split(/\r?\n/);
            dialogScript = [];
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                const match = line.match(/^(A|B):\s*(.+)/i);
                
                if (match) {
                    const role = match[1].toUpperCase();
                    const text = match[2].trim();
                    
                    let translation = "";
                    if (i + 1 < lines.length) {
                        const nextLine = lines[i + 1].trim();
                        if (nextLine && !nextLine.match(/^(A|B):/i)) {
                            translation = nextLine;
                            i++;
                        }
                    }
                    
                    dialogScript.push({ role, text, translation });
                }
            }
            
            if (dialogScript.length === 0) {
                alert('유효한 대화를 찾을 수 없습니다.\n형식: A: 영어문장\\n한글해석');
                return;
            }
            
            // 단어장 데이터 초기화
            vocabulary = [];
            currentFileName = '';
            // ✅ 필터 캐시 초기화
            try { clearCache(); } catch (e) { /* noop */ }
            
            // 회화 모드로 전환 (직접 변수 변경 방식)
            currentMode = 'dialog';
            
            // 모드 버튼 UI 업데이트
            const modeButtons = document.querySelectorAll('.mode-btn');
            modeButtons.forEach(btn => btn.classList.remove('active'));
            const dialogBtn = Array.from(modeButtons).find(btn => btn.textContent.includes('회화'));
            if (dialogBtn) dialogBtn.classList.add('active');
            
            currentIndex = 0;
            updateDisplay();
            closePopup('menuPopup');
            alert(`✅ 회화 로드: ${dialogScript.length}줄`);
        }

        // 필터링 (캐싱 적용)
// ---------------------------------------------------------
// saveLocal
// ---------------------------------------------------------

        function saveLocal() {
            if (currentFileName) {
                localStorage.setItem('mem_' + currentFileName, JSON.stringify(
                    vocabulary.map(v => ({ 
                        n: v.num, m: v.m, w: v.w, star: v.star, 
                        lastSeen: v.lastSeen, interval: v.interval,
                        wrongDates: v.wrongDates, quizCount: v.quizCount,
                        correctStreak: v.correctStreak, totalCorrect: v.totalCorrect,
                        isSafe: v.isSafe
                    }))
                ));
            }
            
            // 현재 선택된 음성 저장
            const voiceSelect = document.getElementById('voiceSelect');
            if (voiceSelect && voiceSelect.value) {
                localStorage.setItem(`selectedVoice_${currentStudyLang}`, voiceSelect.value);
            }
        }
// ---------------------------------------------------------
// exportData
// ---------------------------------------------------------


        function exportData() {
            if (vocabulary.length === 0) {
                alert(UI_TEXT[currentUILang].noData);
                return;
            }
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([JSON.stringify(
                vocabulary.map(v => ({ 
                    n: v.num, m: v.m, w: v.w, star: v.star, 
                    lastSeen: v.lastSeen, interval: v.interval,
                    wrongDates: v.wrongDates, quizCount: v.quizCount,
                    correctStreak: v.correctStreak, totalCorrect: v.totalCorrect,
                    isSafe: v.isSafe
                }))
            )], { type: 'application/json' }));
            a.download = `save_${currentFileName}.json`;
            a.click();
            closePopup('menuPopup');
        }
// ---------------------------------------------------------
// importData
// ---------------------------------------------------------


        function importData(input) {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    JSON.parse(e.target.result).forEach(d => {
                        const it = vocabulary.find(v => v.num === d.n);
                        if (it) {
                            it.m = d.m; it.w = d.w; it.star = d.star || false;
                            if (d.lastSeen) it.lastSeen = d.lastSeen;
                            if (d.interval) it.interval = d.interval;
                        }
                    });
                    updateDisplay();
                    alert(UI_TEXT[currentUILang].dataLoaded);
                } catch(err) {
                    alert(UI_TEXT[currentUILang].invalidFile);
                }
            };
            reader.readAsText(input.files[0]);
            closePopup('menuPopup');
        }

        // 통계