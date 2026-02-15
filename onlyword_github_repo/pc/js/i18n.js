const UI_TEXT = window.UI_TEXT || {};
        const I18N = {
            current: 'ko',
            bundle() { return UI_TEXT[this.current] || UI_TEXT.ko; },
            set(lang) {
                if (!UI_TEXT[lang]) return;
                this.current = lang;
                Storage.set('uiLang', lang);
                this.update();
            },
            toggle() { this.set(this.current === 'ko' ? 'en' : 'ko'); },
            init() {
                const saved = Storage.get('uiLang');
                if (saved && UI_TEXT[saved]) this.current = saved;
                this.update();
            },
            update() {
                document.body.setAttribute('data-ui-lang', this.current);
                applyUILanguage();
            }
        };

// UI 언어 토글 함수
        function toggleLanguage() {
            I18N.toggle();
        }
        // UI 텍스트 업데이트
        function applyUILanguage() {
            // keep CSS language toggles in sync
            try { document.body.setAttribute('data-ui-lang', I18N.current); } catch(e) {}

            const t = I18N.bundle();
            
            // === 헤더 & 제목 ===
            const headerTitle = document.getElementById('headerTitle');
            if (headerTitle) headerTitle.textContent = t.title;
            
            const statsToggle = document.getElementById('statsToggle');
            if (statsToggle) statsToggle.textContent = t.stats_toggle;
            
            // === 통계 라벨 ===
            const statLabels = {
                'label_today': document.getElementById('label_today'),
                'label_week': document.getElementById('label_week'),
                'label_safe_rate': document.getElementById('label_safe_rate'),
                'label_quiz_rate': document.getElementById('label_quiz_rate'),
                'label_streak': document.getElementById('label_streak'),
                'label_week_chart': document.getElementById('label_week_chart'),
                'label_top_wrong': document.getElementById('label_top_wrong')
            };
            Object.keys(statLabels).forEach(key => {
                if (statLabels[key]) statLabels[key].textContent = t[key];
            });
            
            // === 설정 표시 라벨 ===
            const settingsDisplayLabel = document.getElementById('label_settings_display');
            if (settingsDisplayLabel) settingsDisplayLabel.textContent = t.label_settings_display;
            
            const settingLabels = {
                'label_basic_settings': document.getElementById('label_basic_settings'),
                'label_flicker': document.getElementById('label_flicker'),
                'label_reading_writing': document.getElementById('label_reading_writing'),
                'label_quiz_mode': document.getElementById('label_quiz_mode'),
                'label_srs_mode': document.getElementById('label_srs_mode'),
                'label_dialog_mode': document.getElementById('label_dialog_mode'),
                'label_shadowing': document.getElementById('label_shadowing')
            };
            Object.keys(settingLabels).forEach(key => {
                if (settingLabels[key]) settingLabels[key].textContent = t[key];
            });
            
            // === 메인 버튼들 ===
            const btnMap = {
                'btn_load_file': document.querySelector('button[onclick*="fileInput"]'),
                'btn_save': document.querySelector('button[onclick="exportData()"]'),
                'btn_load': document.querySelector('button[onclick*="importInput"]'),
                'btn_prev': document.querySelector('button[onclick="prevCard()"]'),
                'btn_restart': document.querySelector('button[onclick*="currentIndex=0"]'),
                'btn_view_all': document.querySelector('button[onclick="openListView()"]'),
                'btn_next': document.querySelector('button[onclick="nextCard()"]'),
                'btn_memorized': document.querySelector('button[onclick="toggleMem()"]')
            };
            Object.keys(btnMap).forEach(key => {
                if (btnMap[key]) btnMap[key].textContent = t[key];
            });
            
            // 시작/정지 버튼
            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            if (startBtn) startBtn.textContent = t.btn_start;
            if (stopBtn) stopBtn.textContent = t.btn_stop;
            
            // === 기본 설정 라벨 ===
            const basicLabels = {
                'label_range': document.querySelector('label[for="startIdx"]'),
                'label_untested': document.querySelector('label[for="unmemOnly"]'),
                'label_marked': document.querySelector('label[for="wrongOnly"]'),
                'label_safe': document.querySelector('label[for="starOnly"]'),
                'label_flicker_speed': document.querySelector('label[for="wordSpeed"]'),
                'label_font_size': document.querySelector('label[for="fontSize"]')
            };
            
            // === 공통 라벨 업데이트 (간단한 방식) ===
            document.querySelectorAll('label').forEach(label => {
                const text = label.textContent.trim();
                
                // 자동 발음
                if (text === '자동 발음' || text === 'Auto Speech') 
                    label.textContent = t.label_auto_speak;
                
                // 속도/피치
                else if (text === '속도:' || text === 'Speed:') 
                    label.textContent = t.label_speed;
                else if (text === '피치:' || text === 'Pitch:') 
                    label.textContent = t.label_pitch;
                
                // 범위
                else if (text === '범위:' || text === 'Range:') 
                    label.textContent = t.label_range;
                
                // 필터
                else if (text === '미테스트' || text === 'Untested') 
                    label.textContent = t.label_untested;
                else if (text === '별표' || text === 'Marked') 
                    label.textContent = t.label_marked;
                else if (text === '안정권' || text === 'Safe') 
                    label.textContent = t.label_safe;
                
                // 컬러
                else if (text === '학습 중' || text === 'Learning') 
                    label.textContent = t.label_learning;
                
                // 깜박이
                else if (text === '깜빡이 속도:' || text === 'Flicker Speed:') 
                    label.textContent = t.label_flicker_speed;
                else if (text === '크기:' || text === 'Size:') 
                    label.textContent = t.label_font_size;
                
                // 독해/영작
                else if (text === '모드:' || text === 'Mode:') 
                    label.textContent = t.label_mode;
                else if (text === '생각시간:' || text === 'Think Time:') 
                    label.textContent = t.label_think_time;
                else if (text === '답보는시간:' || text === 'Answer Time:') 
                    label.textContent = t.label_answer_time;
                
                // 퀴즈
                else if (text === '방향:' || text === 'Direction:') 
                    label.textContent = t.label_direction;
                else if (text === '영한' || text === 'EN→KR') 
                    label.textContent = t.label_eng_kor;
                else if (text === '한영' || text === 'KR→EN') 
                    label.textContent = t.label_kor_eng;
                else if (text === '혼합' || text === 'Mixed') 
                    label.textContent = t.label_mixed;
                else if (text === '문항수:' || text === 'Questions:') 
                    label.textContent = t.label_question_count;
                else if (text === '오답대기:' || text === 'Wrong Delay:') 
                    label.textContent = t.label_wrong_delay;
                else if (text === '섞기' || text === 'Shuffle') 
                    label.textContent = t.label_shuffle;
                else if (text === '정답표시' || text === 'Show Answer') 
                    label.textContent = t.label_hint;
                else if (text === '포함' || text === 'Include') 
                    label.textContent = t.label_include;
                else if (text === '기준일:' || text === 'Days:') 
                    label.textContent = t.label_criterion_days;
                else if (text === '일 전' || text === 'days ago') 
                    label.textContent = t.label_days_ago;
                
                // SRS
                else if (text === '새 단어 포함' || text === 'Include New') 
                    label.textContent = t.label_new_words;
                else if (text === '어려운 단어 우선' || text === 'Hard First') 
                    label.textContent = t.label_hard_words;
                else if (text === '간격 배율:' || text === 'Interval:') 
                    label.textContent = t.label_interval_multiplier;
                else if (text === '실패 시 감소:' || text === 'Fail Penalty:') 
                    label.textContent = t.label_fail_decrease;
                
                // 회화
                else if (text === 'AB 동시 표시' || text === 'Show Both AB') 
                    label.textContent = t.label_show_both;
                else if (text === 'A 역할 (컴):' || text === 'Role A (PC):') 
                    label.textContent = t.label_role_a;
                else if (text === 'B 역할 (나):' || text === 'Role B (Me):') 
                    label.textContent = t.label_role_b;
                else if (text === '컴퓨터 대기:' || text === 'PC Wait:') 
                    label.textContent = t.label_comp_wait;
                else if (text === '내 읽기 시간:' || text === 'My Time:') 
                    label.textContent = t.label_user_time;
                
                // 쉐도잉
                else if (text === '내 따라읽기 시간:' || text === 'My Repeat Time:') 
                    label.textContent = t.label_my_repeat_time;
                
                // 초 단위
                else if (text === '초' || text === 'sec') 
                    label.textContent = t.label_seconds;
            });
            
            // === Select 옵션들 ===
            const optElements = {
                'opt_off': document.getElementById('opt_off'),
                'opt_reading': document.getElementById('opt_reading'),
                'opt_writing': document.getElementById('opt_writing'),
                'opt_standard': document.getElementById('opt_standard'),
                'opt_fast': document.getElementById('opt_fast'),
                'opt_slow': document.getElementById('opt_slow'),
                'opt_custom': document.getElementById('opt_custom'),
                'opt_reset': document.getElementById('opt_reset'),
                'opt_keep20': document.getElementById('opt_keep20'),
                'opt_keep50': document.getElementById('opt_keep50')
            };
            Object.keys(optElements).forEach(key => {
                if (optElements[key]) optElements[key].textContent = t[key];
            });
            
            // === 특수 라벨들 (bold, 색상 등) ===
            const studyLangLabel = document.getElementById('label_study_lang');
            if (studyLangLabel) studyLangLabel.textContent = t.label_study_lang;
            
            const ttsLabels = document.querySelectorAll('label[style*="font-weight: bold"]');
            ttsLabels.forEach(label => {
                if (label.textContent.includes('TTS') || label.textContent.includes('🎤')) 
                    label.textContent = t.label_tts_settings;
                else if (label.textContent.includes('컬러') || label.textContent.includes('Color')) 
                    label.textContent = t.label_color_highlight;
                else if (label.textContent.includes('SRS')) 
                    label.textContent = t.label_srs_settings;
                else if (label.textContent.includes('별표 복습') || label.textContent.includes('Marked Review')) 
                    label.textContent = t.label_wrong_review;
            });
            
            // === 모달 텍스트 ===
            const modalTitleList = document.getElementById('modal_title_list');
            if (modalTitleList) modalTitleList.textContent = t.modal_title_list;
            
            const modalTitleReport = document.getElementById('modal_title_report');
            if (modalTitleReport) modalTitleReport.textContent = t.modal_title_report;
            
            const thElements = {
                'th_word': document.getElementById('th_word'),
                'th_answer': document.getElementById('th_answer'),
                'th_result': document.getElementById('th_result'),
                'th_speak': document.getElementById('th_speak')
            };
            Object.keys(thElements).forEach(key => {
                if (thElements[key]) thElements[key].textContent = t[key];
            });
            
            // === 상태 메시지 ===
            const stMsg = document.getElementById('stMsg');
            if (stMsg && (stMsg.textContent === '준비 완료' || stMsg.textContent === 'Ready')) {
                stMsg.textContent = t.status_ready;
            }
            
            // === 메인 디스플레이 ===
            const mainDisplay = document.getElementById('mainDisplay');
            if (mainDisplay && (mainDisplay.textContent === '파일을 선택해 주세요' || mainDisplay.textContent === 'Please select a file')) {
                mainDisplay.textContent = t.mainDisplay_default;
            }
        
            // ===== FIX: sections without IDs (Stats / SRS options / Dialog / Shadowing) =====

            // Stats toggle header (no #statsToggle in HTML)
            const statsHeader = document.querySelector('.toggle-header');
            if (statsHeader) statsHeader.textContent = t.stats_toggle;

            // Stats panel labels (no IDs)
            const _statLabels = document.querySelectorAll('#statsPanel .stat-label');
            if (_statLabels && _statLabels.length >= 5) {
                _statLabels[0].textContent = t.label_today;
                _statLabels[1].textContent = t.label_week;
                _statLabels[2].textContent = t.label_safe_rate;
                _statLabels[3].textContent = t.label_quiz_rate;
                _statLabels[4].textContent = t.label_streak;
            }
            const _statsStrong = document.querySelectorAll('#statsPanel strong');
            if (_statsStrong && _statsStrong.length >= 2) {
                _statsStrong[0].textContent = t.label_week_chart;
                _statsStrong[1].textContent = t.label_top_wrong;
            }

            // SRS select options (options have no IDs)
            const easeSel = document.getElementById('easeMode');
            if (easeSel) {
                Array.from(easeSel.options).forEach(opt => {
                    if (opt.value === '2.5') opt.textContent = t.opt_standard;
                    else if (opt.value === '2.0') opt.textContent = t.opt_fast;
                    else if (opt.value === '3.0') opt.textContent = t.opt_slow;
                    else if (opt.value === 'custom') opt.textContent = t.opt_custom;
                });
            }
            const lapseSel = document.getElementById('lapseMode');
            if (lapseSel) {
                Array.from(lapseSel.options).forEach(opt => {
                    if (opt.value === '0.0') opt.textContent = t.opt_reset;
                    else if (opt.value === '0.2') opt.textContent = t.opt_keep20;
                    else if (opt.value === '0.5') opt.textContent = t.opt_keep50;
                });
            }

            // Fullscreen button title (i18n)
            if (typeof updateFullscreenButton === 'function') updateFullscreenButton();

            if (typeof setStageToolbarTitles === 'function') setStageToolbarTitles();

        }

        // I18N module wiring (keep legacy function name for safety)
        I18N.update = applyUILanguage;
        function updateUILanguage() { I18N.update(); }
window.UI_TEXT = UI_TEXT;
window.I18N = I18N;
window.toggleLanguage = toggleLanguage;
window.applyUILanguage = applyUILanguage;
window.updateUILanguage = updateUILanguage;
