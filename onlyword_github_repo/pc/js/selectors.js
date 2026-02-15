
// State selectors
window.Selectors = {
  getState(){ return (window.App && App.State) ? App.State : {}; },
  getCurrentIndex(){ const s=this.getState(); return s.currentIndex||0; },
  getPoolSize(){ const s=this.getState(); return (s.pool&&s.pool.length)||0; },
  isPlaying(){ const s=this.getState(); return !!s.playing; }
};
