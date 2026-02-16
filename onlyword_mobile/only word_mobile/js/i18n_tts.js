/* =========================================================
 * I18N + Study Language + TTS Lang helpers
 * Generated: 2026-02-10 20:55:40
 * Notes:
 * - This file is part of the "split/annotated" refactor.
 * - Functions/variables are kept global (non-module) to avoid breaking behavior.
 * ========================================================= */


// ---------------------------------------------------------
// toggleLanguage
// ---------------------------------------------------------

        function toggleLanguage() {
            currentUILang = currentUILang === 'ko' ? 'en' : 'ko';
            localStorage.setItem('uiLang', currentUILang);
            updateUILanguage();
        }
        
        // UI 텍스트 업데이트
// ---------------------------------------------------------
// updateUILanguage
// ---------------------------------------------------------

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
// ---------------------------------------------------------
// changeStudyLanguage
// ---------------------------------------------------------

        function changeStudyLanguage(lang) {
            currentStudyLang = lang;
            localStorage.setItem('studyLang', lang);
            updateVoiceList();
        }
        
        // TTS 언어 코드 반환
// ---------------------------------------------------------
// getTTSLang
// ---------------------------------------------------------

        function getTTSLang() {
            return STUDY_LANG_CONFIG[currentStudyLang]?.ttsLang || 'en-US';
        }
        
        // TTS 스킵 여부 판단
// ---------------------------------------------------------
// shouldSkipTTS
// ---------------------------------------------------------

        function shouldSkipTTS(text) {
            // 한글이 포함되어 있으면 스킵
            return /[가-힣]/.test(text);
        }
        
        // 음성 목록 업데이트