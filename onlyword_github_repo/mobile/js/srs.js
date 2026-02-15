/* =========================================================
 * SRS core
 * Generated: 2026-02-10 20:55:40
 * Notes:
 * - This file is part of the "split/annotated" refactor.
 * - Functions/variables are kept global (non-module) to avoid breaking behavior.
 * ========================================================= */


// ---------------------------------------------------------
// getFiltered
// ---------------------------------------------------------

        function getFiltered() {
            const hash = getSettingsHash();
            if (cache.filtered && currentSettingsHash === hash) {
                return cache.filtered;
            }
            
            const start = parseInt(document.getElementById('startIdx').value) - 1;
            const end = parseInt(document.getElementById('endIdx').value);
            let pool = vocabulary.slice(start, end);
            
            if (settings.unmem || settings.star || settings.safe) {
                pool = pool.filter(v => 
                    (settings.unmem && v.quizCount === 0) ||
                    (settings.star && v.w > 0) ||
                    (settings.safe && v.isSafe)
                );
            }
            
            currentSettingsHash = hash;
            cache.filtered = pool;
            return pool;
        }

        // SRS 아이템 가져오기
// ---------------------------------------------------------
// getSRSItems
// ---------------------------------------------------------

        function getSRSItems() {
            const today = new Date().toISOString().slice(0, 10);
            const start = parseInt(document.getElementById('startIdx').value) - 1;
            const end = parseInt(document.getElementById('endIdx').value);
            
            let pool = vocabulary.filter(v => {
                if (v.num <= start || v.num > end) return false;
                if (!v.lastSeen) return settings.srsNewOnly;
                
                const daysSince = Math.floor((new Date(today) - new Date(v.lastSeen)) / 86400000);
                let due = daysSince >= v.interval;
                
                if (settings.srsHardOnly && v.w >= 3) return true;
                if (v.w >= 1) due = due || daysSince >= Math.max(1, Math.floor(v.interval / 2));
                if (!v.m) return true;
                
                return due;
            });
            
            pool.sort((a, b) => {
                const aLast = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
                const bLast = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
                return aLast - bLast;
            });
            
            return pool;
        }

        // SRS 업데이트
// ---------------------------------------------------------
// updateSRS
// ---------------------------------------------------------

        function updateSRS(item, correct) {
            const today = new Date().toISOString().slice(0, 10);
            item.lastSeen = today;
            item.quizCount = (item.quizCount || 0) + 1;
            
            if (correct) {
                item.interval = Math.max(1, Math.round((item.interval || 1) * settings.easeMode));
                item.m = true;
                item.correctStreak = (item.correctStreak || 0) + 1;
                item.totalCorrect = (item.totalCorrect || 0) + 1;
                
                // 안정권 조건: 연속 5회 또는 총 10회 정답
                if (item.correctStreak >= 5 || item.totalCorrect >= 10) {
                    item.isSafe = true;
                    item.w = 0;
                } else {
                    item.w = Math.max(0, item.w - 1);
                }
            } else {
                if (settings.lapseMode === 0.0) {
                    item.interval = 1;
                } else {
                    item.interval = Math.max(1, Math.round(item.interval * settings.lapseMode));
                }
                item.w++;
                item.correctStreak = 0;
                item.isSafe = false;
                
                // 오답 날짜 기록
                const todayIso = new Date().toISOString().slice(0, 10);
                if (!item.wrongDates) item.wrongDates = [];
                if (!item.wrongDates.includes(todayIso)) {
                    item.wrongDates.push(todayIso);
                }
            }
            saveLocal();
            clearCache();
        }

        // 화면 업데이트