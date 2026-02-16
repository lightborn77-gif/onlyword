function _loadFile(e) {
            const file = e.target.files[0]; 
            if(!file) return;
            
            const reader = new FileReader();
            
            reader.onerror = () => {
                alert(I18N.bundle().err_file_read);
                document.getElementById('stMsg').innerText = I18N.bundle().err_file_load;
            };
            
            reader.onload = ev => {
                try {
                    const content = ev.target.result;
                    const lines = content.split(/\r?\n/);
                    
                    // 🔍 파일 형식 자동 감지
                    const fileType = FileLoader.detectFileType(lines);
                    
                    if (fileType === 'vocabulary') {
                        FileLoader.loadVocabularyData(content, file.name);
                    } else {
                        alert(I18N.bundle().err_file_format);
                        document.getElementById('stMsg').innerText = I18N.bundle().err_format_unknown;
                    }
                    
                } catch(err) {
                    alert(I18N.bundle().err_processing + err.message);
                    document.getElementById('stMsg').innerText = I18N.bundle().err_process_fail;
                }
            };
            
            reader.readAsText(file, 'UTF-8');
        }

function _detectFileType(lines) {
            // 단어장 전용: 단어장 형식만 허용
            // 처음 20줄 검사
            const sampleLines = lines.slice(0, 20).map(l => l.trim()).filter(l => l.length > 0);

            let vocabScore = 0;

            for (const line of sampleLines) {
                // 단어장 패턴: "1. apple" 또는 "1 apple"
                if (/^\d+\s*[\.\s-]+/.test(line)) {
                    vocabScore += 2;
                }
            }

            if (vocabScore >= 2) return 'vocabulary';
            return 'unknown';
        }

function _loadVocabularyData(content, fileName) {
            const App = window.App || {};
            
            const map = {};
            content.split(/\r?\n/).forEach(line => {
                const cleanLine = line.trim()
                    .replace(/\([^)]*\)/g, '')
                    .replace(/[✅🟢❌]/g, '');
                
                const match = cleanLine.match(/^(\d+)\s*[\.\s-]*\s*([\s\S]+)/);
                if (match) {
                    const num = parseInt(match[1]); 
                    const txt = match[2].trim();
                    if (!map[num]) map[num] = { 
                        num, eng: "", kor: "", w: 0, m: false, wrongDates: [], 
                        quizCount: 0, correctStreak: 0, totalCorrect: 0, isSafe: false 
                    }; 
                    
                    if (/[a-zA-Z]/.test(txt) && !/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(txt)) { 
                        if(!map[num].eng) map[num].eng = txt; 
                    } else {
                        map[num].kor = map[num].kor ? map[num].kor + ", " + txt : txt;
                    }
                }
            });
            
            const vocabulary = Object.values(map).filter(v => v.eng && v.kor).sort((a,b) => a.num - b.num);
            
            if(vocabulary.length === 0) {
                alert(I18N.bundle().err_no_words);
                document.getElementById('stMsg').innerText = I18N.bundle().err_no_words_status;
                return;
            }

            vocabulary.forEach(item => {
                if (!item.hasOwnProperty('lastSeen')) item.lastSeen = null;
                if (!item.hasOwnProperty('interval')) item.interval = 1;
                if (!item.hasOwnProperty('ease')) item.ease = 2.5;
                if (!item.hasOwnProperty('wrongDates')) item.wrongDates = []; 
                if (!item.hasOwnProperty('quizCount')) item.quizCount = 0;
                if (!item.hasOwnProperty('correctStreak')) item.correctStreak = 0;
                if (!item.hasOwnProperty('totalCorrect')) item.totalCorrect = 0;
                if (!item.hasOwnProperty('isSafe')) item.isSafe = false;
            });

            if(vocabulary.length > 0) { 
                document.getElementById('startIdx').value = vocabulary[0].num; 
                document.getElementById('endIdx').value = vocabulary[vocabulary.length-1].num; 
            }
            
            const saved = Storage.get('mem_'+fileName);
            if(saved) {
                try {
                    JSON.parse(saved).forEach(s => { 
                        const it = vocabulary.find(v=>v.num===s.n); 
                        if(it){
                            it.m = s.m; it.w = s.w;
                            if (s.lastSeen) it.lastSeen = s.lastSeen;
                            if (s.interval) it.interval = s.interval;
                            if (s.wrongDates) it.wrongDates = s.wrongDates; 
                            if (s.quizCount) it.quizCount = s.quizCount;
                            if (s.correctStreak) it.correctStreak = s.correctStreak;
                            if (s.totalCorrect) it.totalCorrect = s.totalCorrect;
                            if (s.isSafe !== undefined) it.isSafe = s.isSafe;
                        }
                    });
                } catch(err) {
                    console.warn('저장된 데이터 로드 실패:', err);
                }
            }
            
            // State 모듈 사용 (있으면)
            if (App.State?.setVocab) {
                App.State.setVocab(vocabulary, fileName);
            } else {
                // 레거시: 전역 변수 직접 할당
                window.vocabulary = vocabulary;
                window.currentFileName = fileName;
            }

            document.getElementById('stMsg').innerText = `${I18N.bundle().status_vocab_loaded} ${vocabulary.length}${I18N.bundle().status_vocab_count}`;
            if (typeof clearCache === 'function') clearCache();
            if (typeof updateDisplay === 'function') updateDisplay();
            if (typeof updateStats === 'function') updateStats();
        }

const FileLoader = {
            loadFile: _loadFile,
            detectFileType: _detectFileType,
            loadVocabularyData: _loadVocabularyData
        };
window.FileLoader = FileLoader;
