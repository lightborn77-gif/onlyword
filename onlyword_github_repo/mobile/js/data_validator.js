/* =========================================================
 * Data Validator (vocabulary/dialog)
 * Refactor: split from legacy/data_io.js
 * Generated: 2026-02-11
 * ========================================================= */

/** Basic validation + normalization for vocabulary array */
function validateVocabularyItems(items){
  if (!Array.isArray(items)) return { ok:false, reason:'not_array', items:[] };
  const out=[];
  for (const it of items){
    if (!it) continue;
    const eng = (it.eng ?? it.word ?? '').toString().trim();
    const kor = (it.kor ?? it.mean ?? '').toString().trim();
    if (!eng) continue;
    out.push({
      ...it,
      eng,
      kor,
      m: !!it.m,
      s: !!it.s,
      g: it.g ?? it.group ?? undefined,
    });
  }
  return { ok: out.length>0, reason: out.length>0 ? '' : 'empty', items: out };
}

/** Basic validation for dialog script */
function validateDialogScriptItems(items){
  if (!Array.isArray(items)) return { ok:false, reason:'not_array', items:[] };
  const out=[];
  for (const it of items){
    if (!it) continue;
    const role = (it.role ?? '').toString().trim().toUpperCase();
    const text = (it.text ?? '').toString().trim();
    const trans = (it.trans ?? '').toString().trim();
    if (!role || !text) continue;
    out.push({ role, text, trans });
  }
  return { ok: out.length>0, reason: out.length>0 ? '' : 'empty', items: out };
}
