(function(){
  // js/core/app.js
  // 기존 전역 App 객체를 안전하게 래핑
  var existingApp = window.App || {};
  var existingDispatch = (existingApp && typeof existingApp.dispatch === 'function') ? existingApp.dispatch : null;
  var existingInit = (existingApp && typeof existingApp.init === 'function') ? existingApp.init : null;

  // Ensure window.App exists
  window.App = existingApp;

  // Provide a safe dispatch wrapper
  window.App.dispatch = function(){
    // engine.js의 전역 dispatch 함수 호출
    if (typeof window.dispatch === 'function') {
      try {
        return window.dispatch.apply(this, arguments);
      } catch (e) {
        // ignore
      }
    }
    // 또는 기존 App.dispatch가 있으면 그걸 호출
    if (existingDispatch) {
      try {
        return existingDispatch.apply(this, arguments);
      } catch (e) {
        // ignore
      }
    }
    console.warn('App.dispatch not available');
  };

  // Provide a safe init wrapper
  window.App.init = function(){
    if (existingInit) {
      try {
        return existingInit.apply(this, arguments);
      } catch (e) {
        // ignore
      }
    }
    // fallback to AppMain.init if present
    if (window.AppMain && typeof window.AppMain.init === 'function') {
      try {
        return window.AppMain.init.apply(this, arguments);
      } catch (e) {
        // ignore
      }
    }
  };
})();
