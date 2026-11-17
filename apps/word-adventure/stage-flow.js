// Keep the selected stage and puzzle position when moving between puzzle types.
let stageRoute = null, stageLaunching = false;
function findBasicRoute(id) {
  for (let l=0; l<LEVELS.length; l++) for (let s=0; s<LEVELS[l].slots.length; s++) {
    const i=LEVELS[l].slots[s].findIndex(e=>e.type==='basic' && e.id===id);
    if(i>=0) return {level:l,stage:s,slot:i};
  }
  return null;
}
function routeMatches(route,type,id) {
  const e=route && LEVELS[route.level]?.slots[route.stage]?.[route.slot];
  return !!e && e.type===type && e.id===id;
}
function setRoute(route) { stageRoute=route; advState.stageRoute=route; advSave(); }
const flowLaunch=launchStage, flowAdvPick=advPick, flowSelect=selectStage, flowRender=render, flowAdvRender=advRender;
launchStage=function(level,stage,slot=0) {
  if(!LEVELS[level]?.slots[stage]?.[slot]) return;
  setRoute({level,stage,slot}); stageLaunching=true;
  try { flowLaunch(level,stage,slot); } finally { stageLaunching=false; }
};
selectStage=function(id) {
  if(!stageLaunching) setRoute(null);
  flowSelect(id);
};
advPick=function(id) {
  if(!stageLaunching && !routeMatches(stageRoute,'adv',id)) setRoute(null);
  flowAdvPick(id);
};
function nextStageTarget() {
  if(!stageRoute) return null;
  const {level,stage,slot}=stageRoute, stages=LEVELS[level].slots;
  if(slot+1<stages[stage].length) return {level,stage,slot:slot+1,newStage:false};
  for(let s=stage+1;s<stages.length;s++) if(stages[s].length) return {level,stage:s,slot:0,newStage:true};
  for(let l=level+1;l<LEVELS.length;l++) for(let s=0;s<LEVELS[l].slots.length;s++) if(LEVELS[l].slots[s].length) return {level:l,stage:s,slot:0,newStage:true,newLevel:true};
  return null;
}
function nextStageLabel() {
  const next=nextStageTarget();
  if(!next) return '탐험 지도 보기';
  if(next.newLevel) return '다음 난이도로';
  return next.newStage?'다음 스테이지로':'다음 퍼즐로';
}
function advanceStageFlow() {
  const next=nextStageTarget();
  if(next) launchStage(next.level,next.stage,next.slot); else {setRoute(null);stageHome()}
}
function stageCompletion(story,first,coins) {
  if(!stageRoute) {
    const action=area.classList.contains('visible')?'advanceDirectAdvanced()':'nextStage()';
    popup(`<div class="big">🗝️</div><h3>퍼즐 완성!</h3><p>${story}<br>${first?'탐험 코인 '+coins+'개를 받았어요.':'이미 받은 보상이에요.'}</p><button class="primary" onclick="${action}">${area.classList.contains('visible')&&!nextDirectAdvanced()?'탐험 지도 보기':'다음 퍼즐로'} →</button><button class="secondary" onclick="closeModal()">계속 살펴보기</button>`);return;
  }
  const next=nextStageTarget();
  popup(`<div class="big">✨</div><h3>${next?.newStage?'스테이지 완료!':'퍼즐 완성!'}</h3><p>${story}<br>${first?'탐험 코인 '+coins+'개를 받았어요.':'이미 받은 보상이에요.'}</p><button class="primary" onclick="advanceStageFlow()">${nextStageLabel()} →</button><button class="secondary" onclick="closeModal()">계속 살펴보기</button>`);
}
win=function(first){stageCompletion(p().story,first,10)};
function nextDirectAdvanced() {
  const puzzle=ADV[ai];
  const ids=puzzle.school&&puzzle.course?schoolIds(puzzle.school,puzzle.course):Number.isInteger(puzzle.genreIndex)?GENRES[puzzle.genreIndex].ids:null;
  const position=ids?.indexOf(ai)??-1;
  return position>=0?ids[position+1]:null;
}
function advanceDirectAdvanced() {
  const id=nextDirectAdvanced();
  if(id!==undefined&&id!==null) advPick(id); else stageHome();
}
function addContinueButton(container) {
  if(container.querySelector('.stage-continue')) return;
  const b=document.createElement('button'); b.className='primary stage-continue';
  b.textContent=(stageRoute?nextStageLabel():area.classList.contains('visible')&&!nextDirectAdvanced()?'탐험 지도 보기':'다음 퍼즐로')+' →';
  b.onclick=stageRoute?advanceStageFlow:area.classList.contains('visible')?advanceDirectAdvanced:nextStage;
  b.style.cssText='display:block;width:100%;margin:12px 0;padding:12px;border-radius:14px';
  container.appendChild(b);
}
render=function(){flowRender();const old=document.querySelector('.content .stage-continue');if(old)old.remove();$('tiles').style.display=locked?'none':'';if(locked){$('message').textContent='퍼즐 완성! 다음 퍼즐로 이어 가세요.';addContinueButton(mainContent)}else if($('message').textContent.startsWith('퍼즐 완성'))$('message').textContent='반짝이는 칸에 들어갈 글자를 골라 주세요'};
advRender=function(){flowAdvRender();if(!duel && Object.keys(advValues()).length===Object.keys(gridData()).length){area.querySelector('.adv-tiles').style.display='none';addContinueButton(area)}};
const savedRoute=advState.stageRoute;
if(advState.lastMode==='advanced' && routeMatches(savedRoute,'adv',ai)) stageRoute=savedRoute;
else if(!area.classList.contains('visible')) stageRoute=routeMatches(savedRoute,'basic',state.stage)?savedRoute:null;
if(area.classList.contains('visible')) advRender(); else render();
