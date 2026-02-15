// js/controllers/quiz-controller.js
/**
 * QuizController
 * - Phase2: app_impl.js 내 퀴즈 관련 "위임(bridge)" 로직을 분리
 * - 현재 프로젝트 구조상 실제 퀴즈 진행(showQuiz 등)은 engine_quiz.js 전역 구현이 담당합니다.
 *   따라서 본 컨트롤러는 기능 변경 없이 기존 전역 함수를 안전하게 호출합니다.
 */
export class QuizController {
  /**
   * @param {object} deps
   * @param {object} deps.store - core/store.js의 store (선택)
   * @param {object} deps.tts - services/tts-service.js의 TTS 싱글톤 (선택)
   * @param {object} deps.ui - UI 어댑터 (선택)
   */
  constructor({ store, tts, ui } = {}) {
    this.store = store
    this.tts = tts
    this.ui = ui
  }

  /**
   * 퀴즈 풀 생성(기존 동작 유지)
   * 우선순위:
   * 1) window.App.Quiz.getQuizPool()
   * 2) window.getQuizPool()
   * @returns {Array<any>}
   */
  getQuizPool() {
    try {
      if (window.App?.Quiz?.getQuizPool) return window.App.Quiz.getQuizPool()
    } catch (_) {}
    try {
      if (typeof window.getQuizPool === 'function') return window.getQuizPool()
    } catch (_) {}
    return []
  }

  /**
   * 다음 문제로 이동 (기존 전역 showQuiz 사용)
   * @returns {void}
   */
  nextQuestion() {
    if (typeof window.showQuiz === 'function') window.showQuiz()
  }

  /**
   * 답안 체크 (전역 checkAnswer가 있을 경우 위임)
   * @param {any} userAnswer
   * @returns {any}
   */
  checkAnswer(userAnswer) {
    if (typeof window.checkAnswer === 'function') return window.checkAnswer(userAnswer)
    return undefined
  }

  /**
   * 퀴즈 리포트 렌더(기존 renderReport 위임)
   * @returns {void}
   */
  renderReport() {
    if (this.ui && typeof this.ui.renderQuizReport === 'function') {
      this.ui.renderQuizReport()
      return
    }
    if (typeof window.renderReport === 'function') window.renderReport()
  }

  /**
   * 리포트 특정 항목 TTS 읽기(기존 speakReportByIndex 위임)
   * @param {number} index
   * @returns {void}
   */
  speakReportByIndex(index) {
    if (typeof window.speakReportByIndex === 'function') window.speakReportByIndex(index)
  }
}
