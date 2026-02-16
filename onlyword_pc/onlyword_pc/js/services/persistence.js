// js/services/persistence.js
/**
 * PersistenceService
 * - Phase2: 저장/로드/가져오기/내보내기 로직을 분리하기 위한 서비스
 * - 현재 프로젝트는 app_impl.js에 saveLocal/loadSettings/exportData/importData가 존재하고,
 *   다른 모듈(srs.js 등)에서도 전역 saveLocal을 직접 호출합니다.
 * - 기능 변경 금지 원칙을 위해, 이 서비스는 기본적으로 기존 전역 함수를 '위임(bridge)'합니다.
 */
export class PersistenceService {
  /**
   * 진행상태 저장 (기존 saveLocal 위임)
   * @returns {void}
   */
  static saveLocal() {
    if (typeof window.saveLocal === 'function') window.saveLocal()
  }

  /**
   * 설정/상태 로드 (기존 loadSettings 위임)
   * @returns {void}
   */
  static loadLocal() {
    // app_impl.js의 함수명이 loadSettings인 경우가 많음
    if (typeof window.loadSettings === 'function') return window.loadSettings()
    if (typeof window.loadLocal === 'function') return window.loadLocal()
  }

  /**
   * 전체 데이터 내보내기 (기존 exportData 위임)
   * @returns {any}
   */
  static exportData() {
    if (typeof window.exportData === 'function') return window.exportData()
    return undefined
  }

  /**
   * 데이터 가져오기 (기존 importData 위임)
   * @param {any} payload
   * @returns {any}
   */
  static importData(payload) {
    if (typeof window.importData === 'function') return window.importData(payload)
    return undefined
  }
}
