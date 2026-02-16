(() => {
  const W = window;
  const App = W.App = W.App || {};

  const Storage = {
    _prefix: 'vocabMobile_',
    _key(k){ return this._prefix + k; },

    get(k, fallback=null){
      try{
        const v = localStorage.getItem(this._key(k));
        return (v === null || v === undefined) ? fallback : v;
      }catch(e){ return fallback; }
    },
    set(k, v){
      try{ localStorage.setItem(this._key(k), String(v)); }catch(e){}
    },
    del(k){
      try{ localStorage.removeItem(this._key(k)); }catch(e){}
    },
    getNumber(k, fallback=0){
      const v = this.get(k);
      const n = (v === null) ? NaN : Number(v);
      return Number.isFinite(n) ? n : fallback;
    },
    getBoolean(k, fallback=false){
      const v = this.get(k);
      if (v === null) return fallback;
      return v === 'true';
    }
  };

  App.Storage = Storage;
  W.Storage = W.Storage || Storage; // 레거시 호환(있으면 유지)
})();
