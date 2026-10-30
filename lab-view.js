/* Presentation only: simulation nodes and their event listeners are preserved. */
(() => {
  'use strict';
  const body = document.body;
  body.dataset.labPage=decodeURIComponent(location.pathname);
  const title = document.querySelector('h1')?.textContent.trim() || document.title;
  const bar = document.createElement('div');
  bar.id = 'lab-viewbar';
  bar.innerHTML = '<a href="index.html" aria-label="실험 목록으로 돌아가기">← 목록</a><span class="lab-name"></span><button type="button" id="lab-compact-toggle" aria-pressed="false">한 화면 실험</button><button type="button" id="lab-fullscreen">⛶ 전체화면</button><span id="lab-view-status" role="status"></span>';
  bar.querySelector('.lab-name').textContent = title;
  body.prepend(bar);
  const toggle = bar.querySelector('#lab-compact-toggle');
  const status = bar.querySelector('#lab-view-status');
  const full = bar.querySelector('#lab-fullscreen');
  const focus = document.createElement('div'); focus.id = 'lab-focus';
  const left = document.createElement('div'); left.className = 'lab-column';
  const right = document.createElement('div'); right.className = 'lab-column';
  const readings=document.createElement('div'); readings.className='lab-column';
  focus.append(left, right);
  const extras = document.createElement('div'); extras.id = 'lab-extras';
  const moved = [];
  const generated=[];
  const empty = [];
  // These pages own switching panels. Keep their original ancestor structure.
  const native = /특수상대성|빛의굴절과렌즈|열역학과정|전기장과전위|도플러효과/.test(decodeURIComponent(location.pathname));
  const atomic = 'section,aside,article,.card,.panel,.stage,.scene,.toolbar,.meters,.metrics,.stats,nav,.tabs,.mode-tabs';
  const wrapper = '.grid,.layout,.workspace,.wrap,.app,.col,.right,.left,.side,.stack,.lower,.visuals,.main-grid,.top,.bottom,.below,.graphs,.stage';
  function collect(parent, out) {
    for (const el of Array.from(parent.children)) {
      if (el===bar || /^(SCRIPT|STYLE|LINK|HEADER|FOOTER|H1)$/.test(el.tagName)) continue;
      if (el.matches('nav,.tabs,.mode-tabs,.toolbar') && el.querySelector('button')) { out.push(el); continue; }
      const hasOwnHeading = Array.from(el.children).some(c => /^(H2|H3)$/.test(c.tagName));
      const hasOwnField = Array.from(el.children).some(c => c.matches('canvas,svg,input,select,label,.control,.settings,.buttons,.canvas-wrap,.canvaswrap,.canvasbox'));
      if ((el.matches(wrapper) || el.querySelector(':scope > .card,:scope > .panel')) && !hasOwnHeading && !hasOwnField) { collect(el,out); continue; }
      if (el.matches(atomic) || hasOwnHeading || (el.matches('div') && el.querySelector('canvas,svg,input,select'))) { out.push(el); continue; }
      if (el.querySelector(atomic)) collect(el,out);
    }
  }
  // New presentation panels inherit a complete surface, not only a text color.
  function surface(source) {
    const color = getComputedStyle(source).color;
    for(let node=source;node;node=node.parentElement){
      const style=getComputedStyle(node);
      if(style.backgroundImage!=='none'||!/^rgba\([^)]*,\s*0\)$/.test(style.backgroundColor)&&style.backgroundColor!=='transparent'){
        return {color,backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage};
      }
    }
    return {color,backgroundColor:getComputedStyle(body).backgroundColor,backgroundImage:'none'};
  }
  function paint(element,palette){Object.assign(element.style,palette);}
  function resize() { window.dispatchEvent(new Event('resize')); }
  function move(el, destination) {
    if(!el.parentNode){el.classList.add('lab-piece');destination.append(el);return;}
    const placeholder = document.createComment('original experiment position');
    const color=el.style.getPropertyValue('color'),priority=el.style.getPropertyPriority('color');
    const inheritedColor=getComputedStyle(el).color;
    el.before(placeholder); moved.push({el,placeholder,color,priority});
    el.style.setProperty('color',inheritedColor);
    el.classList.add('lab-piece'); destination.append(el);
  }
  function enable() {
    body.classList.add('lab-compact');
    toggle.setAttribute('aria-pressed','true'); toggle.textContent='설명 포함 원래 배치';
    if (native) {
      (document.querySelector('main') || document.querySelector('.app') || body).classList.add('lab-native');
      resize(); return;
    }
    const pieces=[]; collect(body,pieces);
    const palettes=new Map(pieces.map(el=>[el,surface(el)]));
    const scene=[], controls=[], results=[], charts=[], more=[], navigation=[];
    for(const el of pieces) {
      const heading=(el.querySelector('h2,h3')?.textContent || '').trim();
      if(el.matches('nav,.tabs,.mode-tabs,.toolbar')) { navigation.push(el); continue; }
      if(/예측하고 확인하기|측정 활동/.test(heading)&&!el.querySelector('input[type=range]')){more.push(el);continue;}
      const isLesson=/예측하고 확인|측정 활동|탐구|설명하며|설명 ·|오개념|모형의|적용 조건|교사용|핵심 개념|원리 읽기|어떻게|확인할 사실/.test(heading) && !el.querySelector('canvas,svg,input[type=range],input[type=number],select');
      const isCompare=/조건.*비교|기록|한눈에|관찰 → 설명|예측.*설명|관찰을 설명/.test(heading) && !/실시간/.test(heading);
      if(isLesson || isCompare || el.matches('details,.lesson,.activity,.questions,.study,.theory,.probe,.challenge')) { more.push(el); continue; }
      const field=el.querySelector('input[type=range],input[type=number],select');
      if((/그래프|시간에 따른|관계.*관찰|위상 비교/.test(heading) || (el.querySelector('canvas[id*=graph],canvas[id*=plot],svg[id*=graph],svg[id*=plot]') && !el.querySelector('canvas[id*=scene],canvas[id*=field],svg[id*=scene],svg[id*=track]'))) && !/조건 조작/.test(heading)) { charts.push(el); continue; }
      if(el.querySelector('canvas,svg,.visual')) { scene.push(el); continue; }
      if(field && (/조건|조작|변수|변인|설정|조절|입력/.test(heading) || el.matches('aside,.controls,.controls-panel'))) { controls.push(el); continue; }
      if(el.querySelector('canvas,svg')) { scene.push(el); continue; }
      if(el.querySelector('input,select,button')) { controls.push(el); continue; }
      if(/결과|측정|계산|현재|에너지|관측점|실시간/.test(heading) || el.matches('.metrics,.meters,.stats') || (body.dataset.labPage.includes('기주공명') && el.matches('.meter-card'))) results.push(el);
      else more.push(el);
    }
    body.insertBefore(focus, bar.nextSibling); focus.after(extras);
    for(const el of navigation) { move(el,left); el.classList.add('lab-navigation'); }
    for(const el of [...controls,...scene]) {
      const blocks=Array.from(el.querySelectorAll('.metrics,.stats,.calc,.equation,.values,.readouts,.readings,.reading')).filter(n=>!n.querySelector('input,select,button')&&!n.parentElement.closest('.metrics,.stats,.calc,.equation,.values,.readouts,.readings,.reading'));
      if(blocks.length){const card=document.createElement('section');card.className='lab-result-panel';paint(card,palettes.get(el));const h=document.createElement('h2');h.textContent='실시간 결과';card.append(h);for(const n of blocks)move(n,card);results.push(card);generated.push(card);}
    }
    for(const el of scene) { move(el,left); el.classList.add('lab-scene'); }
    for(const el of controls) move(el,right);
    if(body.dataset.labPage.includes('기주공명')){
      const actions=document.querySelector('.top-actions');
      if(actions && controls[0])move(actions,controls[0]);
    }
    if(results.length){focus.append(readings);focus.classList.add('lab-has-results');for(const el of results) move(el,readings);}
    for(const el of charts) { move(el,left); el.classList.add('lab-chart'); }
    function viewTabs(views,column){
      if(views.length<2)return;
      const nav=document.createElement('div');nav.className='lab-view-tabs';nav.setAttribute('role','group');nav.setAttribute('aria-label','관찰 화면 선택');generated.push(nav);views[0].before(nav);
      views.forEach((el,index)=>{const button=document.createElement('button');button.type='button';button.textContent=el.querySelector('h2,h3')?.textContent.trim()||(index?'그래프 '+index:'실험 장면');nav.append(button);button.setAttribute('aria-pressed',String(index===0));el.classList.toggle('lab-view-hidden',index!==0);button.addEventListener('click',()=>{views.forEach((v,i)=>{v.classList.toggle('lab-view-hidden',i!==index);nav.children[i].setAttribute('aria-pressed',String(i===index));});resize();});});
    }
    // Show observation and a graph together when they fit; retain tabs on smaller screens.
    let combined=false;
    if(window.innerWidth>=1200&&scene.length===1&&charts.length){
      const room=window.innerHeight-bar.getBoundingClientRect().height-32;
      const first=scene[0],graph=charts[0];
      if(first.getBoundingClientRect().height+graph.getBoundingClientRect().height+10<=room){
        combined=true;viewTabs(charts,left);
      }else{
        const hadResults=readings.parentNode===focus;
        if(!hadResults){focus.append(readings);focus.classList.add('lab-has-results');}
        charts.forEach(chart=>readings.append(chart));
        const resultHeight=Array.from(readings.children).filter(el=>!charts.includes(el)).reduce((sum,el)=>sum+el.getBoundingClientRect().height+10,0);
        if(resultHeight+graph.getBoundingClientRect().height+(charts.length>1?44:0)<=room){combined=true;viewTabs(charts,readings);}
        else{charts.forEach(chart=>left.append(chart));if(!hadResults){readings.remove();focus.classList.remove('lab-has-results');}}
      }
    }
    if(!combined)viewTabs([...scene,...charts],left);
    focus.classList.toggle('lab-combined',combined);
    // A single observation should use more of the available screen height.
    if(scene.length===1&&scene[0].querySelectorAll('canvas,svg').length===1){
      const sceneHeight=scene[0].getBoundingClientRect().height;
      const maxHeight=window.innerHeight-bar.getBoundingClientRect().height-36;
      if(sceneHeight+100<maxHeight&&(!combined||charts[0]?.parentNode!==left))scene[0].classList.add('lab-expanded-scene');
    }
    for(const el of more) {
      const details=document.createElement('details'); const summary=document.createElement('summary');
      summary.textContent=el.querySelector('h2,h3,summary')?.textContent.trim() || '해설 · 탐구 자료';
      paint(details,palettes.get(el));
      details.append(summary); extras.append(details); move(el,details);
      details.addEventListener('toggle',resize);
    }
    // Hide only empty presentation ancestors; original introduction stays in original mode.
    for(const el of Array.from(body.children)) {
      if(el===bar || el===focus || el===extras || /^(SCRIPT|STYLE|LINK)$/.test(el.tagName)) continue;
      el.classList.add('lab-empty'); empty.push(el);
    }
    resize();
  }
  function disable() {
    for(const {el,placeholder,color,priority} of moved) { placeholder.replaceWith(el); el.classList.remove('lab-piece','lab-scene','lab-chart','lab-navigation','lab-view-hidden','lab-expanded-scene');if(color)el.style.setProperty('color',color,priority);else el.style.removeProperty('color'); }
    moved.length=0;
    for(const el of generated)el.remove();generated.length=0;
    for(const el of empty) el.classList.remove('lab-empty'); empty.length=0;
    focus.remove(); focus.classList.remove('lab-has-results','lab-combined'); readings.remove(); readings.replaceChildren(); left.replaceChildren(); right.replaceChildren(); extras.remove(); extras.replaceChildren();
    document.querySelectorAll('.lab-native').forEach(el=>el.classList.remove('lab-native'));
    body.classList.remove('lab-compact'); toggle.setAttribute('aria-pressed','false'); toggle.textContent='한 화면 실험'; resize();
  }
  toggle.addEventListener('click',()=>body.classList.contains('lab-compact')?disable():enable());
  full.addEventListener('click',async()=>{
    try {
      if(document.fullscreenElement) await document.exitFullscreen();
      else if(document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else status.textContent='브라우저의 전체화면 기능을 이용해 주세요.';
    } catch { status.textContent='전체화면을 열지 못했습니다. 브라우저의 전체화면 기능을 이용해 주세요.'; }
  });
  document.addEventListener('fullscreenchange',()=>{full.textContent=document.fullscreenElement?'⛶ 전체화면 나가기':'⛶ 전체화면'; resize();});
  if(window.innerWidth>=1000) enable();
})();


