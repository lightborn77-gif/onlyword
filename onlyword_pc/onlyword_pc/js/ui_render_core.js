// ui_render_core.js - extracted from app.js (PC)
// NOTE: Shared DOM helper. Use var + window.$id to avoid 'already been declared' when multiple scripts load.
var $id = window.$id || ((window.DomCache && DomCache.byId) ? DomCache.byId : (id)=>document.getElementById(id));
window.$id = $id;
function updateDisplay() {
            const mode = getCurrentMode();
            
            /* wordOnly UI removed (word-only build) */
// --- 기존 단어장 모드 로직 (wordOnly가 아닐 때) ---
            document.querySelector('.progress').style.display = 'block'; // 단어장 모드에서 진행바 표시
            
            let pool;
            if (isRunning) {
                pool = currentPool;
            } else if (mode === 'srsMode') {
                pool = getSRSItems();
            } else if (mode === 'quizMode') {
                pool = getQuizPool(); 
            } else {
                pool = getFiltered();
            }

            if (pool.length === 0) { 
                const msg = mode === "srsMode" 
                    ? `<span class="lang-kr">오늘 복습할 단어가 없습니다!</span><span class="lang-en">No words to review today!</span>`
                    : `<span class="lang-kr">표시할 단어가 없습니다</span><span class="lang-en">No words to display</span>`;
                $id('mainDisplay').innerHTML = msg;
                $id('cntMsg').innerText = "0 / 0";
                $id('subDisplay').innerText = "";
                return;
            }
            if (currentIndex >= pool.length) currentIndex = 0;
            const item = pool[currentIndex];
            const main = $id('mainDisplay');
            
            // 🔍 독해/영작 모드 체크
            const readingMode = $id('readingMode') ? $id('readingMode').value : 'off';
            
            if (readingMode !== 'off' && window.readingStep !== undefined) {
                // 독해/영작 모드 표시
                if (readingMode === 'eng-kor') {
                    // 독해모드: 영→한
                    main.innerText = window.readingStep === 0 ? item.eng : item.kor;
                } else if (readingMode === 'kor-eng') {
                    // 영작모드: 한→영
                    main.innerText = window.readingStep === 0 ? item.kor : item.eng;
                }
                $id('subDisplay').style.display = 'none';
                $id('quizArea').style.display = 'none';
            } else if (mode === 'studyMode') {
                 // 영단어와 한글을 동시에 표시
                 main.innerText = item.eng;
                 $id('subDisplay').innerText = item.kor;
                 $id('subDisplay').style.display = 'block';
                 $id('subDisplay').style.visibility = 'visible';
                 $id('quizArea').style.display = 'none';
            } else if (mode === 'quizMode' || mode === 'srsMode') {
                 main.innerText = item.eng;
                 $id('subDisplay').style.display = 'none';
                 $id('quizArea').style.display = 'none';
            }

            main.style.fontSize = $id('fontSize').value + "px";
            
            let displayColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
            
            // 컬러 토글 상태 확인
            const toggleLearning = $id('toggleColorLearning').checked;
            const toggleWrong = $id('toggleColorWrong').checked;
            const toggleSafe = $id('toggleColorSafe').checked;

            if (item.isSafe) {
                if (toggleSafe) { displayColor = getComputedStyle(document.documentElement).getPropertyValue('--color-safe'); }
            } else if (item.w > 0) {
                if (toggleWrong) { displayColor = getComputedStyle(document.documentElement).getPropertyValue('--color-wrong'); }
            } else {
                if (toggleLearning) { displayColor = getComputedStyle(document.documentElement).getPropertyValue('--color-learning'); }
            }
            
            main.style.color = displayColor;
            main.style.fontWeight = "bold";

            // ⭐️ 아이콘 표시
            let iconHtml = main.innerText;
            if (item.isSafe) { 
                iconHtml += `<span style="font-size:0.6em; color:#17a2b8; margin-left:10px;">✅</span>`;
            } 
            else if (item.w > 0) {
                let stars = "";
                let starColor = "#FFD700";
                if (item.w <= 5) {
                    stars = "★".repeat(item.w);
                } else {
                    stars = "★";
                    starColor = "#e74c3c";
                }
                iconHtml += `<span style="font-size:0.6em; color:${starColor}; margin-left:10px;">${stars}</span>`;
            }
            main.innerHTML = iconHtml;
            $id('cntMsg').innerText = `${currentIndex + 1} / ${pool.length}`;
        }