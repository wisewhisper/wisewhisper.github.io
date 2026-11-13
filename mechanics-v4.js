/* Mechanics lab V4: non-destructive tabs. Original simulation DOM and physics code stay mounted. */
(function(){
'use strict';
if(document.body.classList.contains('ml-v4'))return;
var root=document.querySelector('main');if(!root)return;
var body=document.body, filename=decodeURIComponent(location.pathname.split('/').pop()||'');
body.classList.add('ml-v4');
var isLight=/^01_운동과_힘_(?:공식(?:01|03|04|05|06|07|19|20)|실험(?:03|09))_/.test(filename);
body.classList.add(isLight?'ml-light-source':'ml-dark-source');
var title=(document.querySelector('h1')||document.querySelector('header')||{}).textContent||document.title;
title=title.replace(/\s+/g,' ').trim().slice(0,52);
var $=function(q,scope){return (scope||document).querySelector(q)};
var $$=function(q,scope){return Array.from((scope||document).querySelectorAll(q))};
function make(tag,cls,txt){var n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n}
function nearestPanel(node,group){
 if(group==='graph'){
  var nested=node.closest('.graph-section,.graph-card,.chart-card,.graphwrap,.graph-wrap,.chart-wrap,.chartbox,.graph-area');
  if(nested && nested.querySelector('canvas,svg') && nested.closest('main')) {
   if(nested.matches('.graph-section,.graph-card,.chart-card'))return nested;
   var parent=nested.parentElement;
   if(parent && parent.matches('.card,.panel,section,article'))return parent;
  }
 }
 var cur=node;while(cur&&cur!==root){
  if(cur.matches && cur.matches('.card,.panel,section,article,.stage,.space,.sim-card')){
   if(cur.matches('.card,.panel,section,article')||cur.parentElement===root)return cur;
  }
  cur=cur.parentElement;
 }
 return node.parentElement;
}
function heading(p){return (p.querySelector('h2,h3,.panel-head,.scene-top,.head,.chart-top,.graph-head')||{}).textContent?.replace(/\s+/g,' ').trim().slice(0,90)||''}
var media=$$('main canvas,main svg,main .sim-stage,main [role="img"]')
 .filter(function(n){
  if(n.matches('svg')&&n.closest('svg svg,defs,button'))return false;
  if(n.matches('svg')&&!n.hasAttribute('viewBox')&&!n.id)return false;
  if(n.matches('[role="img"]')&&n.querySelector('canvas,svg'))return false;
  return true;
 });
var sceneCandidates=[],graphCandidates=[];
var seenScene=new Set(),seenGraph=new Set();
function mediaType(m){
 var id=(m.id||'').toLowerCase();
 var cls=((m.className&&m.className.baseVal)||m.className||'').toString().toLowerCase();
 var near=(m.closest('.graph-section,.graph-wrap,.graphwrap,.chart-wrap,.chartbox,.graph-area')||{}).className||'';
 near=near.toString().toLowerCase();
 if(/graph|plot|chart/.test(id+' '+cls+' '+near))return'graph';
 if(/scene|orbit|track|sim|field|apparatus|space|pendulum|world|trajectory|stage/.test(id+' '+cls))return'scene';
 var panel=nearestPanel(m,'scene'),h=heading(panel);
 if(/그래프|시간에 따른|자료 분석|관계 그래프/.test(h))return'graph';
 return 'scene';
}
for(var m of media){
 var type=mediaType(m),panel=nearestPanel(m,type);
 if(!panel||panel===root)continue;
 var list=type==='graph'?graphCandidates:sceneCandidates;
 var set=type==='graph'?seenGraph:seenScene;
 if(!set.has(panel)){set.add(panel);list.push(panel)}
}
function scoreScene(p){
 var h=heading(p),points=0;
 if(p.querySelector('canvas[id="scene"],svg[id="track"],canvas[id="orbit"],canvas[id="orbitCanvas"],.sim-stage,#stage,#simCanvas'))points+=100;
 if(/관찰|실험 화면|진자의 움직임|공전|운동|발사|궤도/.test(h))points+=35;
 if(p.matches('.stage,.scene,.space'))points+=25;
 if(p.querySelector('canvas,svg'))points+=15;
 if(/그래프/.test(h))points-=100;
 return points
}
sceneCandidates.sort((a,b)=>scoreScene(b)-scoreScene(a));
var scene=sceneCandidates[0]||null;
// Rescue mixed scenes where native canvas is placed inside a card that also contains a graph.
if(!scene){
 var rescue=$('main canvas:not([id*="graph"]):not([id*="plot"]),main svg[viewBox],main .sim-stage,main .space');
 if(rescue)scene=nearestPanel(rescue,'scene');
}
function topPanelWithInputs(n){
 var p=n.closest('.controls-panel,.controls.card,.card.controls,.card,.panel,section,article,aside');
 if(!p||p===scene){
  var par=n.parentElement;while(par&&par!==root){if(par.matches('.card,.panel,section,article,aside')&&par!==scene)return par;par=par.parentElement}
 }
 return p;
}
var sliders=$$('main input[type="range"],main input[type="number"],main select').filter(n=>!n.closest('.ml-v4-toolbar'));
var controls=[];
for(var n of sliders){
 if(scene&&scene.contains(n))continue;
 var p=topPanelWithInputs(n);if(!p||p===scene||p.contains(scene)||scene&&scene.contains(p))continue;
 if(!controls.includes(p))controls.push(p);
}
controls.sort((a,b)=>{
 var hA=heading(a),hB=heading(b);
 var f=x=>/조건|조작|설정|조절|변수/.test(x)?20:/계산|읽기/.test(x)?5:0;
 return f(hB)-f(hA);
});
var control=controls[0]||null;
if(!control)body.classList.add('ml-v4-no-controls');
// Select panels for inquiry and concepts, excluding the actual scene and controls.
var blocks=$$('main section, main article, main .card, main .panel').filter(n=>{
 var nested=n.querySelectorAll('.card,.panel,section,article').length;
 return nested===0 || !!n.querySelector(':scope > h2,:scope > h3,:scope > .head');
});
var inquiry=[],concept=[];
for(var p of blocks){
 if(p===scene||p===control||scene&&scene.contains(p)||control&&control.contains(p))continue;
 var h=heading(p),txt=p.textContent.slice(0,350),graphIn=graphCandidates.some(g=>g===p||p.contains(g));
 if(graphIn)continue;
 if(/비교|탐구|관찰하고 설명|기록|데이터|미션|문제|질문|예측|활동/.test(h)||
     /조건 A|조건 B|예측.*관찰/.test(txt)&&p.querySelector('table,details')){if(!inquiry.includes(p))inquiry.push(p)}
 else if(/개념|해설|원리|오개념|적용 조건|모형|수학적|핵심/.test(h)||
          p.querySelectorAll('details').length>=2){if(!concept.includes(p))concept.push(p)}
}
function uniquePanels(list){return list.filter((p,i)=>!list.some((other,j)=>j!==i&&other.contains(p)))}
graphCandidates=uniquePanels(graphCandidates);
inquiry=uniquePanels(inquiry);
concept=uniquePanels(concept);
// Force no empty tabs: a topic without its own chart does not advertise a chart tab.
var tabs=[{id:'sim',label:'실험',panels:scene?[scene]:[]},
 {id:'graph',label:'그래프·분석',panels:graphCandidates},
 {id:'inquiry',label:'비교·탐구',panels:inquiry},
 {id:'concept',label:'개념 설명',panels:concept}].filter(t=>t.id==='sim'||t.panels.length);
var ui=make('div','ml-v4-toolbar');ui.id='ml-v4-toolbar';
var top=make('div','ml-v4-top'),name=make('strong','ml-v4-title',title),home=make('a','ml-v4-home','← 실험 목록');
home.href='index.html';home.target='_top';top.append(name,home);
var tabbar=make('nav','ml-v4-tabs');tabbar.setAttribute('aria-label','실험 화면');
var actions=make('div','ml-v4-actions');
var btnPlay=make('button','ml-v4-start','▶ 시작'),btnPause=make('button','ml-v4-pause','Ⅱ 일시정지'),btnReset=make('button','ml-v4-reset','↺ 초기화');
for(var b of [btnPlay,btnPause,btnReset]){b.type='button';actions.append(b)}
var subnav=make('nav','ml-v4-subnav');subnav.setAttribute('aria-label','추가 화면 선택');
ui.append(top,tabbar,actions,subnav);body.append(ui);
var status=make('div','ml-v4-status');status.textContent='';ui.append(status);
var measurements=make('div','ml-v4-measurements');measurements.setAttribute('aria-live','off');body.append(measurements);
var activeTab='sim',activePanel=0;
function setStatus(message){status.textContent=message}
function clean(){for(var p of $$('.ml-v4-focus'))p.classList.remove('ml-v4-focus','ml-v4-scene','ml-v4-controls','ml-v4-graph','ml-v4-other');}
function drawPanel(p,cls){if(p){p.classList.add('ml-v4-focus',cls)}}
function redraw(){
 window.dispatchEvent(new Event('resize'));
 requestAnimationFrame(()=>{window.dispatchEvent(new Event('resize'));});
 setTimeout(()=>window.dispatchEvent(new Event('resize')),160);
}
function makeSubnav(tab){
 subnav.replaceChildren();
 if(tab.id==='sim')return;
 if(tab.panels.length<=1)return;
 tab.panels.forEach((p,i)=>{
  var b=make('button',null,(heading(p)||((tab.id==='graph'?'그래프 ': '자료 ')+(i+1))).slice(0,29));
  b.type='button';b.setAttribute('aria-pressed',String(i===activePanel));
  b.onclick=()=>{activePanel=i;activate(tab.id)};
  subnav.append(b);
 });
}
function activate(id){
 var tab=tabs.find(t=>t.id===id)||tabs[0];
 if(activeTab!==id)activePanel=0;
 activeTab=id;clean();body.dataset.mlTab=id;
 if(id==='sim'){
  drawPanel(scene,'ml-v4-scene');
  if(control&&control!==scene&&!control.contains(scene))drawPanel(control,'ml-v4-controls');
  measurements.hidden=false;
 }else{
  var p=tab.panels[Math.min(activePanel,tab.panels.length-1)];
  drawPanel(p,id==='graph'?'ml-v4-graph':'ml-v4-other');
  measurements.hidden=true;
 }
 for(var t of tabs){var bb=tabbar.querySelector('[data-id="'+t.id+'"]');if(bb)bb.setAttribute('aria-selected',String(t.id===id))}
 makeSubnav(tab);redraw();
}
tabs.forEach(t=>{
 var b=make('button',null,t.label);b.type='button';b.dataset.id=t.id;b.setAttribute('aria-selected',String(t.id==='sim'));b.onclick=()=>activate(t.id);tabbar.append(b);
});
// For native live experiments, route controls to original event listeners; never recreate physics integration.
var nativeButtons=$$('main button');
function btnText(b){return b.textContent.replace(/\s+/g,' ').trim()}
var play=nativeButtons.find(b=>/^(play|start|startBtn|playBtn|toggle)$/i.test(b.id))
 ||nativeButtons.find(b=>/^(?:▶|▷|►)?\s*(?:시작|재생|공전|발사)(?:\s|$)/.test(btnText(b)));
var pause=nativeButtons.find(b=>/^(pause|pauseBtn)$/i.test(b.id))
 ||nativeButtons.find(b=>/^(?:Ⅱ|⏸)?\s*일시정지/.test(btnText(b)));
var reset=nativeButtons.find(b=>/^(reset|resetBtn)$/i.test(b.id))
 ||nativeButtons.find(b=>/초기화|처음부터|처음으로/.test(btnText(b)));
var playing=false;
function originalIsPause(){return !!play&&/일시정지|⏸|Ⅱ/.test(btnText(play))}
if(originalIsPause()){play.click();playing=false;}
btnPlay.onclick=()=>{
 if(!play){setStatus('수치를 변경하면 결과가 갱신되는 실험입니다.');return}
 if(!playing||!originalIsPause()){play.click();playing=true;setStatus('● 실험 실행');}
};
btnPause.onclick=()=>{
 if(!play){setStatus('자동 재생 기능이 없는 실험입니다.');return}
 if(pause&&!pause.disabled){pause.click();playing=false;setStatus('Ⅱ 일시정지');}
 else if(originalIsPause()){play.click();playing=false;setStatus('Ⅱ 일시정지');}
 else setStatus('현재 실험은 처음부터 실행할 수 있습니다.');
};
btnReset.onclick=()=>{if(reset&&!reset.disabled){reset.click();playing=false;setStatus('↺ 실험 초기화');}else setStatus('실험 조건을 다시 설정해 주세요.');};
if(!play){btnPlay.hidden=true;btnPause.hidden=true;}
if(!pause&&play&&!/^(play|toggle|playBtn)$/i.test(play.id))btnPause.hidden=true;
if(!reset)btnReset.hidden=true;
// Read-only metric mirrors: the original nodes and event handlers are not modified.
var values=[];
var preferred=['time','vel','speed','acc','ac','force','friction','period','weight','range','distance','pos','r','omega','metricT','metricV','mTime','mVel','mAcc','ratio'];
for(var key of preferred){
 var node=document.getElementById(key);
 if(node&&!node.matches('input,select,button,canvas,svg')&&!node.querySelector('input,canvas,svg')&&node.textContent.trim().length<=32&&!values.includes(node)){values.push(node);if(values.length>=4)break}
}
if(values.length<3&&scene){
 var fallback=$$('.metric strong,.stat b,.read strong,.reading strong,.metric .v,.read .value',scene);
 for(var n of fallback){if(!values.includes(n)&&n.textContent.trim().length<=40){values.push(n);if(values.length>=4)break}}
}
var tiles=values.slice(0,4).map(n=>{
 var tile=make('div','ml-v4-tile'),label=make('small',null,(n.closest('.stat,.metric,.read,.reading')?.textContent||n.id).replace(n.textContent,'').trim().slice(0,25)||n.id),val=make('strong',null,n.textContent.trim());
 tile.append(label,val);measurements.append(tile);return{node:n,display:val};
});
if(!tiles.length)measurements.hidden=true;
var lastMetricTime=0;
function refresh(t){
 if(t-lastMetricTime>140){lastMetricTime=t;for(var m of tiles){var v=m.node.textContent.trim();if(m.display.textContent!==v)m.display.textContent=v}}
 requestAnimationFrame(refresh);
}
requestAnimationFrame(refresh);
activate('sim');
})();