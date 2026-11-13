/* WiseWhisper unified thumbnails v2 · one renderer for every catalogue card.
   Experiment HTML, application URLs, categories and search data are untouched. */
(() => {
  'use strict';
  const colors = ['#77d9fb','#ffc982','#f6a68c','#b6a5ff','#83e1ba','#7db7ff','#a7a2ff','#eab5f0','#f1bc82'];
  const names = {'01':'운동과 힘','02':'일·에너지·운동량','03':'열과 열역학','04':'파동과 소리','05':'빛과 광학','06':'전기와 회로','07':'자기와 전자기 유도','08':'현대물리','09':'재미있는 어플들'};
  const W='#cddcf2', B='#7a9ab9', C='#7bdcfa', G='#84edbe', O='#ffc983', V='#c2b0ff';
  const ln=(x1,y1,x2,y2,c=C,w=4)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round"/>';
  const circ=(x,y,r,fill,extra='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" '+extra+'/>';
  const rect=(x,y,w,h,fill,stroke='none',sw=3,rx=10)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
  const path=(d,c=C,w=4,extra='')=>'<path d="'+d+'" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round" fill="none" '+extra+'/>';
  const arr=(x1,y1,x2,y2,c=O)=>{const a=Math.atan2(y2-y1,x2-x1),s=13;return ln(x1,y1,x2,y2,c,5)+path('M'+(x2-s*Math.cos(a-.52)).toFixed(1)+' '+(y2-s*Math.sin(a-.52)).toFixed(1)+' L'+x2+' '+y2+' L'+(x2-s*Math.cos(a+.52)).toFixed(1)+' '+(y2-s*Math.sin(a+.52)).toFixed(1),c,5);};
  function sine(x0,x1,mid,amp,per,c=C,phase=0) {
    let d=''; for(let x=x0;x<=x1;x+=5) d+=(x===x0?'M':'L')+x+' '+(mid-amp*Math.sin((x-x0)*Math.PI*2/per+phase)).toFixed(1)+' ';
    return path(d,c,5);
  }
  const axes=()=>ln(92,216,394,216,B,3)+ln(92,216,92,55,B,3);
  function art(kind,title,idx){
    const t=title.replace(/\s/g,'');
    if(kind==='01'){
      if(/케플러|원운동|구심|만유인력/.test(t))return '<ellipse cx="239" cy="138" rx="160" ry="85" fill="none" stroke="'+B+'" stroke-width="3" stroke-dasharray="7 7"/>'+circ(171,137,24,O)+circ(365,174,18,C)+arr(365,174,337,154,G);
      if(/용수철/.test(t)){let d='M125 137 ';for(let i=0;i<12;i++)d+='L'+(138+i*17)+' '+(i%2?107:167)+' ';return rect(96,72,13,130,'#6a87a2')+path(d,C,6)+rect(341,101,68,72,'#23486e',C,4)+arr(375,186,375,236,O);}
      if(/진자|진동/.test(t))return ln(231,52,334,191,G,5)+circ(334,191,29,O)+circ(231,52,10,W)+path('M115 187 Q241 22 357 183',B,3,'stroke-dasharray="8 9"');
      if(/포물선/.test(t))return ln(68,220,420,220,B)+path('M95 204 Q235 -20 385 200',C,5,'stroke-dasharray="8 7"')+circ(232,88,19,O)+arr(232,112,232,166,G);
      if(/마찰|경사면/.test(t))return path('M110 217 L393 217 L393 75 Z',B,5)+rect(254,123,64,49,'#2b5077',C,4)+arr(312,118,381,80,O);
      if(/속도|가속도|변위|그래프/.test(t))return axes()+path(/가속/.test(t)?'M96 207 Q206 194 371 78':'M96 195 L371 80',C,6)+circ(373,80,9,O);
      return ln(76,218,409,218,B)+rect(153,149,109,69,'#245477',C,4)+arr(265,183,384,183,O);
    }
    if(kind==='02'){
      if(/운동량|충격량/.test(t))return ln(63,219,430,219,B)+rect(103,151,99,63,'#234d75',C,4)+rect(284,151,99,63,'#5a492f',O,4)+circ(123,219,11,W)+circ(180,219,11,W)+circ(304,219,11,W)+circ(360,219,11,W)+arr(205,178,271,178,G);
      if(/탄성/.test(t))return path('M74 139 L97 139 L112 104 L129 174 L146 104 L163 174 L180 104 L197 174 L214 104 L231 174 L248 139 L267 139',C,6)+rect(269,101,84,77,'#2c4d74',O,4);
      if(/중력|보존/.test(t))return path('M108 215 L388 215 L388 81 Z',B,5)+rect(282,105,65,55,'#285575',C,4)+arr(345,156,394,192,O);
      return ln(65,216,420,216,B)+rect(174,148,110,67,'#285879',C,4)+arr(285,177,384,177,O)+rect(114,91,21,56,V)+rect(145,62,21,85,G);
    }
    if(kind==='03'){
      let s=rect(160,82,172,139,'#163349',B,4)+rect(146,82,200,15,'#a7b9ce','#a7b9ce',0,4)+rect(231,54,30,28,'#849eb5','#849eb5');
      for(const [i,p] of [[0,[188,130]],[1,[239,158]],[2,[289,119]],[3,[208,201]],[4,[278,188]],[5,[313,161]]]) s+=circ(p[0],p[1],8,i%2?O:C);
      s+=arr(119,209,119,126,O)+arr(379,110,379,192,G);
      if(/열기관|효율/.test(t))s+=path('M233 120 A48 48 0 1 1 218 189',G,5)+arr(209,192,232,182,G);
      return s;
    }
    if(kind==='04'){
      if(/도플러/.test(t)){let s='';for(let r=37;r<=149;r+=29)s+='<circle cx="302" cy="135" r="'+r+'" stroke="'+C+'" stroke-width="3" fill="none" opacity=".65"/>';return s+rect(151,148,132,54,'#e3ecf7','#e3ecf7')+rect(238,124,50,41,'#e3ecf7','#e3ecf7')+rect(175,144,33,10,'#f46f78','#f46f78',0,2)+rect(240,167,35,10,'#f46f78','#f46f78',0,2)+circ(185,205,14,'#17283b')+circ(261,205,14,'#17283b');}
      if(/기주/.test(t))return rect(210,65,72,159,'#18394f',C,4)+rect(213,174,66,49,'#3d70bc','#3d70bc',0,2)+sine(215,278,123,17,34,O)+path('M206 70 Q189 40 171 73 M284 70 Q301 40 319 73',G);
      if(/정상파|공명/.test(t))return ln(66,137,421,137,B,2)+sine(70,420,137,65,156,C)+sine(70,420,137,-65,156,V)+circ(70,137,9,O)+circ(418,137,9,O);
      if(/회절/.test(t))return ln(239,52,239,110,W,9)+ln(239,173,239,226,W,9)+sine(50,229,140,18,62,C)+'<path d="M258 105 Q317 140 258 175 M258 74 Q382 140 258 206" fill="none" stroke="'+G+'" stroke-width="5"/>';
      if(/간섭|중첩/.test(t))return sine(80,405,102,32,98,C)+sine(80,405,174,32,98,O,Math.PI);
      return sine(46,444,137,63,131,C)+ln(45,137,443,137,B,2);
    }
    if(kind==='05'){
      if(/슬릿|간섭/.test(t)){let s=circ(103,135,13,O)+ln(223,50,223,103,W,8)+ln(223,135,223,152,W,8)+ln(223,187,223,227,W,8);for(const y of [119,172])for(const yy of [77,114,155,198])s+=ln(232,y,408,yy,G,2);return s+rect(410,51,10,180,'#587b9d');}
      return path('M243 58 Q196 138 243 215 Q290 138 243 58 Z',C,5)+ln(60,135,419,135,B,2)+path('M77 88 L243 88 L400 186',O,4)+path('M77 88 L243 135 L400 186',G,4);
    }
    if(kind==='06'){
      if(/축전기|충전|방전/.test(t)){let s=ln(172,62,172,217,C,11)+ln(309,62,309,217,O,11);for(let y=87;y<202;y+=34)s+=arr(189,y,291,y,G);return s;}
      if(/트랜지스터/.test(t))return '<circle cx="240" cy="137" r="80" stroke="'+C+'" stroke-width="4" fill="#1c3852"/>'+ln(156,137,228,137,W,5)+ln(229,80,229,193,W,6)+ln(230,106,332,60,G,5)+ln(230,172,332,220,O,5)+arr(273,191,318,211,O);
      if(/회로|전류|옴|전력/.test(t))return path('M119 76 H375 V207 H119 V76',B,5)+ln(107,137,130,137,O,5)+ln(99,153,138,153,O,5)+path('M208 76 l15 -17 l15 34 l15 -34 l15 34 l15 -17',C,5)+circ(375,147,23,'#284962','stroke="'+G+'" stroke-width="4"');
      let s=circ(154,138,27,'#ef8187')+circ(338,138,27,'#6dafff');
      s+='<text x="154" y="150" font-size="40" font-weight="800" fill="#fff" text-anchor="middle">+</text><text x="338" y="149" font-size="37" font-weight="800" fill="#fff" text-anchor="middle">−</text>';
      for(const d of [-70,-35,0,35,70])s+=path('M182 '+(138+d/3)+' Q245 '+(138+d)+' 310 '+(138+d/3),G,2);
      return s;
    }
    if(kind==='07'){
      if(/스피커|전동기/.test(t))return rect(105,85,100,109,'#263c57',V,4)+path('M205 114 L326 70 L326 209 L205 166 Z',C,5)+sine(332,439,141,31,60,G);
      if(/변압기|유도|NFC|RFID/.test(t)){let s=rect(205,77,88,132,'none',B,11);for(let i=0;i<5;i++){s+='<ellipse cx="191" cy="'+(83+i*28)+'" rx="22" ry="12" fill="none" stroke="'+C+'" stroke-width="4"/><ellipse cx="304" cy="'+(83+i*28)+'" rx="22" ry="12" fill="none" stroke="'+O+'" stroke-width="4"/>';}return s+arr(221,145,277,145,G);}
      let s=ln(102,135,390,135,B,8);for(const r of [45,77,110])s+='<ellipse cx="243" cy="135" rx="'+(r+25)+'" ry="'+r+'" stroke="'+V+'" stroke-width="3" fill="none" opacity=".65"/>';return s+circ(243,135,16,O)+arr(243,118,243,53,C);
    }
    if(kind==='08'){
      if(/상대성/.test(t))return rect(102,180,280,39,'#345578',C,4)+rect(248,150,85,35,'#8aafda')+ln(137,92,137,180,G,4)+ln(352,92,352,180,G,4)+arr(159,97,320,97,O);
      if(/반도체|에너지띠/.test(t))return rect(104,66,292,42,'#5277a4')+rect(104,175,292,42,'#3d8b88')+arr(247,170,247,114,O)+circ(247,197,13,C)+circ(247,86,13,O);
      if(/광전|광자/.test(t))return sine(63,266,92,28,62,O)+rect(266,154,143,39,'#496482',C,4)+arr(319,151,385,62,G)+circ(385,62,11,O);
      if(/물질파|이중성/.test(t))return sine(67,221,139,39,70,C)+ln(252,62,252,111,W,9)+ln(252,163,252,217,W,9)+ln(412,62,412,218,B,11)+arr(273,137,404,95,G);
      if(/스펙트럼|준위|원자/.test(t))return circ(232,137,34,O)+'<ellipse cx="232" cy="137" rx="140" ry="59" stroke="'+C+'" stroke-width="4" fill="none" transform="rotate(-28 232 137)"/><ellipse cx="232" cy="137" rx="135" ry="59" stroke="'+V+'" stroke-width="4" fill="none" transform="rotate(30 232 137)"/>'+circ(342,89,13,G);
      return circ(228,137,39,O)+sine(78,411,137,46,108,C);
    }
    const icons=['📄','🃏','🎹','🎯','🧮','🕘','🚀','⚫','📊','🔢','🌠','💣','📔'];
    return '<circle cx="245" cy="135" r="88" fill="#344966" opacity=".65"/><text x="245" y="177" text-anchor="middle" font-size="108" font-family="system-ui, sans-serif">'+(icons[idx%icons.length])+'</text>';
  }
  function labelTitle(raw) {
    return raw.replace(/\s*[·ㆍ]\s*버전\s*1\b/g,' · A형')
      .replace(/\s*[·ㆍ]\s*버전\s*2\b/g,' · B형')
      .replace(/\s*통합\s*가상\s*실험실\s*$/,' · 통합 탐구')
      .replace(/\s*가상\s*실험실\s*$/,'')
      .replace(/\s*통합\s*실험실\s*$/,' · 통합 탐구')
      .replace(/\s*통합실험실\s*$/,' · 통합 탐구')
      .replace(/\s*실험실\s*$/,'')
      .replace(/\s+/g,' ').trim();
  }
  function paint(card,counts){
    if(card.dataset.thumbnailUnified==='yes')return;
    const meta=card.querySelector('.lab-meta'), heading=card.querySelector('h3');
    const launch=[...card.querySelectorAll('a[href]')].at(-1);
    if(!meta||!heading||!launch)return;
    const unit=(card.dataset.unit||'01').slice(0,2), nth=(counts[unit]||0)+1;
    counts[unit]=nth;
    const isApp=unit==='09', raw=heading.textContent.trim(), title=labelTitle(raw);
    heading.textContent=title;
    const type=meta.querySelector('.type'), unitName=meta.querySelector('.unit-name');
    if(type){type.textContent=(isApp?'APP ':'LAB ')+String(nth).padStart(2,'0');type.className='type lab-unified-number';}
    if(unitName)unitName.textContent=names[unit]||unitName.textContent;
    const oldIcon=card.querySelector(':scope > .app-icon');if(oldIcon)oldIcon.remove();
    let preview=card.querySelector(':scope > .lab-preview');
    if(!preview){preview=document.createElement('a');preview.className='lab-preview';card.insertBefore(preview,meta);}
    preview.href=launch.getAttribute('href');
    preview.target=launch.target||'_blank';preview.rel=launch.rel||'noopener noreferrer';
    preview.removeAttribute('style');
    preview.setAttribute('aria-label',title+' 열기');
    const hue=colors[Math.min(Number(unit)-1,8)]||C;
    const scene=art(unit,title,nth-1);
    preview.innerHTML='<svg class="unified-thumb-svg" viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+title.replace(/[&"<>]/g,'')+'의 주제를 나타내는 그림"><defs><radialGradient id="thbg'+unit+'"><stop stop-color="#182b43"/><stop offset="1" stop-color="#0b101c"/></radialGradient></defs><rect width="480" height="270" fill="url(#thbg'+unit+')"/><path d="M0 224 H480 M0 178 H480 M0 132 H480 M0 86 H480 M82 0 V270 M164 0 V270 M246 0 V270 M328 0 V270 M410 0 V270" fill="none" stroke="#29374a" stroke-width="1" opacity=".37"/><rect x="15" y="14" width="4" height="32" rx="2" fill="'+hue+'"/><circle cx="444" cy="32" r="4" fill="'+hue+'" opacity=".7"/><g>'+scene+'</g></svg>';
    card.dataset.thumbnailUnified='yes';
    const description=card.querySelector('.app-description');
    if(description)description.classList.add('unified-description');
    launch.setAttribute('aria-label',title+' 열기');
  }
  function refresh(){
    const counts={};
    document.querySelectorAll('.lab-card').forEach(card=>{
      const unit=(card.dataset.unit||'01').slice(0,2);
      if(card.dataset.thumbnailUnified==='yes'){counts[unit]=(counts[unit]||0)+1;return;}
      paint(card,counts);
    });
  }
  refresh();
  // Cards added later by the catalogue also inherit the same visual rules.
  const catalogue=document.getElementById('catalogue');
  if(catalogue&&typeof MutationObserver!=='undefined'){
    const observer=new MutationObserver(mutations=>{
      if(mutations.some(m=>[...m.addedNodes].some(node=>node.nodeType===1&&(node.matches?.('.lab-card')||node.querySelector?.('.lab-card')))))refresh();
    });
    observer.observe(catalogue,{childList:true,subtree:true});
  }
})();
