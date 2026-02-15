// js/controllers/srs-controller.js
/**
 * SRSController
 * - Phase2: app_impl.js 내 SRS 관련 로직을 분리하기 위한 컨트롤러
 * - 현재 프로젝트에는 srs.js가 이미 SRS 핵심 로직을 제공(updateSRS/getSRSItems)하므로,
 *   본 컨트롤러는 기능 변경 없이 해당 전역/네임스페이스 함수를 위임(bridge)합니다.
 */
export class SRSController {
  /**
   * @param {object} deps
   * @param {object} deps.store - core/store.js의 store (선택)
   */
  constructor({ store } = {}) {
    this.store = store
  }

  /**
   * (기존 동작 유지) SRS 업데이트
   * 우선순위:
   *  1) window.App.SRS.updateSRS
   *  2) window.updateSRS
   * @param {object} item - vocabulary item
   * @param {boolean} correct - 정답 여부
   * @returns {void}
   */
  updateSRSProgress(item, correct) {
    if (window.App?.SRS?.updateSRS) return window.App.SRS.updateSRS(item, correct)
    if (typeof window.updateSRS === 'function') return window.updateSRS(item, correct)
  }

  /**
   * alias: PDF 지시서 용어에 맞춘 이름
   * - 실제 로직은 updateSRSProgress에 위임
   * @param {object} item
   * @param {boolean} correct
   * @returns {void}
   */
  calculateNextInterval(item, correct) {
    return this.updateSRSProgress(item, correct)
  }

  /**
   * (기존 동작 유지) 현재 설정 기준 SRS 대상 아이템 목록
   * 우선순위:
   *  1) window.App.SRS.getSRSItems
   *  2) window.getSRSItems
   * @returns {Array<any>}
   */
  getSRSItems() {
    if (window.App?.SRS?.getSRSItems) return window.App.SRS.getSRSItems()
    if (typeof window.getSRSItems === 'function') return window.getSRSItems()
    return []
  }

  /**
   * (호환) 기존 함수명 그대로 제공하고 싶을 때 사용
   * @param {object} item
   * @param {boolean} correct
   */
  updateSRS(item, correct) {
    return this.updateSRSProgress(item, correct)
  }
}
