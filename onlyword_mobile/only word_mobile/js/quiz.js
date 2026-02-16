/* =========================================================
 * Quiz engine
 * Generated: 2026-02-10 20:55:40
 * Notes:
 * - This file is part of the "split/annotated" refactor.
 * - Functions/variables are kept global (non-module) to avoid breaking behavior.
 * ========================================================= */


// ---------------------------------------------------------
// startQuiz
// ---------------------------------------------------------

        function startQuiz() {
            const p = getFiltered();
            if (p.length === 0) {
                alert(UI_TEXT[currentUILang].noWordsMatch);
                return;
            }

            const count = Math.min(settings.quizCount, p.length);
            let basePool = settings.quizShuffle ? 
                p.sort(() => Math.random() - 0.5).slice(0, count) : 
                p.slice(0, count);
            
            // 🔄 오답 복습 로직
            let revivePool = [];
            if (settings.wrongRevive) {
                const maxDays = settings.wrongDays;
                const today = new Date().getTime();
                const cutoffTime = today - (maxDays * 86400000);
                
                const baseNums = new Set(basePool.map(v => v.num));
                
                revivePool = vocabulary.filter(v => {
                    if (baseNums.has(v.num)) return false;
                    
                    return v.wrongDates && v.wrongDates.some(dateStr => {
                        const wrongTime = new Date(dateStr).getTime();
                        return wrongTime >= cutoffTime;
                    });
                }).sort(() => Math.random() - 0.5);
            }
            
            quizPool = [...basePool, ...revivePool];
            currentPool = quizPool;
            currentIndex = 0;
            quizHistory = [];
            isRunning = true;
            
            document.getElementById('playPauseBtn').textContent = '⏸';
            
            showQuizQuestion();
        }

        // 퀴즈 문제
// ---------------------------------------------------------
// showQuizQuestion
// ---------------------------------------------------------

        function showQuizQuestion() {
            if (currentIndex >= quizPool.length) {
                finishQuiz();
                return;
            }

            const it = quizPool[currentIndex];
            
            // 퀴즈 방향 결정
            let direction = settings.quizDirection;
            if (direction === 'mixed') {
                direction = Math.random() < 0.5 ? 'engToKor' : 'korToEng';
            }
            
            // 방향에 따라 문제와 정답 설정
            let questionText, correctAnswer;
            if (direction === 'korToEng') {
                questionText = it.kor;
                correctAnswer = it.eng;
            } else {
                questionText = it.eng;
                correctAnswer = it.kor;
            }
            
            document.getElementById('cardWord').textContent = questionText;
            document.getElementById('cardMeaning').textContent = '';
            document.getElementById('quizOpt').style.display = 'grid';

            // 선택지 생성 (방향에 따라)
            // ✅ 중복(동일 eng/kor) 때문에 선택지가 4개를 초과해 "빈 보기/undefined"가 생기는 문제 방지
            const numberEmojis = ['①', '②', '③', '④'];
            const correctText = (direction === 'korToEng') ? it.eng : it.kor;

            // 후보 풀에서 정답과 다른 텍스트만 수집 (표시 텍스트 기준)
            const poolTexts = [];
            for (const v of vocabulary) {
                const t = (direction === 'korToEng') ? v.eng : v.kor;
                if (!t) continue;
                if (t === correctText) continue;
                poolTexts.push(t);
            }

            // 중복 제거 + 랜덤 셔플
            const uniq = Array.from(new Set(poolTexts));
            uniq.sort(() => Math.random() - 0.5);

            // 최종 4개 고정: [정답] + [오답 3개]
            const optsTexts = [correctText, ...uniq.slice(0, 3)];
            // 혹시 후보가 부족하면(매우 작은 데이터셋) 중복 허용하여 4개 채움
            while (optsTexts.length < 4) optsTexts.push(correctText);

            // 셔플
            optsTexts.sort(() => Math.random() - 0.5);
            const correctIndex = optsTexts.indexOf(correctText);

            document.getElementById('quizOpt').innerHTML = optsTexts.slice(0,4).map((txt, i) => {
                const prefix = numberEmojis[i] || ((i + 1) + '.');
                const safeTxt = String(txt).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return `<button class="quiz-btn" onclick="checkAnswer(${i}, ${correctIndex}, '${direction}')">${prefix} ${safeTxt}</button>`;
            }).join('');

            updateDisplay();
            if (settings.autoSpeak && direction === 'engToKor') speakWord();
        }

        // 정답 체크
// ---------------------------------------------------------
// checkAnswer
// ---------------------------------------------------------

        function checkAnswer(selected, correct, direction) {
            const it = quizPool[currentIndex];
            const originalItem = vocabulary.find(v => v.num === it.num);
            const isCorrect = selected === correct;
            const btns = document.querySelectorAll('.quiz-btn');

            if (isCorrect) {
                btns[selected].classList.add('correct');
                quizHistory.push({ word: it.eng, meaning: it.kor, ok: true });
                totalQuizHistory.push({ word: it.eng, ok: true, date: new Date().toISOString() });
                localStorage.setItem('totalQuizHistory', JSON.stringify(totalQuizHistory));
                
                // 안정권 시스템 적용
                if (originalItem) {
                    originalItem.quizCount = (originalItem.quizCount || 0) + 1;
                    
                    if (currentMode === 'srs') {
                        updateSRS(originalItem, true);
                    } else {
                        originalItem.m = true;
                        originalItem.correctStreak = (originalItem.correctStreak || 0) + 1;
                        originalItem.totalCorrect = (originalItem.totalCorrect || 0) + 1;
                        
                        if (originalItem.correctStreak >= 5 || originalItem.totalCorrect >= 10) {
                            originalItem.isSafe = true;
                            originalItem.w = 0;
                        } else {
                            originalItem.w = Math.max(0, originalItem.w - 1);
                        }
                        saveLocal();
                        clearCache();
                    }
                }
                
                logStudy(1);
                
                // 한→영 모드에서 자동발음 체크되어 있으면 정답 영어 발음
                if (direction === 'korToEng' && settings.autoSpeak) {
                    App.Timers.setTimeout(() => speakWord(), 100);
                }
                
                App.Timers.setTimeout(() => {
                    currentIndex++;
                    showQuizQuestion();
                }, 800);
            } else {
                btns[selected].classList.add('wrong');
                if (settings.quizHint) {
                    btns[correct].classList.add('correct');
                }
                
                // 안정권 시스템 적용
                if (originalItem) {
                    originalItem.quizCount = (originalItem.quizCount || 0) + 1;
                    
                    if (currentMode === 'srs') {
                        updateSRS(originalItem, false);
                    } else {
                        originalItem.w++;
                        originalItem.correctStreak = 0;
                        originalItem.isSafe = false;
                        
                        // 오답 날짜 기록
                        const todayIso = new Date().toISOString().slice(0, 10);
                        if (!originalItem.wrongDates) originalItem.wrongDates = [];
                        if (!originalItem.wrongDates.includes(todayIso)) {
                            originalItem.wrongDates.push(todayIso);
                        }
                        saveLocal();
                        clearCache();
                    }
                }
                
                quizHistory.push({ word: it.eng, meaning: it.kor, ok: false });
                totalQuizHistory.push({ word: it.eng, ok: false, date: new Date().toISOString() });
                localStorage.setItem('totalQuizHistory', JSON.stringify(totalQuizHistory));
                
                logStudy(1);
                
                // 한→영 모드에서 오답시에도 정답 영어 발음
                if (direction === 'korToEng' && settings.autoSpeak) {
                    App.Timers.setTimeout(() => speakWord(), 100);
                }
                
                App.Timers.setTimeout(() => {
                    currentIndex++;
                    showQuizQuestion();
                }, settings.quizDelay * 1000);
            }
            updateStats();
        }

        // 퀴즈 완료
// ---------------------------------------------------------
// finishQuiz
// ---------------------------------------------------------

        function finishQuiz() {
            stopApp();
            showReportModal();
        }

        // 이전/다음