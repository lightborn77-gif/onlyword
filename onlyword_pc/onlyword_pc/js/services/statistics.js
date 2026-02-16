// js/services/statistics.js
/**
 * StatisticsService
 * - Phase2: 통계 계산 로직을 한 곳에 모으기 위한 서비스
 * - 현재 app_impl.js의 updateStats/logStudy 로직을 '계산'과 '표시(UI)'로 분리하기 위한 기반입니다.
 * - 이 파일 자체는 기존 동작을 바꾸지 않으며(아직 연결하지 않음), 순수 계산 함수만 제공합니다.
 */
export class StatisticsService {
  /**
   * 오늘 날짜 키 (app_impl의 날짜 저장 방식과 유사: toDateString)
   * @param {Date} [date]
   * @returns {string}
   */
  static getTodayKey(date = new Date()) {
    return date.toDateString()
  }

  /**
   * 오늘 학습 카운트
   * @param {Record<string, number>} studyLog
   * @param {Date} [date]
   * @returns {number}
   */
  static getTodayCount(studyLog, date = new Date()) {
    const k = this.getTodayKey(date)
    return Number(studyLog?.[k] || 0)
  }

  /**
   * 최근 7일 학습 카운트 합계
   * @param {Record<string, number>} studyLog
   * @param {Date} [date]
   * @returns {number}
   */
  static getWeekCount(studyLog, date = new Date()) {
    let sum = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(date)
      d.setDate(d.getDate() - i)
      const k = this.getTodayKey(d)
      sum += Number(studyLog?.[k] || 0)
    }
    return sum
  }

  /**
   * 안정권 비율(%) 계산
   * - item.isSafe를 기준으로 계산
   * @param {Array<{isSafe?: boolean}>} vocabulary
   * @returns {number}
   */
  static getMemorizedRate(vocabulary) {
    const total = Array.isArray(vocabulary) ? vocabulary.length : 0
    if (total === 0) return 0
    const safe = vocabulary.filter(v => !!v?.isSafe).length
    return Math.round((safe / total) * 100)
  }

  /**
   * 퀴즈 정답률(%) 계산
   * - history item 형태가 달라도 동작하도록 폭넓게 처리
   * @param {Array<any>} quizHistory
   * @returns {number}
   */
  static getQuizAccuracy(quizHistory) {
    const total = Array.isArray(quizHistory) ? quizHistory.length : 0
    if (total === 0) return 0

    const correct = quizHistory.filter(h => {
      if (typeof h === 'boolean') return h === true
      if (typeof h === 'object' && h) {
        if ('correct' in h) return !!h.correct
        if ('isCorrect' in h) return !!h.isCorrect
      }
      return false
    }).length

    return Math.round((correct / total) * 100)
  }
}
