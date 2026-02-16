(function () {
  console.log('=== Main.js loaded ===');
  console.log('I18N available:', typeof window.I18N);
  console.log('toggleLanguage available:', typeof window.toggleLanguage);
  console.log('langBtn element:', document.getElementById('langBtn'));

  // 단일 초기화
  document.addEventListener('DOMContentLoaded', function () {
    // 언어 토글은 index.html의 onclick="__forceToggleUILang()" 경로를 사용합니다.
    // (DOM 재렌더/교체 시에도 안정적으로 동작하도록 전역 함수 기반)


    // 풀스크린 학습창 언어 토글(stageLangBtn) - DOM 교체에도 안전하게 위임 방식으로 처리
    document.addEventListener('click', function (e) {
      var target = e.target && (e.target.closest ? e.target.closest('#stageLangBtn') : null);
      if (!target) return;

      e.preventDefault();

      // 1) I18N.toggle() 호출
      if (window.I18N && typeof window.I18N.toggle === 'function') {
        window.I18N.toggle();
      } else if (typeof window.toggleLanguage === 'function') {
        window.toggleLanguage();
      }

      // 2) 강제로 UI 업데이트 (toggle이 DOM 업데이트를 안 하는 경우 대비)
      if (typeof window.applyUILanguage === 'function') {
        window.applyUILanguage();
      }
      if (typeof window.updateUILanguage === 'function') {
        window.updateUILanguage();
      }
    });

    // 파일 입력 바인딩 (한 번만)
    var fileInput = document.getElementById('fileInput');
    if (fileInput && window.FileLoader && typeof window.FileLoader.load === 'function') {
      fileInput.addEventListener('change', window.FileLoader.load);
    }

    // 앱 초기화
    if (window.App && typeof window.App.init === 'function') {
      window.App.init();
    }
  });
})();