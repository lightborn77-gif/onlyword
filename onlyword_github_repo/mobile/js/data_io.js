/* =========================================================
 * Data IO Orchestrator (events + cache)
 * Refactor: split from legacy/data_io.js
 * Fixed: 2026-02-12 - 불완전한 파일 복구
 * ========================================================= */

function clearCache() {
    cache = {};
    currentSettingsHash = '';
}

function getSettingsHash() {
    return JSON.stringify({
        mode: currentMode,
        unmem: settings.unmem,
        star: settings.star,
        safe: settings.safe,
        wrongRevive: settings.wrongRevive,
        wrongDays: settings.wrongDays,
        srsNew: settings.srsNewOnly,
        srsHard: settings.srsHardOnly
    });
}

// 파일 로드 이벤트 리스너
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onerror = () => alert('파일 읽기 실패!');
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const lines = content.split(/\r?\n/);
            
            // 🔍 파일 형식 자동 감지
            const fileType = detectFileTypeMobile(lines);
            
            if (fileType === 'vocabulary') {
                loadVocabularyMobile(content, file.name);
            } else if (fileType === 'dialog') {
                loadDialogMobile(content, file.name);
            } else {
                alert('파일 형식을 인식할 수 없습니다.\n\n단어장: "1. apple"\n회화: "A: Hello"');
            }
        } catch(err) {
            alert('파일 처리 중 오류: ' + err.message);
        }
    };
    
    reader.readAsText(file, 'UTF-8');
});
