// app_core.js (SLIM) - orchestration only. No DOM logic, no parser/storage/tts logic.
(function(){
  window.App = window.App || {};
  window.AppMain = window.AppMain || {};
  window.AppMain.init = function(){
    try{
      if(window.AppBootstrap && typeof window.AppBootstrap.init === 'function'){
        window.AppBootstrap.init();
      }
    }catch(e){}
  };
})();
