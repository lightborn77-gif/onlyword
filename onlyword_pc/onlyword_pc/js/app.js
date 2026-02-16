// app.js (SLIM) - orchestration only. No DOM logic, no pool/quiz/render logic.
(function(){
  // Ensure App exists
  window.App = window.App || {};
  // Provide a tiny dispatch passthrough if engine already defines it.
  if(typeof window.App.dispatch !== 'function' && typeof window.dispatch === 'function'){
    window.App.dispatch = window.dispatch;
  }

  // Public no-op init hook (actual init lives in bootstrap/impl modules)
  window.AppMain = window.AppMain || {};
  window.AppMain.init = function(){
    // Prefer bootstrap initializer if present
    try{
      if(window.AppBootstrap && typeof window.AppBootstrap.init === 'function'){
        window.AppBootstrap.init();
      }
    }catch(e){}
  };

  // Keep page behavior same: if something previously relied on DOMContentLoaded here,
  // we delegate to AppBootstrap/app_impl which remains loaded by index.html.
})();
