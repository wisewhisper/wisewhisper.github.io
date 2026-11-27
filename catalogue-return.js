/* WiseWhisper catalogue return navigation, 2026-11-27 */
(() => {
  'use strict';
  const fallback = document.getElementById('ww-catalogue-return');
  if (!fallback) return;
  let from = null;
  try {
    const u = new URL(document.referrer);
    if (u.origin === location.origin && (u.pathname === '/' || u.pathname === '/index.html')) from = u;
  } catch (_) {}
  if (from && (from.searchParams.has('unit') || from.searchParams.has('q'))) {
    from.hash = 'catalogue';
    fallback.href = from.href;
  }
  const existing = [...document.querySelectorAll('a[href]')].filter(a => {
    if (a === fallback || a.closest('[data-ww-copyright]')) return false;
    try {
      const u = new URL(a.getAttribute('href'), location.href);
      return u.origin === location.origin && (u.pathname === '/' || u.pathname === '/index.html') &&
        /목록|돌아가기|뒤로|홈|과학실험실/.test(a.textContent);
    } catch (_) { return false; }
  });
  function back(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (from && (from.searchParams.has('unit') || from.searchParams.has('q')) && history.length > 1) { e.preventDefault(); history.back(); }
  }
  for (const a of existing) {
    a.href = fallback.href;
    a.removeAttribute('target');
    a.addEventListener('click', back);
  }
  const visible = existing.find(a => a.getClientRects().length && getComputedStyle(a).visibility !== 'hidden');
  if (visible) {
    const a = visible;
    a.textContent = '← 목록으로 돌아가기';
    a.setAttribute('aria-label','목록으로 돌아가기');
    fallback.remove();
  } else {
    fallback.addEventListener('click', back);
  }
})();
