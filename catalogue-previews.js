/* WiseWhisper lab catalogue: show the actual experiment's representative screen.
 * Primary source: 81 real lab screenshots already stored in catalogue-source.html.
 * Cards without a screenshot keep their bespoke illustration or receive a topic diagram.
 * Display only: never modify experiment HTML, behaviour, navigation or filters.
 */
(() => {
  'use strict';
  const cards = [...document.querySelectorAll('.lab-card')];
  const stages = {
    '빛의 이중 슬릿': '<circle cx="57" cy="130" r="14" fill="#f8d88d"/><path d="M72 130H195" stroke="#fbdc88" stroke-width="5"/><path d="M220 28V102M220 120V146M220 165V240" stroke="#cad7ed" stroke-width="12"/><path d="M240 111Q336 39 435 60M240 111Q337 110 435 136M240 160Q338 181 435 217M240 160Q330 140 435 136" stroke="#8cdefc" stroke-width="4" stroke-dasharray="8 7" fill="none"/><rect x="432" y="40" width="13" height="190" fill="#507aa3"/><path d="M434 67V93M434 124V148M434 175V201" stroke="#ffd68d" stroke-width="8"/>',
    '전류의 자기 작용': '<path d="M60 130H414" stroke="#ffc177" stroke-width="13"/><circle cx="249" cy="130" r="75" fill="none" stroke="#83cefc" stroke-width="5"/><ellipse cx="249" cy="130" rx="135" ry="48" fill="none" stroke="#83cefc" stroke-width="4"/><path d="M249 130V34" stroke="#ffc177" stroke-width="7"/><path d="M226 62L249 35L272 62" stroke="#ffc177" stroke-width="7" fill="none"/><rect x="66" y="101" width="81" height="57" rx="11" fill="#265c86" stroke="#80dcf8" stroke-width="4"/>',
    'NFC': '<rect x="47" y="66" width="139" height="139" rx="16" fill="#2c5172" stroke="#8addff" stroke-width="5"/><rect x="68" y="91" width="96" height="81" rx="8" fill="#102b45" stroke="#77a9d8" stroke-width="2"/><path d="M221 102Q277 136 221 172M244 72Q331 136 244 204M268 47Q386 136 268 228" stroke="#8be7c2" stroke-width="5" fill="none"/><rect x="357" y="78" width="79" height="124" rx="10" fill="#2c4c6c" stroke="#ffd28a" stroke-width="5"/><path d="M380 113H413M380 137H413M380 161H413" stroke="#ffd28a" stroke-width="5"/>'
  };
  function createScene(title) {
    const scene = Object.entries(stages).find(([name]) => title.includes(name));
    const art = scene ? scene[1] : '<path d="M60 207H425M60 207V55" stroke="#7993b0" stroke-width="4"/><path d="M67 185Q151 60 236 185T418 185" fill="none" stroke="#84d9ff" stroke-width="8"/>';
    return '<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="대표 실험 장면 도식"><rect width="480" height="270" fill="#0b1626"/><path d="M0 218H480M0 164H480M0 110H480M80 0V270M160 0V270M240 0V270M320 0V270M400 0V270" fill="none" stroke="#293e56" opacity=".5"/>' + art + '</svg>';
  }
  function setupCard(card) {
    if (card.dataset.unit?.startsWith('09')) return null;
    const title = card.querySelector('h3')?.textContent.trim() || '실험실';
    const opener = [...card.querySelectorAll('a[href]')].at(-1);
    if (!opener) return null;
    let preview = card.querySelector(':scope > .lab-preview');
    if (!preview) {
      preview = document.createElement('a');
      preview.className = 'lab-preview';
      card.insertBefore(preview, card.querySelector('.lab-meta') || card.firstChild);
    }
    preview.href = opener.getAttribute('href');
    preview.target = opener.target || '_blank';
    preview.rel = 'noopener noreferrer';
    preview.removeAttribute('style');
    preview.setAttribute('aria-label', title + ' 대표 실험 화면 열기');
    card.dataset.previewMode = 'real-screen';
    const icon = card.querySelector(':scope > .app-icon');
    if (icon) icon.remove();
    const img = preview.querySelector('img[data-preview-index]');
    const indexed = img ? Number(img.dataset.previewIndex) : null;
    if (indexed !== null) {
      img.alt = title + ' 실제 실험 화면';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 560;
      img.height = 380;
    } else if (/특수\s*상대성/.test(title)) {
      preview.dataset.sourceScreen = '80';
    } else if (/전자기\s*유도\s*통합/.test(title)) {
      preview.dataset.sourceScreen = '75';
    } else if (!preview.querySelector('svg')) {
      // Replace nonrepresentative emoji and gradient tiles with science-specific scenes.
      preview.innerHTML = createScene(title);
    }
    return {title, preview, indexed, img};
  }
  const labCards = cards.map(setupCard).filter(Boolean);
  function addActualScreen(card, source) {
    if (!source || !source.startsWith('data:image/')) return;
    let image = card.img;
    if (!image) {
      image = document.createElement('img');
      card.preview.replaceChildren(image);
    }
    image.src = source;
    image.alt = card.title + ' 실제 실험 화면';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 560;
    image.height = 380;
    image.addEventListener('error', () => {
      card.preview.innerHTML = createScene(card.title);
    }, {once:true});
  }
  fetch('catalogue-source.html')
    .then(response => {if (!response.ok) throw Error('source unavailable');return response.text();})
    .then(html => {
      const source = new DOMParser().parseFromString(html, 'text/html');
      const images = [...source.querySelectorAll('.lab-preview img')];
      labCards.forEach(card => {
        const i = card.indexed ?? Number(card.preview.dataset.sourceScreen);
        if (!Number.isInteger(i) || i < 0) return;
        const original = images[i];
        if (original) addActualScreen(card, original.getAttribute('src'));
      });
    }).catch(() => {
      labCards.forEach(card => {
        if (card.indexed !== null || card.preview.dataset.sourceScreen) {
          card.preview.innerHTML = createScene(card.title);
        }
      });
    });
})();