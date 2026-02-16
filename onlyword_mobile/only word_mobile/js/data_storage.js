/* =========================================================
 * Data Storage (import/export/local)
 * Refactor: split from legacy/data_io.js
 * Generated: 2026-02-11
 * ========================================================= */

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
