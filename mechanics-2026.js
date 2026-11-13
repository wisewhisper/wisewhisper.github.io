/* Unified mechanics interface. Original simulation objects, models and handlers retained. */
(()=>{'use strict';
const main=document.querySelector('main'),body=document.body;
if(!main||main.dataset.mechanicsReady)return;
main.dataset.mechanicsReady='1';main.classList.add('ml-main');
const title=document.querySelector('h1')?.textContent.trim()||document.title;
const originalNodes=Array.from(main.children);
const header=originalNodes.find(n=>n.tagName==='HEADER');
const heading=document.createElement('header');heading.innerHTML='<h1></h1>';heading.querySelector('h1').textContent=title;
function el(tag,cls,txt){const v=document.createElement(tag);if(cls)v.className=cls;if(txt!==undefined)v.textContent=txt;return v;}
const nav=el('nav','ml-nav');nav.setAttribute('aria-label','실험 탭');
const live=el('section','ml-tab-page');live.id='ml-live';
const graph=el('section','ml-tab-page ml-secondary');graph.id='ml-graph';graph.hidden=true;
const inquiry=el('section','ml-tab-page ml-secondary');inquiry.id='ml-inquiry';inquiry.hidden=true;
const concept=el('section','ml-tab-page ml-secondary');concept.id='ml-concept';concept.hidden=true;
const grid=el('div','ml-live-grid'),visual=el('div','ml-visual'),settings=el('aside','ml-settings'),measurements=el('div','ml-measurements');
const controlsRow=el('div','ml-controls-row'),settingsScroll=el('div','ml-settings-scroll'),status=el('p','ml-status','시작을 누르면 실험이 진행됩니다.');
settings.append(controlsRow,status,settingsScroll);grid.append(visual,settings,measurements);live.append(grid);
const host=el('div','ml-source-host');host.hidden=true;document.body.append(host);
if(header)header.remove();
for(const node of originalNodes){if(node!==header)host.append(node);}
main.replaceChildren(heading,nav,live,graph,inquiry,concept);
const tabs=[['실험',live],['그래프·분석',graph],['비교·탐구',inquiry],['개념 설명',concept]];
function activate(dest){
 for(const [_,section]of tabs){section.hidden=section!==dest;}
 for(const b of nav.querySelectorAll('button')){b.setAttribute('aria-selected',String(b.dataset.target===dest.id));}
 window.dispatchEvent(new Event('resize'));
 requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
}
for(const [name,section]of tabs){const b=el('button',null,name);b.type='button';b.dataset.target=section.id;b.setAttribute('aria-selected',String(section===live));b.addEventListener('click',()=>activate(section));nav.append(b)}
const home=el('a','ml-home','← 실험 목록');home.href='index.html';nav.append(home);
function findPanels(root,out){
 for(const child of Array.from(root.children)){
  if(child.tagName==='SCRIPT'||child.tagName==='STYLE'||child.tagName==='LINK'||child.tagName==='FOOTER')continue;
  const name=(child.className||'').toString();
  const directHeading=Array.from(child.children).some(c=>/^(H2|H3)$/.test(c.tagName)||c.matches?.('.panel-head'));
  const nestedPanels=Array.from(child.children).filter(n=>n.matches?.('section,article,aside,.panel,.card'));
  const hasMedia=!!child.querySelector('canvas,svg,.sim-stage,.scene,.canvas-wrap');
  const hasInput=!!child.querySelector('input[type=range],select,input[type=number]');
  if((nestedPanels.length>1&&!directHeading)||(/\b(stack|layout|grid|workspace|wrap|shell|columns|container|side|right|left)\b/.test(name)&&!directHeading)){
   findPanels(child,out);
  }else if(child.matches('section,article,aside,.card,.panel,.stage,.scene')||directHeading||hasMedia||hasInput){
   out.push(child);
  }else if(child.children.length){findPanels(child,out);}
 }
}
const panels=[];findPanels(host,panels);
const used=new Set();
const textOf=p=>(p.querySelector('h2,h3')?.textContent||p.getAttribute('aria-label')||'').trim();
const hasAny=(p,selector)=>!!p.querySelector(selector);
function kind(p){
 const h=textOf(p),txt=p.textContent.slice(0,240);
 const hasCanvas=hasAny(p,'canvas,svg,.sim-stage,.canvas-wrap,.visual');
 const hasGraph=hasAny(p,'canvas[id*=graph],svg[id*=graph],canvas[id*=plot],svg[id*=plot],.graph-wrap,.graphwrap,.chartbox');
 const hasScene=hasAny(p,'canvas[id*=scene],svg[id*=scene],canvas[id*=orbit],svg[id*=track],.sim-stage,.canvas-wrap,.stage');
 const controls=hasAny(p,'input[type=range],select,input[type=number]');
 const measures=hasAny(p,'.metrics,.stats,.readings,.readouts,.meters,.metric,.stat,.reading');
 if(/교사용|해설|개념|모형의|원리|오개념|정의|적용 조건|기호와|수학적 열쇠|핵심 개념|측정과 물리 법칙/.test(h)&&!controls&&!hasCanvas)return'concept';
 if(/예측|탐구|비교|미션|활동|기록|데이터|질문|관찰하고 설명|조건 A|조건 비교/.test(h)&&!hasScene&&!(/실험 조건|조건 조작/.test(h)&&controls))return'inquiry';
 if(/그래프|관계|시간에 따른|시간 변화|시간 변화와 함께|값 대입/.test(h)&&hasCanvas&&!hasScene)return'graph';
 if(/실험 조건|조건 조작|변수 조작|실험 조절|조작|변수 조절|조건 조절|설정|실험 입력/.test(h)&&controls&&!hasScene)return'controls';
 if(/계산|현재 값|실시간 물리량|측정 구간의 결과|결과|공식/.test(h)&&!hasScene&&!controls)return'results';
 if(hasScene||hasCanvas&&(/관찰|움직임|운동|공전|궤도|진자|미끄러짐|힘|발사|실험 화면/.test(h)||!hasGraph))return'scene';
 if(hasGraph)return'graph';
 if(measures&&!controls)return'results';
 if(controls)return'controls';
 if(/해설|의미|원리|조건/.test(h))return'concept';
 return'inquiry';
}
const buckets={scene:[],controls:[],results:[],graph:[],inquiry:[],concept:[]};
for(const panel of panels){if(used.has(panel))continue;const k=kind(panel);buckets[k].push(panel);used.add(panel);}
const order={scene:visual,controls:settingsScroll,results:measurements,graph,inquiry,concept};
function move(panel,dest){panel.classList.add('ml-piece');dest.append(panel);}
for(const [k,dest]of Object.entries(order))for(const panel of buckets[k])move(panel,dest);
// Rescue scene and controls if a particular legacy layout combines both.
if(!visual.querySelector('canvas,svg,.sim-stage,.scene,.canvas-wrap')){
 const candidate=[...settingsScroll.children,...graph.children,...inquiry.children].find(p=>p.querySelector('canvas,svg,.sim-stage,.scene,.canvas-wrap')&&!/그래프/.test(textOf(p)));
 if(candidate)move(candidate,visual);
}
if(!settingsScroll.children.length){
 const scene=visual.firstElementChild;
 if(scene){const c=scene.querySelector('.controls,.control-panel,.settings,.control-grid');if(c&&!c.querySelector('canvas,svg'))move(c,settingsScroll);}
}
function extractReadouts(){
 const selectors=['.metrics','.stats','.readings','.readouts','.meters','.reading','.results','.kpis','.dashboard'];
 const sources=[...visual.children,...settingsScroll.children];
 for(const p of sources){
  const nodes=selectors.flatMap(s=>Array.from(p.querySelectorAll(s)));
  for(const n of nodes){
   if(n.closest('.ml-measurements')||n.querySelector('input,select,button,canvas,svg'))continue;
   const cells=Array.from(n.children);
   if(cells.length<2||cells.length>16)continue;
   for(const cell of cells){
    const strong=cell.querySelector('strong,.big,.v,.value,.num,output,b');
    const name=cell.querySelector('small,.k,.label,span')?.textContent||cell.childNodes[0]?.textContent||'측정값';
    if(!strong)continue;
    const wrap=el('div','ml-measure'),label=el('span',null,name.trim().slice(0,34)),value=el('strong');
    value.dataset.source='1';value.textContent=strong.textContent;
    wrap.append(label,value);measurements.append(wrap);
    const sync=()=>{if(value.textContent!==strong.textContent)value.textContent=strong.textContent};
    // Mirrors readouts without relocating elements on which old code may depend.
    const obs=new MutationObserver(sync);obs.observe(strong,{childList:true,subtree:true,characterData:true});sync();
   }
   if(measurements.children.length)break;
  }
  if(measurements.children.length)break;
 }
}
extractReadouts();
if(!measurements.children.length){
 const labels=['time','speed','acc','force','distance','mass','angle','period','radius','weight','range','position','velocity','height','energy'];
 const outputNodes=Array.from(document.querySelectorAll('[id]')).filter(n=>labels.some(key=>n.id.toLowerCase().includes(key))&&/^(STRONG|OUTPUT|SPAN|B|DIV)$/.test(n.tagName)&&n.children.length===0&&n.textContent.trim()&&n.textContent.trim().length<25).slice(0,4);
 for(const source of outputNodes){const wrap=el('div','ml-measure'),lab=el('span',null,source.id),val=el('strong',null,source.textContent);wrap.append(lab,val);measurements.append(wrap);new MutationObserver(()=>val.textContent=source.textContent).observe(source,{childList:true,subtree:true,characterData:true});}
}
if(!measurements.children.length){const wrap=el('div','ml-measure');wrap.append(el('span',null,'실험 결과'),el('strong',null,'조건을 바꾸어 관찰'));measurements.append(wrap);}
if(buckets.scene.length===0){visual.prepend(el('h2',null,'실험 장면'));}
// Gather old action buttons. Click their original handlers; do not replace physics logic.
const all=Array.from(document.querySelectorAll('button')).filter(b=>!nav.contains(b)&&!controlsRow.contains(b));
const normalized=b=>b.textContent.replace(/\s+/g,' ').trim();
const isStart=b=>/^(?:▶|▷|►)?\s*(?:시작|재생|공전|발사|계속|운동)(?:\s|$)/.test(normalized(b))||/^(?:start|play|startBtn|playBtn)$/i.test(b.id);
const isPause=b=>/^(?:Ⅱ|⏸|\|\|)?\s*(?:일시정지|정지)(?:\s|$)/.test(normalized(b))||/^(?:pause|pauseBtn)$/i.test(b.id);
const isReset=b=>/초기화|처음부터|처음으로|재시작|다시 실행|다시 실험|운동 재시작|처음 위치|처음부터 재생/.test(normalized(b))||/^(?:reset|resetBtn|restart|replay)$/i.test(b.id);
const start=all.find(isStart);
const pause=all.find(isPause);
const reset=all.find(isReset);
const toggle=all.find(b=>isStart(b)||isPause(b)||/^(?:play|toggle|playBtn)$/i.test(b.id));
const startButton=el('button',null,'▶ 시작'),pauseButton=el('button',null,'Ⅱ 일시정지'),resetButton=el('button',null,'↺ 초기화');
startButton.id='ml-start';controlsRow.append(startButton,pauseButton,resetButton);
function playingText(b){return b&&/일시정지|⏸|Ⅱ/.test(normalized(b));}
function setStatus(t){status.textContent=t;}
let inferredRunning=false;
let demoHandle=0,demoStarted=0,demoSlider=null;
function stopDemo(){if(demoHandle)cancelAnimationFrame(demoHandle);demoHandle=0;}
function runDemo(){const sliders=[...settingsScroll.querySelectorAll('input[type=range]'),...visual.querySelectorAll('input[type=range]')];demoSlider=sliders.find(x=>+x.max>+x.min);if(!demoSlider){setStatus('설정을 바꾸어 결과를 확인하세요.');return;}stopDemo();demoStarted=0;const min=+demoSlider.min,max=+demoSlider.max;function tick(now){if(!demoStarted)demoStarted=now;const fraction=(1-Math.cos((now-demoStarted)*.0015))/2;demoSlider.value=String(min+(max-min)*fraction);demoSlider.dispatchEvent(new Event('input',{bubbles:true}));if(now-demoStarted>4200){stopDemo();inferredRunning=false;setStatus('● 조건 변화 관찰 완료');return;}demoHandle=requestAnimationFrame(tick)}inferredRunning=true;setStatus('● 변수를 자동 변경하며 결과 관찰 중');demoHandle=requestAnimationFrame(tick)}
const naturalAutoplay=toggle&&playingText(toggle)&&!all.some(b=>b!==toggle&&isStart(b));
if(naturalAutoplay){try{toggle.click();}catch(e){}}
function clickFirst(btn){if(btn&&!btn.disabled){btn.click();return true;}return false;}
startButton.addEventListener('click',()=>{
 const candidate=all.find(isStart)||start||toggle;
 if(candidate&&(!inferredRunning||!playingText(candidate))){
  if(!clickFirst(candidate)){setStatus('시작 제어를 확인해 주세요.');return;}
  inferredRunning=true;setStatus('● 실험 진행 중');
 }else if(!candidate){runDemo();}
});
pauseButton.addEventListener('click',()=>{if(demoHandle){stopDemo();inferredRunning=false;setStatus('Ⅱ 일시정지');return;}
 let candidate=all.find(isPause)||pause;
 if(!candidate&&toggle&&playingText(toggle))candidate=toggle;
 if(clickFirst(candidate)){inferredRunning=false;setStatus('Ⅱ 일시정지');}
 else setStatus('현재 실험에는 별도 일시정지 기능이 없습니다.');
});
resetButton.addEventListener('click',()=>{stopDemo();
 if(clickFirst(reset)){inferredRunning=false;setStatus('↺ 처음 상태로 돌아왔습니다.');}
 else {const inputs=Array.from(document.querySelectorAll('input[type=range]'));inputs.forEach(n=>{if(n.defaultValue){n.value=n.defaultValue;n.dispatchEvent(new Event('input',{bubbles:true}));}});setStatus('설정값을 초기화했습니다.');}
});
const haveActions=!!(start||pause||reset||toggle);
if(!haveActions){startButton.textContent='▶ 변화 관찰';pauseButton.disabled=false;}
if(!pause&&!toggle&&haveActions)pauseButton.disabled=true;
if(!reset&&!document.querySelector('input[type=range]'))resetButton.disabled=true;
// Expose one-click native controls in first tab without duplicating original buttons visually.
for(const b of all.filter(b=>b===start||b===pause||b===reset||b===toggle))b.classList.add('ml-native-action');
function addEmpty(tab,text){if(!tab.querySelector('.ml-piece'))tab.append(el('div','ml-extra',text));}
addEmpty(graph,'현재 실험의 그래프 및 관계 분석 자료는 실험 화면에서 확인할 수 있습니다.');
addEmpty(inquiry,'변수를 바꾸고 결과를 비교해 보세요.');
addEmpty(concept,'물리 법칙의 적용 조건, 방향과 단위를 실험 결과와 비교해 보세요.');
function domReady(){window.dispatchEvent(new Event('resize'));setTimeout(()=>window.dispatchEvent(new Event('resize')),120);}
requestAnimationFrame(domReady);
})();