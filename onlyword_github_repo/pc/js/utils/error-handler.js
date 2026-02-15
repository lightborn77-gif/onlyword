// js/utils/error-handler.js

/**
 * ErrorHandler
 * - Phase2: 에러 처리 통일(콘솔 로깅 + 사용자 토스트 + i18n 메시지)
 * - i18n은 모듈/비모듈 환경 모두에서 동작하도록 window.I18N.get()를 우선 사용합니다.
 */
export class ErrorHandler {
  /**
   * @param {Error|any} error
   * @param {string} context - 예: 'file_load', 'save_local'
   */
  static handle(error, context = '') {
    console.error(`[${context}]`, error)
    const msg = this.getUserMessage(context)
    this.showToast(msg, 'error')
  }

  /**
   * i18n 키 우선 조회 후 기본 메시지 반환
   * @param {string} context
   * @returns {string}
   */
  static getUserMessage(context) {
    const key = context ? `errors.${context}_failed` : 'errors.error_occurred'
    try {
      const I18N = window.I18N
      const t = I18N && typeof I18N.get === 'function' ? I18N.get(key) : null
      if (t && t !== key) return t
    } catch (_) {}
    return '오류가 발생했습니다'
  }

  /**
   * 간단 토스트 UI 표시
   * @param {string} message
   * @param {'info'|'error'|'success'} type
   */
  static showToast(message, type = 'info') {
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => toast.classList.add('show'), 10)
    setTimeout(() => {
      toast.classList.remove('show')
      setTimeout(() => toast.remove(), 250)
    }, 3000)
  }
}
