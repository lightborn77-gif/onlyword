/* ========== 💾 Storage (localStorage 모듈) ========== */
const Storage = {
    // 네임스페이스 접두사 (다른 앱과 충돌 방지)
    _prefix: 'vocabPro_',
    
    // 실제 키 생성
    _key(name) {
        return this._prefix + name;
    },
    
    // 기본 getter/setter
    get(key, fallback=null) {
        try {
            const v = localStorage.getItem(this._key(key));
            return (v === null || v === undefined) ? fallback : v;
        } catch (e) { return fallback; }
    },
    
    set(key, value) {
        try { localStorage.setItem(this._key(key), String(value)); } catch (e) {}
    },
    
    // JSON getter/setter
    getJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(this._key(key));
            if (raw === null || raw === undefined || raw === '') return fallback;
            return JSON.parse(raw);
        } catch (e) { return fallback; }
    },
    
    setJSON(key, obj) {
        try { localStorage.setItem(this._key(key), JSON.stringify(obj)); } catch (e) {}
    },
    
    // 타입별 헬퍼
    getNumber(key, fallback=0) {
        const v = this.get(key);
        if (v === null) return fallback;
        const num = Number(v);
        return isNaN(num) ? fallback : num;
    },
    
    getBoolean(key, fallback=false) {
        const v = this.get(key);
        if (v === null) return fallback;
        return v === 'true' || v === '1';
    },
    
    getArray(key, fallback=[]) {
        return this.getJSON(key, fallback);
    },
    
    // 삭제
    remove(key) {
        try { localStorage.removeItem(this._key(key)); } catch (e) {}
    },
    
    // 네임스페이스 전체 삭제
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this._prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {}
    },
    
    // 모든 키 목록
    keys() {
        try {
            const keys = Object.keys(localStorage);
            return keys
                .filter(k => k.startsWith(this._prefix))
                .map(k => k.slice(this._prefix.length));
        } catch (e) { return []; }
    },
    
    // 네임스페이스 없는 원본 키 접근 (마이그레이션용)
    getRaw(key, fallback=null) {
        try {
            const v = localStorage.getItem(key);
            return (v === null || v === undefined) ? fallback : v;
        } catch (e) { return fallback; }
    },
    
    setRaw(key, value) {
        try { localStorage.setItem(key, String(value)); } catch (e) {}
    }
};
window.Storage = Storage;
