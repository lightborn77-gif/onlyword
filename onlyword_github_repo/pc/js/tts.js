// ===== 🌐 다국어 지원 시스템 =====
        let currentStudyLang = 'en'; // 학습 언어
        
        // 학습 언어별 TTS 설정
        const STUDY_LANG_CONFIG = {
            en: { code: 'en-US', name: 'English' },
            ja: { code: 'ja-JP', name: '日本語' },
            zh: { code: 'zh-CN', name: '中文' },
            es: { code: 'es-ES', name: 'Español' },
            de: { code: 'de-DE', name: 'Deutsch' },
            fr: { code: 'fr-FR', name: 'Français' },
            it: { code: 'it-IT', name: 'Italiano' },
            pt: { code: 'pt-PT', name: 'Português' },
            ru: { code: 'ru-RU', name: 'Русский' },
            ar: { code: 'ar-SA', name: 'العربية' },
            ko: { code: 'ko-KR', name: '한국어' }
        };
        
        // UI 텍스트 한영 매핑 (전체)

// ========== 🔊 TTS 모듈 (3단계) ==========
window.TTS = window.TTS || {
    getLang() {
        return STUDY_LANG_CONFIG[currentStudyLang]?.code || 'en-US';
    },
    shouldSkip(text) {
        // 현재 스킵 기능 비활성화 (확장 포인트)
        return false;
    },
    updateVoiceList() {
        const select = document.getElementById('voiceSelect');
        if (!select || !window.speechSynthesis) return;

        const voices = window.speechSynthesis.getVoices();
        const targetLang = this.getLang();

        select.innerHTML = '';

        const langPrefix = targetLang.split('-')[0];
        const filtered = voices.filter(v => v.lang.startsWith(langPrefix));

        const voicesToShow = filtered.length > 0 ? filtered : voices;

        voicesToShow.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.name;
            opt.textContent = `${v.name} (${v.lang})`;
            select.appendChild(opt);
        });

        const saved = Storage.get('selectedVoice_' + currentStudyLang);
        if (saved && Array.from(select.options).some(opt => opt.value === saved)) {
            select.value = saved;
        }
    },
    cancel() {
        try { window.speechSynthesis.cancel(); } catch(e) {}
    },
    _applyVoiceAndParams(u, rateOverride) {
        u.lang = this.getLang(); // 학습 언어에 맞는 TTS 언어 설정

        try {
            const selectedVoice = document.getElementById('voiceSelect')?.value;
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.name === selectedVoice);
            if (voice) u.voice = voice;
        } catch(e) {}

        const baseRate = parseFloat(document.getElementById('ttsRate')?.value) || 1.0;
        u.rate = (typeof rateOverride === 'number' && !isNaN(rateOverride)) ? rateOverride : baseRate;
        u.pitch = parseFloat(document.getElementById('ttsPitch')?.value) || 1.0;
        u.volume = 1.0;
    },
    speak(text) {
        // 이전 TTS 즉시 중단
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            try { window.speechSynthesis.cancel(); } catch(e) {}
        }

        if (this.shouldSkip(text)) {
            console.log('TTS 스킵:', text);
            return;
        }

        // 즉시 실행 (setTimeout 제거하여 지연 최소화)
        const u = new SpeechSynthesisUtterance(text);
        this._applyVoiceAndParams(u);

        u.onerror = function(event) {
            const err = event && (event.error || event.name);
            if (err === 'interrupted' || err === 'canceled') return;
            console.error('Speech synthesis error:', event);
        };

        try { window.speechSynthesis.speak(u); } catch(e) {
            console.error('Speech synthesis speak error:', e);
        }
    },
    speakShadowStable(text, rateOverride, callback) {
        // cancel은 시작/정지 때만 1회 사용(여기선 사용 안 함)
        if (this.shouldSkip(text)) { if (callback) callback(); return; }

        const u = new SpeechSynthesisUtterance(text);
        this._applyVoiceAndParams(u, rateOverride);

        u.onend = () => { if (callback) callback(); };
        u.onerror = () => { if (callback) callback(); };

        try { window.speechSynthesis.speak(u); } catch(e) {
            if (callback) callback();
        }
    }
};

// NOTE: Some legacy modules reference the bare identifier `TTS`.
// In browsers, `window.TTS = ...` does not always create a global binding named `TTS`.
// Provide a safe alias for compatibility.
try { var TTS = window.TTS; } catch(e) {}
window.TTS = TTS;


// --- TTS export safety (avoid 'TTS is not defined' in other scripts) ---
try { window.TTS = window.TTS || TTS; } catch(e) { /* ignore */ }

// --- expose global identifier for legacy callers ---
var TTS = window.TTS;
