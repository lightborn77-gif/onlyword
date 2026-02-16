/* =========================================================
 * I18N Data (ui/study language config + translations)
 * Refactor: split from legacy/app_core.js
 * Generated: 2026-02-11 12:24:12
 * ========================================================= */

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
