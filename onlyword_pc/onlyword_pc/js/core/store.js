class VocabStore {
  constructor() {
    this._state = {
      vocabulary: [],
      currentFileName: '',currentIndex: 0,
      isRunning: false,
      cache: {},
      studyLog: {}
      // ... 모든 상태
    }
    this._listeners = []
  }

  get state() {
    return this._state
  }

  setState(updates) {
    this._state = { ...this._state, ...updates }
    this._notify()
  }

  subscribe(listener) {
    this._listeners.push(listener)
  }

  _notify() {
    this._listeners.forEach(fn => fn(this._state))
  }
}

export const store = new VocabStore()
