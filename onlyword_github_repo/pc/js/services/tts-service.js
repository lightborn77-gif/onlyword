(function(){
  class TTSService {
    constructor() {
      if (!window.speechSynthesis) {
        console.warn('TTS not supported')
      }
      this._currentLang = 'en-US'
    }

    static getInstance() {
      if (!TTSService._instance) {
        TTSService._instance = new TTSService()
      }
      return TTSService._instance
    }

    setLanguage(lang) {
      this._currentLang = lang
    }

    speak(text, options = {}) {
      const synth = window.speechSynthesis
      if (!synth) return
      if (typeof SpeechSynthesisUtterance === 'undefined') return

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = this._currentLang
      utterance.rate = options.rate || 1.0
      utterance.pitch = options.pitch || 1.0

      // Safety: ignore common benign errors such as 'interrupted'
      utterance.onerror = function(event) {
        const err = event && (event.error || event.name)
        if (err === 'interrupted' || err === 'canceled') return
        console.error('Speech synthesis error:', event)
      }

      try {
        synth.speak(utterance)
      } catch (e) {
        // ignore
      }
    }

    cancel() {
      const synth = window.speechSynthesis
      if (!synth) return
      try {
        synth.cancel()
      } catch (e) {
        // ignore
      }
    }
  }

  // Expose as global (non-module)
  window.TTSService = TTSService.getInstance()
})();
