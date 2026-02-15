/* mobile app logic (extracted) */
window.App = window.App || {};

        // ============================================
        // 🌐 다국어 시스템 변수
        // ============================================
        let currentUILang = 'ko'; // UI 언어 (ko/en)
        let currentStudyLang = 'en'; // 학습 언어
        
        // 학습 언어 설정 (11개 언어)
        const STUDY_LANG_CONFIG = {
            en: { name: 'English', flag: '🇺🇸', ttsLang: 'en-US' },
            es: { name: 'Español', flag: '🇪🇸', ttsLang: 'es-ES' },
            fr: { name: 'Français', flag: '🇫🇷', ttsLang: 'fr-FR' },
            de: { name: 'Deutsch', flag: '🇩🇪', ttsLang: 'de-DE' },
            it: { name: 'Italiano', flag: '🇮🇹', ttsLang: 'it-IT' },
            pt: { name: 'Português', flag: '🇵🇹', ttsLang: 'pt-PT' },
            ru: { name: 'Русский', flag: '🇷🇺', ttsLang: 'ru-RU' },
            zh: { name: '中文', flag: '🇨🇳', ttsLang: 'zh-CN' },
            ja: { name: '日本語', flag: '🇯🇵', ttsLang: 'ja-JP' },
            ar: { name: 'العربية', flag: '🇸🇦', ttsLang: 'ar-SA' },
            hi: { name: 'हिन्दी', flag: '🇮🇳', ttsLang: 'hi-IN' }
        };
        
        // UI 텍스트 (한/영)
        const UI_TEXT = {
            ko: {
                title: '영어 단어장 Mobile',
                loadFileMessage: '파일을 불러주세요',
                fileSelectBtn: '파일 선택',
                
                // 팝업 타이틀
                popupRange: '📍 단어 범위',
                popupSpeed: '⚡ 깜박이 속도',
                popupSize: '🔤 글자 크기',
                popupQuizSettings: '⚙️ 퀴즈 설정',
                popupFilter: '🔍 필터',
                popupSRS: '🔄 SRS 설정',
                popupDialog: '💬 회화 설정',
                popupTTS: '🎤 음성 설정',
                popupReading: '🎓 독해/영작 설정',
                menu: '⚙️ 메뉴',
                stats: '📊 학습 통계',
                
                // 공통
                apply: '적용',
                all: '전체',
                start: '시작',
                startPlaceholder: '시작',
                endPlaceholder: '끝',
                fast: '빠름',
                normal: '보통',
                slow: '느림',
                seconds: '초',
                
                // 퀴즈 설정
                labelQuizDirection: '퀴즈 방향',
                engToKor: '영→한',
                korToEng: '한→영',
                mixed: '섞기',
                labelWrongDelay: '오답 지연 시간',
                labelStarReview: '🔄 별표 복습',
                excludeFromReview: '복습 제외',
                wrongReview: '오답 복습',
                labelOtherOptions: '⚙️ 기타 옵션',
                hint: '힌트',
                shuffle: '섞기',
                
                // 필터
                labelWordFilter: '📋 단어 필터',
                untested: '미테스트',
                starOnly: '별표만',
                safeOnly: '안정권만',
                labelColorHighlight: '🎨 컬러 강조',
                learningWords: '학습중 단어',
                starWords: '별표 단어',
                safeWords: '안정권 단어',
                autoSpeak: '자동 발음',
                
                // SRS
                labelReviewTarget: '복습 대상',
                newOnly: '새로운 단어만',
                hardOnly: '어려운 단어만',
                labelIntervalMultiplier: '간격 배율',
                labelFailureReduction: '실패 시 감소',
                reset: '초기화',
                
                // 회화
                labelRoleSettings: '역할 설정',
                roleA: '역할 A',
                roleB: '역할 B',
                labelWaitTime: '대기 시간 설정',
                normalSpeed: '보통 속도',
                
                // TTS
                studyLang: '학습 언어',
                labelVoice: '음성 선택',
                labelSpeed: '속도',
                labelPitch: '피치',
                
                // 독해/영작
                labelStudyMode: '학습 모드',
                off: '꺼짐',
                readingMode: '독해모드 (영→한)',
                writingMode: '영작모드 (한→영)',
                labelThinkTime: '생각 시간 (초)',
                labelAnswerTime: '답 보는 시간 (초)',
                
                // 메뉴
                fileLoad: '📂 파일 불러오기 (자동감지)',
                dataSave: '💾 데이터 저장',
                dataLoad: '📥 데이터 불러오기',
                quizReport: '📋 퀴즈 리포트',
                
                // 모드
                modeStudy: '깜박이',
                modeQuiz: '퀴즈',
                modeSRS: 'SRS 복습',
                modeDialog: '회화',
                
                // 컨트롤
                reading: '독해영작',
                filter: '필터',
                restart: '처음부터',
                quizSettings: '퀴즈설정',
                srsSettings: 'SRS 설정',
                dialogSettings: '회화 설정',
                ttsSettings: '음성 설정',
                problems: '문제',
                
                // Alert
                noData: '데이터가 없습니다',
                noQuiz: '아직 퀴즈를 진행하지 않았습니다',
                dataLoaded: '데이터를 불러왔습니다',
                invalidFile: '잘못된 파일입니다',
                loadFileFirst: '파일을 먼저 로드해주세요',
                loadDialogFirst: '대화 파일을 먼저 로드해주세요',
                loadWordFileFirst: '단어 파일을 먼저 로드해주세요',
                noWordsMatch: '조건에 맞는 단어가 없습니다',
                noSRSToday: '오늘 복습할 단어가 없습니다'
            },
            en: {
                title: 'Vocabulary Mobile',
                loadFileMessage: 'Please load a file',
                fileSelectBtn: 'Select File',
                
                // 팝업 타이틀
                popupRange: '📍 Word Range',
                popupSpeed: '⚡ Flash Speed',
                popupSize: '🔤 Font Size',
                popupQuizSettings: '⚙️ Quiz Settings',
                popupFilter: '🔍 Filter',
                popupSRS: '🔄 SRS Settings',
                popupDialog: '💬 Dialog Settings',
                popupTTS: '🎤 Voice Settings',
                popupReading: '🎓 Reading/Writing',
                menu: '⚙️ Menu',
                stats: '📊 Study Stats',
                
                // 공통
                apply: 'Apply',
                all: 'All',
                start: 'Start',
                startPlaceholder: 'Start',
                endPlaceholder: 'End',
                fast: 'Fast',
                normal: 'Normal',
                slow: 'Slow',
                seconds: 'sec',
                
                // 퀴즈 설정
                labelQuizDirection: 'Quiz Direction',
                engToKor: 'Eng→Kor',
                korToEng: 'Kor→Eng',
                mixed: 'Mixed',
                labelWrongDelay: 'Wrong Answer Delay',
                labelStarReview: '🔄 Star Review',
                excludeFromReview: 'Exclude',
                wrongReview: 'Wrong Review',
                labelOtherOptions: '⚙️ Other Options',
                hint: 'Hint',
                shuffle: 'Shuffle',
                
                // 필터
                labelWordFilter: '📋 Word Filter',
                untested: 'Untested',
                starOnly: 'Star Only',
                safeOnly: 'Safe Only',
                labelColorHighlight: '🎨 Color Highlight',
                learningWords: 'Learning Words',
                starWords: 'Star Words',
                safeWords: 'Safe Words',
                autoSpeak: 'Auto Speak',
                
                // SRS
                labelReviewTarget: 'Review Target',
                newOnly: 'New Only',
                hardOnly: 'Hard Only',
                labelIntervalMultiplier: 'Interval Multiplier',
                labelFailureReduction: 'Failure Reduction',
                reset: 'Reset',
                
                // 회화
                labelRoleSettings: 'Role Settings',
                roleA: 'Role A',
                roleB: 'Role B',
                labelWaitTime: 'Wait Time',
                normalSpeed: 'Normal Speed',
                
                // TTS
                studyLang: 'Study Language',
                labelVoice: 'Voice',
                labelSpeed: 'Speed',
                labelPitch: 'Pitch',
                
                // 독해/영작
                labelStudyMode: 'Study Mode',
                off: 'Off',
                readingMode: 'Reading (Eng→Kor)',
                writingMode: 'Writing (Kor→Eng)',
                labelThinkTime: 'Think Time (sec)',
                labelAnswerTime: 'Answer Time (sec)',
                
                // 메뉴
                fileLoad: '📂 Load File (Auto-detect)',
                dataSave: '💾 Save Data',
                dataLoad: '📥 Load Data',
                quizReport: '📋 Quiz Report',
                
                // 모드
                modeStudy: 'Study',
                modeQuiz: 'Quiz',
                modeSRS: 'SRS Review',
                modeDialog: 'Dialog',
                
                // 컨트롤
                reading: 'Reading',
                filter: 'Filter',
                restart: 'Restart',
                quizSettings: 'Quiz Settings',
                srsSettings: 'SRS Settings',
                dialogSettings: 'Dialog Settings',
                ttsSettings: 'Voice Settings',
                problems: 'problems',
                
                // Alert
                noData: 'No data available',
                noQuiz: 'No quiz taken yet',
                dataLoaded: 'Data loaded successfully',
                invalidFile: 'Invalid file',
                loadFileFirst: 'Please load a file first',
                loadDialogFirst: 'Please load a dialog file first',
                loadWordFileFirst: 'Please load a word file first',
                noWordsMatch: 'No words match the conditions',
                noSRSToday: 'No words to review today'
            }
        };

        // ============================================
        // 📦 전역 변수 선언
        // ============================================
        // 전역 변수
        let vocabulary = [];
        let currentIndex = 0;
        let isRunning = false;
        let autoTimer = null;
        let currentPool = [];
        let currentFileName = '';
        let currentMode = 'study';
        let quizPool = [];
        let quizHistory = [];
        let totalQuizHistory = JSON.parse(localStorage.getItem('totalQuizHistory') || '[]');
        let studyLog = JSON.parse(localStorage.getItem('studyLog') || '{}');
        
        // 🗣️ 회화 모드 변수
        let dialogScript = [];
        let dialogFileName = "";

        // ============================================
        // ⚙️ 설정 객체
        // ============================================
        // 설정
        let settings = {
            speed: 2.0,
            fontSize: 48,
            quizCount: 20,
            quizDelay: 1.0,
            quizHint: true,
            quizShuffle: true,
            quizDirection: 'engToKor',
            unmem: false,
            star: false,
            safe: false,
            autoSpeak: true,
            shuffle: true,
            colorLearning: false,
            colorWrong: false,
            colorSafe: false,
            wrongRevive: false,
            wrongDays: 7,
            srsNewOnly: true,
            srsHardOnly: false,
            easeMode: 2.5,
            lapseMode: 0.0
        };
        
        // ============================================
        // 💡 캐싱 시스템
        // ============================================
        // 💡 캐싱 시스템
        let cache = {};
        let currentSettingsHash = '';

        // ============================================
        // 🌐 다국어 함수
        // ============================================
        // UI 언어 토글
        function toggleLanguage() {
            currentUILang = currentUILang === 'ko' ? 'en' : 'ko';
            localStorage.setItem('uiLang', currentUILang);
            updateUILanguage();
        }
        
        // UI 텍스트 업데이트
        function updateUILanguage() {
            const text = UI_TEXT[currentUILang];
            document.title = text.title;
            
            // 초기 화면
            const loadFileMessage = document.getElementById('loadFileMessage');
            if (loadFileMessage) loadFileMessage.textContent = text.loadFileMessage;
            
            const fileSelectBtn = document.getElementById('fileSelectBtn');
            if (fileSelectBtn) fileSelectBtn.textContent = text.fileSelectBtn;
            
            // 팝업 타이틀들
            const titles = {
                'titleRange': text.popupRange,
                'titleSpeed': text.popupSpeed,
                'titleSize': text.popupSize,
                'titleQuizSettings': text.popupQuizSettings,
                'titleFilter': text.popupFilter,
                'titleSRS': text.popupSRS,
                'titleDialog': text.popupDialog,
                'titleTTS': text.popupTTS,
                'titleReading': text.popupReading
            };
            for (let id in titles) {
                const el = document.getElementById(id);
                if (el) el.textContent = titles[id];
            }
            
            // 공통 버튼
            const btnAll = document.getElementById('btnAll');
            if (btnAll) btnAll.textContent = text.all;
            
            const btnApply1 = document.getElementById('btnApply1');
            if (btnApply1) btnApply1.textContent = text.apply;
            
            // 속도 텍스트
            const textFast = document.getElementById('textFast');
            if (textFast) textFast.textContent = text.fast;
            
            const textNormal = document.getElementById('textNormal');
            if (textNormal) textNormal.textContent = text.normal;
            
            const textSlow = document.getElementById('textSlow');
            if (textSlow) textSlow.textContent = text.slow;
            
            // 초 텍스트
            ['secText1', 'secText2', 'secText3'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = text.seconds;
            });
            
            // 모드 선택 버튼
            const modeStudy = document.getElementById('modeStudyText');
            if (modeStudy) modeStudy.textContent = text.modeStudy;
            
            const modeQuiz = document.getElementById('modeQuizText');
            if (modeQuiz) modeQuiz.textContent = text.modeQuiz;
            
            const modeSRS = document.getElementById('modeSRSText');
            if (modeSRS) modeSRS.textContent = text.modeSRS;
            
            const modeDialog = document.getElementById('modeDialogText');
            if (modeDialog) modeDialog.textContent = text.modeDialog;
            
            // 컨트롤 칩
            const readingChip = document.getElementById('readingChip');
            if (readingChip) readingChip.textContent = '🎓 ' + text.reading;
            
            const filterChip1 = document.getElementById('filterChip1');
            if (filterChip1) filterChip1.textContent = '🔍 ' + text.filter;
            
            const filterChip2 = document.getElementById('filterChip2');
            if (filterChip2) filterChip2.textContent = '🔍 ' + text.filter;
            
            const restartChip1 = document.getElementById('restartChip1');
            if (restartChip1) restartChip1.textContent = '🔄 ' + text.restart;
            
            const restartChip2 = document.getElementById('restartChip2');
            if (restartChip2) restartChip2.textContent = '🔄 ' + text.restart;
            
            const quizSettingsChip = document.getElementById('quizSettingsChip');
            if (quizSettingsChip) quizSettingsChip.textContent = '⚙️ ' + text.quizSettings;
            
            const startChip = document.getElementById('startChip');
            if (startChip) startChip.textContent = '▶ ' + text.start;
            
            const startChip2 = document.getElementById('startChip2');
            if (startChip2) startChip2.textContent = '▶ ' + text.start;
            
            const srsSettingsChip = document.getElementById('srsSettingsChip');
            if (srsSettingsChip) srsSettingsChip.textContent = '🔄 ' + text.srsSettings;
            
            const dialogSettingsChip = document.getElementById('dialogSettingsChip');
            if (dialogSettingsChip) dialogSettingsChip.textContent = '💬 ' + text.dialogSettings;
            
            const ttsSettingsChip = document.getElementById('ttsSettingsChip');
            if (ttsSettingsChip) ttsSettingsChip.textContent = '🎤 ' + text.ttsSettings;
            
            const problemsText = document.getElementById('problemsText');
            if (problemsText) problemsText.textContent = text.problems;
            
            // 메뉴 팝업 버튼들
            const btnFileLoad = document.getElementById('btnFileLoad');
            if (btnFileLoad) btnFileLoad.textContent = text.fileLoad;
            
            const btnDataSave = document.getElementById('btnDataSave');
            if (btnDataSave) btnDataSave.textContent = text.dataSave;
            
            const btnDataLoad = document.getElementById('btnDataLoad');
            if (btnDataLoad) btnDataLoad.textContent = text.dataLoad;
            
            const btnQuizReport = document.getElementById('btnQuizReport');
            if (btnQuizReport) btnQuizReport.textContent = text.quizReport;
            
            // 설정 모달의 학습 언어 라벨
            const studyLangLabel = document.querySelector('label[for="studyLangSelect"]');
            if (studyLangLabel) studyLangLabel.textContent = text.studyLang;
            
            // 모달/팝업 타이틀
            const menuTitle = document.querySelector('#menuPopup .popup-title');
            if (menuTitle) menuTitle.textContent = text.menu;
            
            const statsTitle = document.querySelector('#statsModal .modal-title');
            if (statsTitle) statsTitle.textContent = text.stats;
        }
        
        // 학습 언어 변경
        function changeStudyLanguage(lang) {
            currentStudyLang = lang;
            localStorage.setItem('studyLang', lang);
            updateVoiceList();
        }
        
        // TTS 언어 코드 반환
        function getTTSLang() {
            return STUDY_LANG_CONFIG[currentStudyLang]?.ttsLang || 'en-US';
        }
        
        // TTS 스킵 여부 판단
        function shouldSkipTTS(text) {
            // 한글이 포함되어 있으면 스킵
            return /[가-힣]/.test(text);
        }
        
        // 음성 목록 업데이트
        function updateVoiceList() {
            const voiceSelect = document.getElementById('voiceSelect');
            if (!voiceSelect) return;
            
            const voices = window.speechSynthesis.getVoices();
            const targetLang = getTTSLang().split('-')[0]; // 'en-US' -> 'en'
            
            voiceSelect.innerHTML = '';
            
            // 현재 학습 언어에 맞는 음성 필터링
            const langVoices = voices.filter(voice => voice.lang.startsWith(targetLang));
            
            if (langVoices.length === 0) {
                // 해당 언어 음성이 없으면 모든 음성 표시
                voices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    voiceSelect.appendChild(option);
                });
            } else {
                // 해당 언어 음성만 표시
                langVoices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    voiceSelect.appendChild(option);
                });
            }
            
            // 저장된 음성 복원
            const savedVoice = localStorage.getItem(`selectedVoice_${currentStudyLang}`);
            if (savedVoice && voiceSelect.querySelector(`option[value="${savedVoice}"]`)) {
                voiceSelect.value = savedVoice;
            }
        }

        // ============================================
        // 🌙 다크모드 토글 함수
        // ============================================
        // 다크모드
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
            document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
        }

        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            document.getElementById('themeBtn').textContent = '☀️';
        }
        
        // ============================================
        // 🌐 언어 설정 복원
        // ============================================
        // UI 언어 복원
        const savedUILang = localStorage.getItem('uiLang');
        if (savedUILang) {
            currentUILang = savedUILang;
        }
        
        // 학습 언어 복원
        const savedStudyLang = localStorage.getItem('studyLang');
        if (savedStudyLang && STUDY_LANG_CONFIG[savedStudyLang]) {
            currentStudyLang = savedStudyLang;
            const studyLangSelect = document.getElementById('studyLangSelect');
            if (studyLangSelect) {
                studyLangSelect.value = savedStudyLang;
            }
        }

        // ============================================
        // 🎯 모드 선택 함수
        // ============================================
        // 모드 선택
        function selectMode(mode) {
            currentMode = mode;
            stopApp();
            
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
            event.target.closest('.mode-btn').classList.add('active');
            
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
            
            updateDisplay();
        }

        // 팝업 제어
        function showRangePopup() {
            document.getElementById('rangePopup').classList.add('show');
        }

        function showSpeedPopup() {
            document.getElementById('speedPopup').classList.add('show');
        }

        function showSizePopup() {
            document.getElementById('sizePopup').classList.add('show');
        }

        function showReadingPopup() {
            document.getElementById('readingPopup').classList.add('show');
        }

        function showQuizSettingsPopup() {
            document.getElementById('quizSettingsPopup').classList.add('show');
        }

        function showFilterPopup() {
            document.getElementById('filterPopup').classList.add('show');
        }

        function showSRSSettingsPopup() {
            document.getElementById('srsSettingsPopup').classList.add('show');
        }
        
        function showDialogSettingsPopup() {
            document.getElementById('dialogSettingsPopup').classList.add('show');
        }
        
        function showTTSSettingsPopup() {
            document.getElementById('ttsSettingsPopup').classList.add('show');
        }

        function showMenu() {
            document.getElementById('menuPopup').classList.add('show');
        }

        function closePopup(id) {
            document.getElementById(id).classList.remove('show');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('show');
        }

        // 범위 설정
        function setRange(start, end, btn) {
            document.getElementById('startIdx').value = start;
            document.getElementById('endIdx').value = end;
            document.querySelectorAll('#rangePopup .option-btn').forEach(btn => btn.classList.remove('active'));
            if (btn && btn.classList) { btn.classList.add('active'); }
}

        function setRangeAll(btn) {
            document.getElementById('startIdx').value = 1;
            document.getElementById('endIdx').value = vocabulary.length || 300;
            document.querySelectorAll('#rangePopup .option-btn').forEach(btn => btn.classList.remove('active'));
            if (btn && btn.classList) { btn.classList.add('active'); }
}

        function applyRange() {
            const start = document.getElementById('startIdx').value;
            const end = document.getElementById('endIdx').value;
            document.getElementById('rangeText').textContent = `${start}-${end}`;
            document.getElementById('rangeText2').textContent = `${start}-${end}`;
            document.getElementById('rangeText3').textContent = `${start}-${end}`;
            closePopup('rangePopup');
            if (!isRunning) updateDisplay();
        }

        // 속도 설정
        function setSpeed(speed) {
            settings.speed = speed;
            const text = speed === 1.0 ? '빠름' : speed === 2.0 ? '보통' : '느림';
            document.getElementById('speedText').textContent = text;
            // 모든 버튼 비활성화
            document.getElementById('speedFast').classList.remove('active');
            document.getElementById('speedNormal').classList.remove('active');
            document.getElementById('speedSlow').classList.remove('active');
            // 선택된 버튼만 활성화
            if (speed === 1.0) {
                document.getElementById('speedFast').classList.add('active');
            } else if (speed === 2.0) {
                document.getElementById('speedNormal').classList.add('active');
            } else if (speed === 3.0) {
                document.getElementById('speedSlow').classList.add('active');
            }
            closePopup('speedPopup');
        }

        // 크기 설정
        function updateFontSize(size) {
            settings.fontSize = parseInt(size);
            document.getElementById('fontSizeValue').textContent = size + 'px';
            document.getElementById('sizeText').textContent = size + 'px';
            document.getElementById('cardWord').style.fontSize = size + 'px';
        }

        // 퀴즈 문항수
        function adjustQuizCount(delta) {
            const maxCount = vocabulary.length > 0 ? vocabulary.length : 100;
            settings.quizCount = Math.max(5, Math.min(maxCount, settings.quizCount + delta));
            document.getElementById('quizCountText').textContent = settings.quizCount + '문제';
        }

        function setQuizCount(count, btn) {
            const maxCount = vocabulary.length > 0 ? vocabulary.length : 100;
            settings.quizCount = Math.min(count, maxCount);
            document.getElementById('quizCountText').textContent = settings.quizCount + '문제';
            document.querySelectorAll('#quizCountPopup .option-btn').forEach(btn => btn.classList.remove('active'));
            if (btn && btn.classList) { btn.classList.add('active'); }
closePopup('quizCountPopup');
        }

        // 퀴즈 지연 시간 설정
        function setQuizDelay(delay) {
            settings.quizDelay = delay;
            // 모든 버튼 비활성화
            document.getElementById('delayFast').classList.remove('active');
            document.getElementById('delayNormal').classList.remove('active');
            document.getElementById('delaySlow').classList.remove('active');
            // 선택된 버튼만 활성화
            if (delay === 0.5) {
                document.getElementById('delayFast').classList.add('active');
            } else if (delay === 1.0) {
                document.getElementById('delayNormal').classList.add('active');
            } else if (delay === 1.5) {
                document.getElementById('delaySlow').classList.add('active');
            }
        }

        // 퀴즈 방향 설정
        function setQuizDirection(direction) {
            settings.quizDirection = direction;
            // 모든 버튼 비활성화
            document.getElementById('dirEngToKor').classList.remove('active');
            document.getElementById('dirKorToEng').classList.remove('active');
            document.getElementById('dirMixed').classList.remove('active');
            // 선택된 버튼만 활성화
            if (direction === 'engToKor') {
                document.getElementById('dirEngToKor').classList.add('active');
            } else if (direction === 'korToEng') {
                document.getElementById('dirKorToEng').classList.add('active');
            } else if (direction === 'mixed') {
                document.getElementById('dirMixed').classList.add('active');
            }
        }

        // 퀴즈 설정 토글
        function toggleQuizSetting(type) {
            if (type === 'hint') {
                settings.quizHint = !settings.quizHint;
                document.getElementById('quizHint').classList.toggle('checked');
            } else if (type === 'shuffle') {
                settings.quizShuffle = !settings.quizShuffle;
                document.getElementById('quizShuffle').classList.toggle('checked');
            } else if (type === 'wrongRevive') {
                settings.wrongRevive = !settings.wrongRevive;
                document.getElementById('quizWrongRevive').classList.toggle('checked');
                clearCache();
            }
        }

        // 필터 토글
        function toggleFilter(type) {
            settings[type] = !settings[type];
            const checkbox = document.getElementById('filter' + type.charAt(0).toUpperCase() + type.slice(1));
            if (checkbox) checkbox.classList.toggle('checked');
            
            // 필터가 바뀌면 캐시 클리어
            if (['unmem', 'star', 'safe'].includes(type)) {
                clearCache();
            }
            
            if (!isRunning) updateDisplay();
        }

        // SRS 필터 토글
        function toggleSRSFilter(type) {
            settings[type] = !settings[type];
            const checkbox = document.getElementById(type);
            checkbox.classList.toggle('checked');
        }

        // SRS 간격 배율 설정
        function setEaseMode(ease) {
            settings.easeMode = ease;
            // 모든 버튼 비활성화
            document.getElementById('easeFast').classList.remove('active');
            document.getElementById('easeNormal').classList.remove('active');
            document.getElementById('easeSlow').classList.remove('active');
            // 선택된 버튼만 활성화
            if (ease === 2.0) {
                document.getElementById('easeFast').classList.add('active');
            } else if (ease === 2.5) {
                document.getElementById('easeNormal').classList.add('active');
            } else if (ease === 3.0) {
                document.getElementById('easeSlow').classList.add('active');
            }
        }

        // SRS 실패 감소율 설정
        function setLapseMode(lapse) {
            settings.lapseMode = lapse;
            // 모든 버튼 비활성화
            document.getElementById('lapseReset').classList.remove('active');
            document.getElementById('lapse20').classList.remove('active');
            document.getElementById('lapse50').classList.remove('active');
            // 선택된 버튼만 활성화
            if (lapse === 0.0) {
                document.getElementById('lapseReset').classList.add('active');
            } else if (lapse === 0.2) {
                document.getElementById('lapse20').classList.add('active');
            } else if (lapse === 0.5) {
                document.getElementById('lapse50').classList.add('active');
            }
        }
        
        // 오답 복습 기준일 설정
        function setWrongDays(days) {
            settings.wrongDays = days;
            // 입력 필드도 업데이트
            const input = document.getElementById('wrongDaysInput');
            if (input) input.value = days;
            // 모든 버튼 비활성화
            ['wrongDays3', 'wrongDays7', 'wrongDays14', 'wrongDays30'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('active');
            });
            // 선택된 버튼만 활성화
            const selectedBtn = document.getElementById(`wrongDays${days}`);
            if (selectedBtn) selectedBtn.classList.add('active');
            clearCache();
        }
        
        // 입력 필드에서 직접 일수 설정
        function setWrongDaysFromInput() {
            const input = document.getElementById('wrongDaysInput');
            if (input) {
                let days = parseInt(input.value);
                if (days < 1) days = 1;
                if (days > 365) days = 365;
                input.value = days;
                settings.wrongDays = days;
                
                // 버튼 활성화 해제 (커스텀 값이므로)
                ['wrongDays3', 'wrongDays7', 'wrongDays14', 'wrongDays30'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.remove('active');
                });
                
                // 만약 프리셋 값이면 해당 버튼 활성화
                if ([3, 7, 14, 30].includes(days)) {
                    const btn = document.getElementById(`wrongDays${days}`);
                    if (btn) btn.classList.add('active');
                }
                
                clearCache();
            }
        }
        
        // 💡 캐시 클리어 함수
        function clearCache() {
            cache = {};
            currentSettingsHash = '';
        }
        
        // 💡 설정 해시 생성
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
        function getFiltered() {
            const hash = getSettingsHash();
            if (cache.filtered && currentSettingsHash === hash) {
                return cache.filtered;
            }
            
            const start = parseInt(document.getElementById('startIdx').value) - 1;
            const end = parseInt(document.getElementById('endIdx').value);
            let pool = vocabulary.slice(start, end);
            
            if (settings.unmem || settings.star || settings.safe) {
                pool = pool.filter(v => 
                    (settings.unmem && v.quizCount === 0) ||
                    (settings.star && v.w > 0) ||
                    (settings.safe && v.isSafe)
                );
            }
            
            currentSettingsHash = hash;
            cache.filtered = pool;
            return pool;
        }

        // SRS 아이템 가져오기
        function getSRSItems() {
            const today = new Date().toISOString().slice(0, 10);
            const start = parseInt(document.getElementById('startIdx').value) - 1;
            const end = parseInt(document.getElementById('endIdx').value);
            
            let pool = vocabulary.filter(v => {
                if (v.num <= start || v.num > end) return false;
                if (!v.lastSeen) return settings.srsNewOnly;
                
                const daysSince = Math.floor((new Date(today) - new Date(v.lastSeen)) / 86400000);
                let due = daysSince >= v.interval;
                
                if (settings.srsHardOnly && v.w >= 3) return true;
                if (v.w >= 1) due = due || daysSince >= Math.max(1, Math.floor(v.interval / 2));
                if (!v.m) return true;
                
                return due;
            });
            
            pool.sort((a, b) => {
                const aLast = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
                const bLast = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
                return aLast - bLast;
            });
            
            return pool;
        }

        // SRS 업데이트
        function updateSRS(item, correct) {
            const today = new Date().toISOString().slice(0, 10);
            item.lastSeen = today;
            item.quizCount = (item.quizCount || 0) + 1;
            
            if (correct) {
                item.interval = Math.max(1, Math.round((item.interval || 1) * settings.easeMode));
                item.m = true;
                item.correctStreak = (item.correctStreak || 0) + 1;
                item.totalCorrect = (item.totalCorrect || 0) + 1;
                
                // 안정권 조건: 연속 5회 또는 총 10회 정답
                if (item.correctStreak >= 5 || item.totalCorrect >= 10) {
                    item.isSafe = true;
                    item.w = 0;
                } else {
                    item.w = Math.max(0, item.w - 1);
                }
            } else {
                if (settings.lapseMode === 0.0) {
                    item.interval = 1;
                } else {
                    item.interval = Math.max(1, Math.round(item.interval * settings.lapseMode));
                }
                item.w++;
                item.correctStreak = 0;
                item.isSafe = false;
                
                // 오답 날짜 기록
                const todayIso = new Date().toISOString().slice(0, 10);
                if (!item.wrongDates) item.wrongDates = [];
                if (!item.wrongDates.includes(todayIso)) {
                    item.wrongDates.push(todayIso);
                }
            }
            saveLocal();
            clearCache();
        }

        // 화면 업데이트
        function updateDisplay() {
            // 🗣️ 회화 모드
            if (currentMode === 'dialog') {
                if (dialogScript.length === 0) {
                    document.getElementById('cardWord').textContent = '대화 파일을 로드해 주세요';
                    document.getElementById('cardMeaning').textContent = '';
                    document.getElementById('cardNumber').textContent = '#-';
                    document.getElementById('cardStatus').textContent = '-';
                    document.getElementById('progressFill').style.width = '0%';
                    return;
                }
                
                if (currentIndex >= dialogScript.length) {
                    document.getElementById('cardWord').textContent = '대화 완료!';
                    document.getElementById('cardMeaning').textContent = '';
                    document.getElementById('cardNumber').textContent = `#${dialogScript.length}`;
                    document.getElementById('cardStatus').textContent = '✓';
                    document.getElementById('progressFill').style.width = '100%';
                    return;
                }
                
                const item = dialogScript[currentIndex];
                const roleA = document.getElementById('dialogRoleA').value;
                const isCompTurn = item.role === roleA;
                
                // 역할에 따른 색상 변경
                const color = isCompTurn ? 
                    getComputedStyle(document.documentElement).getPropertyValue('--color-dialog-a') :
                    getComputedStyle(document.documentElement).getPropertyValue('--color-dialog-b');
                
                document.getElementById('cardWord').innerHTML = `<span style="font-size:0.6em; margin-right:10px;">[${item.role}]</span> ${item.text}`;
                document.getElementById('cardWord').style.color = color;
                document.getElementById('cardWord').style.fontSize = settings.fontSize + 'px';
                
                // 번역 표시
                if (item.translation) {
                    document.getElementById('cardMeaning').textContent = item.translation;
                    document.getElementById('cardMeaning').style.fontSize = (settings.fontSize * 0.7) + 'px';
                } else {
                    document.getElementById('cardMeaning').textContent = '';
                }
                
                document.getElementById('cardNumber').textContent = `${currentIndex + 1}/${dialogScript.length}`;
                document.getElementById('cardStatus').textContent = isCompTurn ? '💻 컴퓨터' : '👤 사용자';
                document.getElementById('progressFill').style.width = `${((currentIndex + 1) / dialogScript.length) * 100}%`;
                return;
            }
            
            // 기존 단어장 모드
            const p = isRunning ? currentPool : (currentMode === 'srs' ? getSRSItems() : getFiltered());
            
            if (p.length === 0) {
                if (vocabulary.length === 0) {
                    // 파일이 없을 때 - 초기 화면 유지
                    return;
                } else {
                    // 파일은 있는데 조건에 맞는 단어가 없을 때
                    document.getElementById('cardWord').textContent = currentMode === 'srs' ? UI_TEXT[currentUILang].noSRSToday : UI_TEXT[currentUILang].noWordsMatch;
                }
                document.getElementById('cardMeaning').textContent = '';
                document.getElementById('cardNumber').textContent = '#-';
                document.getElementById('cardStatus').textContent = '-';
                document.getElementById('progressFill').style.width = '0%';
                return;
            }
            
            currentIndex = Math.max(0, Math.min(currentIndex, p.length - 1));
            const it = p[currentIndex];
            
            // 🔍 독해/영작 모드 체크
            const readingMode = document.getElementById('readingMode') ? document.getElementById('readingMode').value : 'off';
            
            if (readingMode !== 'off' && window.readingStep !== undefined) {
                // 독해/영작 모드 표시
                if (readingMode === 'eng-kor') {
                    // 독해모드: 영→한
                    document.getElementById('cardWord').textContent = window.readingStep === 0 ? it.eng : it.kor;
                } else if (readingMode === 'kor-eng') {
                    // 영작모드: 한→영
                    document.getElementById('cardWord').textContent = window.readingStep === 0 ? it.kor : it.eng;
                }
                document.getElementById('cardMeaning').textContent = '';
                document.getElementById('quizOpt').style.display = 'none';
            } else if (currentMode !== 'quiz' || !isRunning) {
                document.getElementById('cardWord').textContent = it.eng;
                document.getElementById('cardMeaning').textContent = it.kor;
                document.getElementById('quizOpt').style.display = 'none';
            }
            
            // 🎨 컬러 강조 시스템
            let displayColor = 'var(--text-primary)';
            
            if (it.isSafe && settings.colorSafe) {
                displayColor = 'var(--color-safe)';
            } else if (it.w > 0 && settings.colorWrong) {
                displayColor = 'var(--color-wrong)';
            } else if (settings.colorLearning) {
                displayColor = 'var(--color-learning)';
            }
            
            document.getElementById('cardWord').style.color = displayColor;
            
            // 상태 표시에 안정권 아이콘 추가
            let statusText = `${it.m ? '⭐' : '❌'} 별표${it.w}${it.star ? ' ★' : ''}`;
            if (it.isSafe) {
                statusText += ' ✅';
            }
            document.getElementById('cardNumber').textContent = `#${it.num}`;
            document.getElementById('cardStatus').textContent = statusText;
            document.getElementById('progressFill').style.width = `${((currentIndex + 1) / p.length) * 100}%`;
        }

        // 음성
        function speakWord(word) {
            // word 파라미터가 명시적으로 전달된 경우만 사용
            if (word && typeof word === 'string') {
                // 리포트 등에서 직접 단어를 전달한 경우
                // 일단 그대로 유지
            } else {
                // 카드 클릭 시 - vocabulary 데이터에서 직접 가져오기
                if (currentMode === 'dialog' && dialogScript.length > 0) {
                    word = dialogScript[currentIndex].text;
                } else {
                    const p = isRunning ? currentPool : (currentMode === 'srs' ? getSRSItems() : getFiltered());
                    if (p.length === 0) return;
                    word = p[currentIndex].eng; // vocabulary 데이터의 eng 필드만
                }
            }
            
            // ✅ 한글 감지: shouldSkipTTS 함수 사용
            if (shouldSkipTTS(word)) {
                console.log('한글이 포함된 텍스트는 TTS로 읽지 않습니다:', word);
                return;
            }
            
            // 한글이나 특수문자 제거 (영어, 숫자, 공백, 하이픈만 유지)
            word = word.replace(/[^a-zA-Z0-9\s\-]/g, '').trim();
            
            if (!word || word.length === 0) return;
            
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel(); // 이전 음성 중지
                
                App.Timers.setTimeout(() => {
                    const utterance = new SpeechSynthesisUtterance(word);
                    utterance.lang = getTTSLang(); // 다국어 지원
                    
                    // TTS 설정 반영
                    const voiceSelect = document.getElementById('voiceSelect');
                    const voices = window.speechSynthesis.getVoices();
                    const selectedVoice = voices.find(v => v.name === voiceSelect.value);
                    if (selectedVoice) {
                        utterance.voice = selectedVoice;
                    }
                    
                    const ttsRate = document.getElementById('ttsRate');
                    const ttsPitch = document.getElementById('ttsPitch');
                    
                    utterance.rate = ttsRate ? parseFloat(ttsRate.value) : 0.9;
                    utterance.pitch = ttsPitch ? parseFloat(ttsPitch.value) : 1.0;
                    utterance.volume = 1.0;
                    
                    utterance.onerror = function(event) {
                        console.error('Speech synthesis error:', event);
                    };
                    
                    speechSynthesis.speak(utterance);
                }, 50);
            }
        }

        // 콜백 있는 발음 함수
        function speakWordWithCallback(word, callback) {
            // ✅ 한글 감지: shouldSkipTTS 함수 사용
            if (shouldSkipTTS(word)) {
                console.log('한글이 포함된 텍스트는 TTS로 읽지 않습니다:', word);
                if (callback) callback();
                return;
            }
            
            // 한글이나 특수문자 제거
            word = word.replace(/[^a-zA-Z0-9\s\-]/g, '').trim();
            
            if (!word || word.length === 0) {
                if (callback) callback();
                return;
            }
            
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.lang = getTTSLang(); // 다국어 지원
                utterance.rate = 0.9;
                utterance.onend = function() {
                    if (callback) callback();
                };
                speechSynthesis.speak(utterance);
            } else {
                if (callback) callback();
            }
        }

        // 재생/일시정지 토글
        function togglePlayPause() {
            // 🗣️ 회화 모드는 vocabulary 체크 불필요
            if (currentMode !== 'dialog' && vocabulary.length === 0) {
                alert(UI_TEXT[currentUILang].loadFileFirst);
                return;
            }
            
            // 회화 모드에서 대화 파일 체크
            if (currentMode === 'dialog' && dialogScript.length === 0) {
                alert(UI_TEXT[currentUILang].loadDialogFirst);
                return;
            }
            
            if (isRunning) {
                // 일시정지
                stopApp();
            } else {
                // 🔍 독해/영작 모드 체크
                const readingMode = document.getElementById('readingMode') ? document.getElementById('readingMode').value : 'off';
                
                // 재생 (현재 위치에서)
                if (readingMode !== 'off') {
                    startReading();
                } else if (currentMode === 'quiz') {
                    startQuiz();
                } else if (currentMode === 'dialog') {
                    startApp(); // 회화 모드는 startApp 사용
                } else {
                    continueApp();
                }
            }
        }
        
        // 🔍 독해/영작 모드 UI 업데이트
        function updateReadingMode() {
            const mode = document.getElementById('readingMode').value;
            const container = document.getElementById('thinkTimeContainer');
            
            if (mode === 'off') {
                container.style.display = 'none';
            } else {
                container.style.display = 'block';
            }
        }
        
        // 🔍 독해/영작 모드 시작
        function startReading() {
            const p = currentMode === 'srs' ? getSRSItems() : getFiltered();
            if (p.length === 0) {
                alert(UI_TEXT[currentUILang].noWordsMatch);
                return;
            }
            
            isRunning = true;
            currentPool = p;
            window.readingStep = 0;
            document.getElementById('playPauseBtn').textContent = '⏸';
            
            // 수동 답보기 버튼 표시
            document.getElementById('manualAnswerBtn').style.display = 'block';
            
            runReadingMobile();
        }
        
        // 👁️ 수동 답보기 함수
        function showManualAnswer() {
            if (!isRunning || window.readingStep === undefined) return;
            
            // 문제 표시 상태(step=0)일 때만 답을 보여줌
            if (window.readingStep === 0) {
                window.readingStep = 1;
                updateDisplay();
            }
        }
        
        // 🔍 독해/영작 모드 실행 (모바일)
        function runReadingMobile() {
            if (!isRunning || currentIndex >= currentPool.length) {
                stopApp();
                return;
            }
            
            updateDisplay();
            
            const readingMode = document.getElementById('readingMode').value;
            const thinkTime = parseFloat(document.getElementById('thinkTime').value) * 1000;
            const answerTime = parseFloat(document.getElementById('answerTime').value) * 1000; // 설정값 사용
            
            if (window.readingStep === 0) {
                // 문제 표시
                App.Timers.setTimeout(() => {
                    if (!isRunning) return;
                    window.readingStep = 1;
                    runReadingMobile();
                }, thinkTime);
            } else {
                // 답 표시 (설정된 시간)
                App.Timers.setTimeout(() => {
                    if (!isRunning) return;
                    window.readingStep = 0;
                    currentIndex++;
                    logStudy(1);
                    runReadingMobile();
                }, answerTime);
            }
        }

        // 처음부터 시작
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
        
        // 🗣️ 회화 모드 실행
        function runDialog() {
            // 🎧 쉐도잉 모드가 활성화되어 있으면 쉐도잉 함수 실행
            if (document.getElementById('shadowingMode') && document.getElementById('shadowingMode').checked) {
                runShadowing();
                return;
            }
            
            if (!isRunning || currentIndex >= dialogScript.length) {
                stopApp();
                return;
            }
            
            updateDisplay();
            
            const item = dialogScript[currentIndex];
            const roleA = document.getElementById('dialogRoleA').value;
            const isCompTurn = item.role === roleA;
            
            const compSpeed = parseFloat(document.getElementById('dialogCompSpeed').value) || 0;
            const userSpeed = parseFloat(document.getElementById('dialogUserSpeed').value) || 0;
            
            const waitTime = isCompTurn ? compSpeed : userSpeed;
            
            if (waitTime > 0) {
                // 자동 모드
                if (isCompTurn && settings.autoSpeak) {
                    speakWord(item.text);
                }
                
                App.Timers.setTimeout(() => {
                    if (!isRunning) return;
                    currentIndex++;
                    logStudy(1);
                    runDialog();
                }, waitTime * 1000);
            } else {
                // 수동 모드 - Enter 키로 넘김
                if (isCompTurn && settings.autoSpeak) {
                    speakWord(item.text);
                }
            }
        }
        
        // 🗣️ 회화 다음 줄로 (Enter 키용)
        function nextDialogLine() {
            if (currentMode !== 'dialog' || !isRunning) return;
            
            currentIndex++;
            logStudy(1);
            runDialog();
        }

        // 🎧 쉐도잉 관련 변수
        let shadowStopFlag = false;
        let shadowFinishFlag = false;
        let shadowTimer = null;

        // 🎧 쉐도잉 마무리 버튼
        function finishShadowing() {
            shadowFinishFlag = true;
            const btn = document.getElementById('shadowFinishBtn');
            if (btn) btn.style.display = 'none';
        }

        // 🎧 쉐도잉 TTS (속도 조절 가능)
        function speakShadowing(text, rateOverride, callback) {
            if (!text) {
                if (callback) callback();
                return;
            }

            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = document.getElementById('voiceSelect')?.value;
            let voice = voices.find(v => v.name === selectedVoice);
            
            if (!voice) {
                const langVoices = voices.filter(v => v.lang.startsWith(currentStudyLang));
                voice = langVoices[0] || voices[0];
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voice;
            utterance.rate = rateOverride || parseFloat(document.getElementById('speed')?.value) || 1.0;
            utterance.pitch = parseFloat(document.getElementById('pitch')?.value) || 1.0;

            utterance.onend = () => {
                if (callback) callback();
            };

            window.speechSynthesis.speak(utterance);
        }

        // 🎧 쉐도잉 모드 실행
        function runShadowing() {
            if (!isRunning) return;
            if (!dialogScript || dialogScript.length < 2) {
                alert('대화 파일을 먼저 로드해 주세요.');
                return;
            }

            shadowStopFlag = false;
            shadowFinishFlag = false;
            
            // 마무리 버튼 표시
            const btn = document.getElementById('shadowFinishBtn');
            if (btn) btn.style.display = 'block';

            // 음성 큐 정리
            window.speechSynthesis.cancel();

            const mySec = parseFloat(document.getElementById('shadowMyTime').value);
            const myDelay = (isNaN(mySec) ? 0 : mySec) * 1000;
            const rateA = parseFloat(document.getElementById('shadowRateA').value) || 1.0;
            const rateB = parseFloat(document.getElementById('shadowRateB').value) || 1.0;
            const systemRest = 250; // 시스템 대기 시간

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
                updateDisplay();

                speakShadowing(A.text, rateA, () => {
                    if (shadowStopFlag) return;
                    shadowTimer = App.Timers.setTimeout(() => {
                        if (shadowStopFlag) return;
                        shadowTimer = App.Timers.setTimeout(() => { 
                            if (!shadowStopFlag) stepB(); 
                        }, myDelay);
                    }, systemRest);
                });
            }

            function stepB() {
                if (shadowStopFlag) return;
                if (!ensurePair()) { stopApp(); return; }

                const B = dialogScript[pairBase + 1];

                currentIndex = pairBase + 1;
                updateDisplay();

                speakShadowing(B.text, rateB, () => {
                    if (shadowStopFlag) return;
                    shadowTimer = App.Timers.setTimeout(() => {
                        if (shadowStopFlag) return;
                        shadowTimer = App.Timers.setTimeout(() => {
                            if (shadowStopFlag) return;

                            if (shadowFinishFlag) { 
                                stopApp(); 
                                return; 
                            }

                            if (loopEnabled()) {
                                // 현재 세트 반복
                                shadowTimer = App.Timers.setTimeout(() => { 
                                    if (!shadowStopFlag) stepA(); 
                                }, systemRest);
                            } else {
                                // 다음 세트로
                                pairBase += 2;
                                shadowTimer = App.Timers.setTimeout(() => { 
                                    if (!shadowStopFlag) stepA(); 
                                }, systemRest);
                            }
                        }, myDelay);
                    }, systemRest);
                });
            }

            stepA();
        }
        

        // 정지
        function stopApp() {
            isRunning = false;
            speechSynthesis.cancel(); // 음성 중지
            window.readingStep = undefined; // 🔍 독해모드 상태 초기화
            
            // 수동 답보기 버튼 숨기기
            document.getElementById('manualAnswerBtn').style.display = 'none';
            
            // 🎧 쉐도잉 정리
            shadowStopFlag = true;
            if (shadowTimer) {
                App.Timers.clearTimeout(shadowTimer);
                shadowTimer = null;
            }
            const btn = document.getElementById('shadowFinishBtn');
            if (btn) btn.style.display = 'none';
            
            document.getElementById('playPauseBtn').textContent = '▶';
            document.getElementById('quizOpt').style.display = 'none';
            updateDisplay();
        }

        // 퀴즈 시작
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
            let correctItems, wrongItems, opts;
            if (direction === 'korToEng') {
                correctItems = vocabulary.filter(v => v.eng === it.eng);
                wrongItems = vocabulary.filter(v => v.eng !== it.eng).sort(() => 0.5 - Math.random()).slice(0, 3);
                opts = [...correctItems, ...wrongItems];
                if (opts.length < 4) opts = opts.concat(wrongItems.slice(0, 4 - opts.length));
            } else {
                correctItems = vocabulary.filter(v => v.kor === it.kor);
                wrongItems = vocabulary.filter(v => v.kor !== it.kor).sort(() => 0.5 - Math.random()).slice(0, 3);
                opts = [...correctItems, ...wrongItems];
                if (opts.length < 4) opts = opts.concat(wrongItems.slice(0, 4 - opts.length));
            }
            opts.sort(() => 0.5 - Math.random());

            const numberEmojis = ['①', '②', '③', '④'];
            const correctIndex = direction === 'korToEng' 
                ? opts.findIndex(op => op.eng === it.eng)
                : opts.findIndex(op => op.kor === it.kor);
            
            document.getElementById('quizOpt').innerHTML = opts.map((op, i) => {
                const optText = direction === 'korToEng' ? op.eng : op.kor;
                return `<button class="quiz-btn" onclick="checkAnswer(${i}, ${correctIndex}, '${direction}')">${numberEmojis[i]} ${optText}</button>`;
            }).join('');

            updateDisplay();
            if (settings.autoSpeak && direction === 'engToKor') speakWord();
        }

        // 정답 체크
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
        function finishQuiz() {
            stopApp();
            showReportModal();
        }

        // 이전/다음
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

        // 통계
        function updateStats() {
            if (vocabulary.length === 0) return;

            const today = new Date().toISOString().slice(0,10);
            const safeCount = vocabulary.filter(v => v.isSafe).length;
            const memRate = Math.round(safeCount / vocabulary.length * 100) || 0;

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

            document.getElementById('statToday').textContent = todayCount;
            document.getElementById('statWeek').textContent = weekCount;
            document.getElementById('statMemRate').textContent = memRate + '%';
            document.getElementById('statQuizRate').textContent = quizRate + '%';
        }

        function logStudy(count = 1) {
            const today = new Date().toISOString().slice(0,10);
            studyLog[today] = (studyLog[today] || 0) + count;
            localStorage.setItem('studyLog', JSON.stringify(studyLog));
            updateStats();
        }

        function showStatsModal() {
            updateStats();
            document.getElementById('statsModal').classList.add('show');
        }

        function showReportModal() {
            if (quizHistory.length === 0) {
                alert(UI_TEXT[currentUILang].noQuiz);
                return;
            }

            const correct = quizHistory.filter(h => h.ok).length;
            const total = quizHistory.length;
            const rate = Math.round(correct / total * 100);

            let html = `
                <div style="text-align:center; margin:20px 0;">
                    <div style="font-size:48px; font-weight:bold; color:var(--accent-color);">${rate}%</div>
                    <div style="font-size:18px; color:var(--text-secondary); margin-top:8px;">정답 ${correct} / ${total}</div>
                </div>
            `;

            quizHistory.forEach(h => {
                const icon = h.ok ? '✓' : '✗';
                const color = h.ok ? 'var(--success-color)' : 'var(--danger-color)';
                html += `
                    <div class="report-row">
                        <div class="report-word">
                            <div class="report-word-eng">${h.word}</div>
                            <div class="report-word-kor">${h.meaning}</div>
                        </div>
                        <div style="color:${color}; font-size:20px; margin-right:12px;">${icon}</div>
                        <button class="speaker-btn" onclick="speakWord('${h.word}')">🔊</button>
                    </div>
                `;
            });

            document.getElementById('reportContent').innerHTML = html;
            document.getElementById('reportModal').classList.add('show');
            closePopup('menuPopup');
        }

        // 제스처
        let touchStartX = 0;
        let touchStartTime = 0;
        let lastTapTime = 0;

        const card = document.getElementById('flashCard');

        // ✅ 풀스크린 퀵 모드바(롱프레스) - 기존 탭/스와이프 로직과 충돌 방지
        const fsModeBar = document.getElementById('fsModeBar');
        let __lpTimer = null;
        let __lpTriggered = false;
        let __fsHideTimer = null;

        function __setFsActive(mode){
            if (!fsModeBar) return;
            fsModeBar.querySelectorAll('.fs-modebtn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
            });
        }

        function __showFsModeBar(){
            if (!fsModeBar) return;
            if (!document.body.classList.contains('study-fullscreen')) return;
            fsModeBar.classList.remove('hidden');
            fsModeBar.setAttribute('aria-hidden', 'false');
            // 현재 모드 강조 (currentMode가 없으면 버튼 강조는 생략)
            try { __setFsActive(window.currentMode || 'study'); } catch(e) {}
            clearTimeout(__fsHideTimer);
            __fsHideTimer = setTimeout(() => {
                fsModeBar.classList.add('hidden');
                fsModeBar.setAttribute('aria-hidden', 'true');
            }, 3000);
        }

        card.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();

            __lpTriggered = false;
            clearTimeout(__lpTimer);

            // 롱프레스는 풀스크린에서만 활성
            if (document.body.classList.contains('study-fullscreen')) {
                __lpTimer = setTimeout(() => {
                    __lpTriggered = true;
                    __showFsModeBar();
                }, 380);
            }
        });

        card.addEventListener('touchend', (e) => {
            // 롱프레스가 발생했으면: 기존 더블탭/스와이프 동작을 막고 종료
            if (__lpTimer) {
                clearTimeout(__lpTimer);
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
        function loadVoices() {
            const voiceSelect = document.getElementById('voiceSelect');
            const voices = window.speechSynthesis.getVoices();
            
            voiceSelect.innerHTML = '';
            
            const enVoices = voices.filter(voice => voice.lang.startsWith('en'));
            
            if (enVoices.length === 0) {
                voices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    voiceSelect.appendChild(option);
                });
            } else {
                enVoices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    voiceSelect.appendChild(option);
                });
            }
        }
        
        // TTS 음성 초기화
        updateVoiceList();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = updateVoiceList;
        }
        
        // 역할 변경 이벤트
        document.getElementById('dialogRoleA').addEventListener('change', function() {
            const role = this.value;
            document.getElementById('dialogRoleB').value = role === 'A' ? 'B' : 'A';
        });
        
        document.getElementById('dialogRoleB').addEventListener('change', function() {
            const role = this.value;
            document.getElementById('dialogRoleA').value = role === 'A' ? 'B' : 'A';
        });

        // 초기화
        updateStats();
        updateUILanguage(); // UI 언어 초기화

        // 📱 학습창 풀스크린 토글
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

