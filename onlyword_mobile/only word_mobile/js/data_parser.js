/* =========================================================
 * Data Parser (detect + load)
 * Refactor: split from legacy/data_io.js
 * Generated: 2026-02-11
 * ========================================================= */

// ---------------------------------------------------------
// detectFileTypeMobile (unchanged behavior)
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

// ---------------------------------------------------------
// loadVocabularyMobile (parsing + apply)
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
            // ✅ validate/normalize
            const __v = validateVocabularyItems(vocabulary);
            vocabulary = __v.items;
            if (!__v.ok) {
                alert(UI_TEXT[currentUILang]?.invalidWordFile || '단어 파일 형식이 올바르지 않습니다');
            }
            
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

// ---------------------------------------------------------
// loadDialogMobile (parsing + apply)
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
            
            const __d = validateDialogScriptItems(dialogScript);
            dialogScript = __d.items;
            if (!__d.ok) {
                alert(UI_TEXT[currentUILang]?.invalidDialogFile || '대화 파일 형식이 올바르지 않습니다');
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
