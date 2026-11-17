// Keep the last single-player puzzle and the entered letters in this browser.
const resumeOriginalAdvPick = advPick;
const resumeOriginalSelectStage = selectStage;
const resumeOriginalNextStage = nextStage;
const resumeOriginalPut = put;

function savedAdvancedPuzzle() {
  const valid = id => Number.isInteger(id) && id >= 0 && id < ADV.length;
  const unfinished = id => {
    if (!valid(id) || advState.cleared.includes(id)) return false;
    const q = ADV[id], cells = new Set();
    for (const w of q.words) for (let i = 0; i < w.w.length; i++)
      cells.add((w.r + (w.d === '세로' ? i : 0)) + ',' + (w.c + (w.d === '가로' ? i : 0)));
    return Object.keys(advState.boards[id] || {}).length < cells.size;
  };
  if (unfinished(advState.current)) return advState.current;
  return Object.keys(advState.boards || {}).map(Number).reverse().find(unfinished) ?? null;
}

advPick = function (id) {
  resumeOriginalAdvPick(id);
  if (!duel) {
    advState.current = id;
    advState.lastMode = 'advanced';
    advSave();
  }
};

selectStage = function (id) {
  resumeOriginalSelectStage(id);
  advState.lastMode = 'basic';
  advSave();
};
nextStage = function () {
  resumeOriginalNextStage();
  advState.lastMode = 'basic';
  advSave();
};
put = function (letter) {
  advState.lastMode = 'basic';
  advSave();
  resumeOriginalPut(letter);
};

function resumePuzzle(forceAdvanced = false) {
  duel = null;
  const id = savedAdvancedPuzzle();
  if (id !== null && (forceAdvanced || advState.lastMode !== 'basic')) {
    advPick(id);
    const grid = gridData(), values = advValues();
    const next = Object.keys(grid).find(k => !values[k]);
    if (next) { ak = next; aw = grid[next].words[0]; advRender(); }
    closeModal();
  } else {
    closeModal();
    if (area.classList.contains('visible')) originalAdvClose();
    render();
  }
}

modeMenu = function () {
  const hasAdvanced = savedAdvancedPuzzle() !== null && advState.lastMode !== 'basic';
  popup(`<div class="big">🧩</div><h3>어떻게 즐길까요?</h3><p>${hasAdvanced ? '저장한 퍼즐부터 이어서 풀 수 있어요.' : '혼자 여행하거나 둘이 함께 대결해요.'}</p><button class="primary" onclick="resumePuzzle()">${hasAdvanced ? '▶ 이어서 풀기' : '🌙 1인전 · 낱말 탐험'}</button>${hasAdvanced ? '<button class="secondary" onclick="selectStage(state.stage)">🌙 이야기 퍼즐 보기</button>' : ''}<button class="primary" onclick="duelMenu()">⚔️ 2인전 · 번갈아 대결</button>`);
};
$('modeSelect').onclick = modeMenu;

function hasBasicProgress() {
  return state.stage > 0 || state.cleared.length > 0 ||
    Object.values(state.values || {}).some(v => Object.keys(v).length > 1);
}

const continueTab = document.querySelector('[data-nav="이어 풀기"]');
const beginningTab = document.querySelector('[data-nav="처음부터"]');
continueTab.addEventListener('click', event => {
  event.stopImmediatePropagation();
  if (hasBasicProgress() && advState.lastMode === 'basic') selectStage(state.stage);
  else if (savedAdvancedPuzzle() !== null) resumePuzzle(true);
  else if (hasBasicProgress()) selectStage(state.stage);
  else popup('<div class="big">🧩</div><h3>이어서 풀 퍼즐이 없어요</h3><p>처음부터 퍼즐을 시작해 보세요.</p><button class="primary" onclick="selectStage(0)">첫 퍼즐 열기</button><button class="secondary" onclick="closeModal()">닫기</button>');
});
beginningTab.addEventListener('click', event => {
  event.stopImmediatePropagation();
  if (area.classList.contains('visible')) originalAdvClose();
  selectStage(0);
});

const renderBeforeMobileFit = advRender;
advRender = function () {
  renderBeforeMobileFit();
  if (!window.matchMedia('(max-width: 600px)').matches) return;
  const grid = area.querySelector('.adv-grid');
  if (!grid) return;
  const puzzle = ADV[ai];
  const heightLimit = Math.floor(window.innerHeight * 0.31 * puzzle.cols / puzzle.rows);
  grid.style.maxWidth = Math.min(puzzle.cols * 60, 370, heightLimit, area.clientWidth - 24) + 'px';
};

// A returning player lands on the unfinished puzzle without losing prior entries.
if (savedAdvancedPuzzle() !== null && advState.lastMode !== 'basic') resumePuzzle();
