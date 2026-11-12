(()=>{"use strict";
const DATA={
"공식28_쿨롱의법칙":{selector:".grid > section.card",types:"s,r,c,b,g,l,l",topic:"쿨롱의 법칙",concept:"두 정지 점전하 사이의 힘은 전하량의 곱에 비례하고 거리의 제곱에 반비례합니다. 같은 부호는 척력, 다른 부호는 인력입니다. 두 전하에 작용하는 힘은 크기가 같고 방향이 반대입니다.",formula:"F = k|q₁q₂|/r² (N), k ≈ 8.99×10⁹ N·m²/C²",example:"+2 μC와 −3 μC가 0.30 m 떨어져 있으면 F≈0.599 N의 인력이 작용합니다. 거리가 2배면 힘은 1/4입니다.",caution:"점전하·정전기·진공 모형이며 거리 r은 중심 사이 거리입니다."},
"공식29_전기장":{selector:".layout > section > .panel",types:"s,g,c,b,l",topic:"전기장",concept:"전기장은 원천 전하가 공간에 만드는 벡터장입니다. 양의 시험전하가 받는 힘의 방향이 전기장 방향입니다. 음의 시험전하에는 반대 방향으로 힘이 작용합니다.",formula:"E⃗=F⃗/q₀, F⃗=q₀E⃗, |E|=k|Q|/r² (N/C)",example:"200 N/C 전기장에 −2 μC를 놓으면 힘의 크기는 4.0×10⁻⁴ N이며 전기장과 반대 방향입니다.",caution:"원천 전하가 같으면 시험전하 부호를 바꿔도 전기장은 변하지 않습니다."},
"공식30_점전하의전위":{selector:".layout > section > .panel",types:"s,g,c,r,b,l",topic:"점전하의 전위",concept:"전위는 단위 양전하당 전기적 위치에너지이며 스칼라입니다. 무한대 전위를 0으로 정하면 양전하 주변은 양의 전위, 음전하 주변은 음의 전위입니다.",formula:"V=kQ/r (V), U=q₀V, E⃗=−∇V",example:"+2 nC에서 0.20 m 떨어진 곳의 전위는 약 +89.9 V입니다. 거리를 2배로 하면 전위는 절반입니다.",caution:"전위가 0인 점에서도 전기장이 0이 아닐 수 있습니다. 점전하 위치에서는 식이 발산합니다."},
"공식31_전기용량":{selector:".grid > section > .card",types:"s,g,c,b,l,l",topic:"전기 용량",concept:"정전용량은 단위 전압당 저장되는 전하량입니다. 평행판 축전기의 정전용량은 면적에 비례하고 간격에 반비례합니다.",formula:"C=Q/V=κε₀A/d (F), U=½CV²",example:"A=0.020 m², d=0.002 m인 진공 평행판은 약 88.5 pF입니다.",caution:"전지 연결 상태에서는 전압이 일정하고 전지 분리 상태에서는 전하량이 일정합니다. 가장자리 효과를 무시합니다."},
"공식32_전류":{selector:".grid > section.card",types:"s,c,r,g,g,b,l",topic:"전류",concept:"전류는 단면을 통과한 순전하량을 시간으로 나눈 값입니다. 관습적 전류 방향은 양전하 이동 방향이며 금속 전자의 이동 방향과 반대입니다.",formula:"I=ΔQ/Δt (A), Q=It (I 일정)",example:"3초 동안 6 C가 지나가면 평균 전류는 2 A입니다. Q–t 그래프의 기울기가 전류입니다.",caution:"애니메이션 입자 속도는 실제 전자의 표류 속도와 다를 수 있습니다."},
"공식33_옴의법칙":{selector:".layout > section.panel",types:"c,s,g,b,l",topic:"옴의 법칙",concept:"일정한 온도의 옴성 저항에서는 전압과 전류가 비례합니다. 저항이 일정하면 전압을 2배로 할 때 전류도 2배입니다.",formula:"V=IR, I=V/R, R=V/I",example:"12 V 전원과 6 Ω 저항에서는 I=2 A입니다. I–V 그래프의 기울기는 1/R입니다.",caution:"발열로 저항이 변하는 소자에는 일정 저항 가정이 맞지 않을 수 있습니다."},
"공식34_전력":{selector:".layout > section.card",types:"s,r,c,g,b,l",topic:"전력과 에너지",concept:"전력은 단위 시간당 전달·변환되는 에너지입니다. 에너지는 전력이 작용한 시간에 비례합니다.",formula:"P=VI=I²R=V²/R (W), W=Pt (J)",example:"12 V에서 2 A가 흐르면 24 W이고 5초 동안 120 J를 전달합니다.",caution:"전력 W와 에너지 J는 서로 다른 물리량입니다. 식은 이상적인 직류 저항에 적용합니다."},
"실험01_옴의법칙과저항연결":{selector:".grid > section.card",types:"c,s,g,l,b",topic:"직렬·병렬 회로",concept:"직렬 연결에서는 전류가 같고 전압이 나뉩니다. 병렬 연결에서는 각 가지의 전압이 같고 전체 전류가 가지 전류의 합입니다.",formula:"R직렬=R₁+R₂, 1/R병렬=1/R₁+1/R₂, I=V/R합",example:"6 Ω 저항 2개를 12 V에 직렬 연결하면 1 A, 병렬 연결하면 전체 4 A입니다.",caution:"이상적인 전원·도선·계기를 가정합니다."},
"실험03_RC회로의충전과방전":{selector:".top > section, .meters, .visuals > section, .bottom > section",types:"c,c,r,s,g,l,l",topic:"RC 충전과 방전",concept:"충전 중 축전기 전압은 전원 전압에 접근하고 전류는 감소합니다. 방전 중 전압과 전하량은 지수적으로 감소합니다. 시간상수 τ=RC가 변화 속도를 정합니다.",formula:"충전 Vc=V₀(1−e^(−t/RC)), 방전 Vc=V초기 e^(−t/RC)",example:"R=10 kΩ, C=220 μF이면 τ=2.2 s입니다. 1τ 후 충전은 약 63.2%, 방전은 약 36.8%입니다.",caution:"화면 속 전하 이동은 시각적 표현이며 실제 전자의 표류 속도가 아닙니다."},
"실험04_평행판축전기":{selector:".layout > section, .study > section",types:"c,s,g,b,l,l",topic:"평행판 축전기",concept:"전지 연결 상태에서는 전압 V가 일정하고 전하량 Q가 변할 수 있습니다. 전지 분리 상태에서는 Q가 일정하고 전압이 변합니다.",formula:"C=κε₀A/d, Q=CV, U=½CV²=Q²/(2C)",example:"극판 간격을 2배로 하면 C는 절반입니다. 연결 상태에서는 U도 절반, 분리 상태에서는 U가 2배가 됩니다.",caution:"가장자리 효과·누설을 무시한 이상적 축전기입니다."},
"실험05_NPN트랜지스터스위치":{selector:".grid > section",types:"s,c,l,l",topic:"NPN 트랜지스터 스위치",concept:"베이스 전류로 컬렉터 전류를 제어합니다. 차단 상태는 열린 스위치, 포화 상태는 거의 닫힌 스위치처럼 작동합니다.",formula:"활성 영역 Ic≈βIb, Ib≈(Vin−VBE)/RB",example:"Vin=5 V, RB=10 kΩ, VBE≈0.7 V라면 Ib≈0.43 mA입니다. 실제 Ic는 부하와 포화 조건의 제한을 받습니다.",caution:"VBE와 β는 실제 소자·온도에 따라 달라집니다."},
"실험06_NPN트랜지스터증폭":{selector:".layout > section, .layout > .right > section",types:"c,s,g,l,l",topic:"NPN 트랜지스터 증폭",concept:"공통 이미터 증폭에서는 베이스 전류 증가가 컬렉터 전류 증가를 일으키고 컬렉터 전압은 감소합니다. 출력 전압 변화는 입력과 반전 관계입니다.",formula:"활성 영역 Ic≈βIb, Vout≈VCC−IcRC",example:"β≈100, RC=1 kΩ에서 베이스 전류가 10 μA 증가하면 컬렉터 전류가 약 1 mA 증가하고 출력은 약 1 V 감소합니다.",caution:"차단·포화 영역에서는 선형 증폭 근사가 성립하지 않아 파형이 왜곡됩니다."}
};


const FILE=decodeURIComponent((location.pathname.split("/").pop()||"").split("?")[0]);
const ID=FILE.replace(/^06_전기와_회로_/,"").replace(/\.html$/,"");
const info=DATA[ID];
if(!info||ID==="실험02_전기장과전위")return;
// Each item is matched by its REAL heading. Avoid assigning positions from arbitrary DOM order.
const PANELS={
"공식28_쿨롱의법칙":[["두 점전하 사이의 힘","scene"],["실시간 계산","readout"],["예측하고 조작하기","controls"],["조건 A·B 비교","comparison"],["거리–힘 관계 그래프","graph"],["예측 → 조작 → 관찰 → 설명","lesson"],["오개념과 적용 조건","lesson"]],
"공식29_전기장":[["예측 → 조작 → 관찰","scene"],["관계 그래프","graph"],["변수 조작","controls"],["조건 A·B 비교","comparison"],["설명하며 탐구하기","lesson"]],
"공식30_점전하의전위":[["전위 지도","scene"],["거리–전위 관계 그래프","graph"],["조건 조작","controls"],["실시간 계산","readout"],["조건 A·B 비교","comparison"],["예측하고 설명하기","lesson"]],
"공식31_전기용량":[["평행판 축전기 실험","scene"],["전하량–전압 관계 그래프","graph"],["조건 조작","controls"],["조건 A · B 비교","comparison"],["공식과 기호","lesson"],["탐구 질문 · 펼쳐 보는 해설","lesson"]],
"공식32_전류":[["단면을 통과하는 전하","scene"],["예측하고 조작하기","controls"],["공식 → 대입 → 결과","readout"],["전하량–시간 그래프","graph"],["시간을 바꾸면 전류는?","graph"],["조건 A · B 비교","comparison"],["탐구와 해설","lesson"]],
"공식33_옴의법칙":[["조작 · 이상적인 직류 회로","scene"],["예측 → 조작 → 관찰","controls"],["전압–전류 관계 그래프","graph"],["같은 기준으로 조건 비교","comparison"],["설명 · 탐구 질문","lesson"]],
"공식34_전력":[["직류 저항 회로","scene"],["에너지 측정","readout"],["예측하고 조작하기","controls"],["관계 그래프","graph"],["조건 A · B 비교","comparison"],["예측 → 조작 → 관찰 → 설명","lesson"]],
"실험01_옴의법칙과저항연결":[["실험 조건","controls"],["회로와 계기","scene"],["I–V 그래프","graph"],["탐구 활동 · 10분","lesson"],["측정 기록","comparison"]],
"실험03_RC회로의충전과방전":[["실험 조건 조절","controls"],["충전·방전 실험","controls"],["전하 이동 관찰","scene"],["전압·전류 그래프","graph"],["실험에서 확인할 사실","lesson"],["생각해 볼 문제","lesson"]],
"실험04_평행판축전기":[["실험 변수","controls"],["축전기 내부 관찰","scene"],["극판 간격에 따른 변화","graph"],["측정 기록","comparison"],["탐구 활동 · 5분","lesson"],["모형과 주의점","lesson"]],
"실험05_NPN트랜지스터스위치":[["전류의 길을 관찰하세요","scene"],["입력으로 스위치를 조작하세요","controls"],["스위치는 어떻게 켜질까요?","lesson"],["5분 탐구 활동","lesson"]],
"실험06_NPN트랜지스터증폭":[["실험 조건","controls"],["전류의 제어와 출력의 반전","scene"],["전류 증폭","graph"],["어떻게 증폭될까요?","lesson"],["직접 탐구해 보세요","lesson"]]
};
const MODES={
"실험01_옴의법칙과저항연결":[["단일 저항",'[data-mode="single"]'],["직렬 연결",'[data-mode="series"]'],["병렬 연결",'[data-mode="parallel"]']],
"실험03_RC회로의충전과방전":[["충전","#charge"],["방전","#discharge"]],
"실험04_평행판축전기":[["전지 연결","#connected"],["전지 분리","#isolated"]],
"실험05_NPN트랜지스터스위치":[["LOW","#off"],["HIGH","#on"]],
"실험06_NPN트랜지스터증폭":[["정상 증폭",'[data-preset="normal"]'],["차단 왜곡",'[data-preset="cutoff"]'],["포화 왜곡",'[data-preset="saturation"]']]
};
const LIGHT=new Set(["공식28_쿨롱의법칙","공식29_전기장","공식30_점전하의전위","공식31_전기용량","공식33_옴의법칙","공식34_전력","실험06_NPN트랜지스터증폭"]);
function initialize(){
if(document.body.dataset.electricV6)return;
const main=document.querySelector("main");if(!main)return;
const conf=PANELS[ID];if(!conf)return;
const elements=Array.from(main.querySelectorAll("section.card,div.card,section.panel,div.panel"));
const panels=elements.filter(el=>!el.parentElement?.closest(".card,.panel"));
if(panels.length!==conf.length){console.warn("Electrical lab: panel count mismatch; original content preserved.",ID,panels.length,conf.length);return;}
const grouped={scene:[],controls:[],readout:[],graph:[],comparison:[],lesson:[]};
const unused=conf.map((c,i)=>({needle:c[0],type:c[1],i,used:false}));
for(const p of panels){
 const title=(p.querySelector("h2,h3")?.textContent||"").replace(/\s+/g," ").trim();
 const candidate=unused.find(x=>!x.used&&title.includes(x.needle));
 if(!candidate){console.warn("Electrical lab: unmapped panel; original page preserved.",ID,title);return;}
 candidate.used=true;grouped[candidate.type].push(p);
}
if(unused.some(x=>!x.used)){console.warn("Electrical lab: panels unmatched; original page preserved.",ID);return;}
const root=document.createElement("div");root.className="e7-shell";root.id="electric-lab-v6";
if(LIGHT.has(ID))root.classList.add("e7-light-art");
root.dataset.lab=ID;
const heading=document.createElement("header");heading.className="e7-header";
const h=document.createElement("h1");
h.textContent="⚡ "+(main.querySelector("h1")?.textContent||info.topic).replace(/^⚡\s*/,"").trim();
const small=document.createElement("span");small.className="e7-mark";small.textContent="전기와 회로 · 탐구 실험";
const fullscreen=document.createElement("button");fullscreen.type="button";fullscreen.className="e7-fullscreen";fullscreen.textContent="⛶ 전체화면";heading.append(h,small,fullscreen);
fullscreen.addEventListener("click",()=>{(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()).catch?.(()=>{});});
const navigation=document.createElement("nav");navigation.className="e7-tabs";navigation.setAttribute("role","tablist");navigation.setAttribute("aria-label","실험 종류 선택");
const space=document.createElement("div");space.className="e7-workspace";
const stage=document.createElement("div");stage.className="e7-stage";
const graphstage=document.createElement("div");graphstage.className="e7-graphstage";
const side=document.createElement("aside");side.className="e7-side";side.setAttribute("aria-label","실험 조건과 실시간 측정값");
const lessons=document.createElement("section");lessons.className="e7-concepts";
space.append(stage,graphstage,side,lessons);
root.append(heading,navigation,space);
document.body.append(root);
for(const node of panels)node.classList.add("e7-panel");
// Move each ORIGINAL node exactly ONCE. No per-tab node removal/replacement.
for(const node of grouped.scene)stage.append(node);
for(const node of grouped.graph)graphstage.append(node);
for(const node of grouped.comparison)graphstage.append(node);
const toolbar=main.querySelector(".toolbar");
if(toolbar&&!toolbar.closest(".card,.panel")){toolbar.classList.add("e7-toolbar");side.append(toolbar);}
for(const node of grouped.controls)side.append(node);
for(const node of grouped.readout)side.append(node);
if(ID==="실험03_RC회로의충전과방전"){
 const meter=main.querySelector("section.meters");
 if(meter){meter.classList.add("e7-meterstrip");side.append(meter);}
 const formula=main.querySelector("#equation");
 if(formula){formula.classList.add("e7-original-equation");grouped.lesson.unshift(formula);}
}
if(ID==="실험01_옴의법칙과저항연결"){
 const meter=stage.querySelector(".meters");
 if(meter){meter.classList.add("e7-meterstrip");side.append(meter);}
 const table=stage.querySelector("table.detail");
 if(table){const panel=document.createElement("section");panel.className="e7-panel e7-detailcard";const title=document.createElement("h2");title.textContent="소자별 전압·전류 상세값";panel.append(title,table);graphstage.append(panel);}
}
if(ID==="실험04_평행판축전기"||ID==="실험05_NPN트랜지스터스위치"||ID==="실험06_NPN트랜지스터증폭"){
 const metrics=stage.querySelector(".meters,.readings,.readouts");
 if(metrics){metrics.classList.add("e7-meterstrip");side.append(metrics);}
}
if(ID==="실험05_NPN트랜지스터스위치"){
 const chart=side.querySelector("#graph");
 if(chart){
  const box=document.createElement("section");box.className="e7-panel e7-detailcard";
  const title=document.createElement("h2");title.textContent="입력 전압에 따른 컬렉터 전류";box.append(title,chart);
  const threshold=side.querySelector("#threshold");if(threshold)box.append(threshold);
  graphstage.append(box);
 }
}
if(ID==="실험06_NPN트랜지스터증폭"){
 // Original toolbar is outside the controls panel; it remains mounted in the side.
}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function makeCard(label,html){
 const card=document.createElement("article");card.className="e7-concept-card";
 const title=document.createElement("h2");title.textContent=label;card.append(title);
 const inner=document.createElement("div");inner.innerHTML=html;card.append(inner);
 return card;
}
const conceptGrid=document.createElement("div");conceptGrid.className="e7-conceptgrid";
conceptGrid.append(
makeCard("① 핵심 물리 개념",'<p>'+esc(info.concept)+'</p>'),
makeCard("② 공식·기호·단위",'<div class="e7-formula">'+esc(info.formula)+'</div><p>단위·좌표·기호의 부호와 이상적 모델의 가정을 확인합니다.</p>'),
makeCard("③ 계산 예제",'<p>'+esc(info.example)+'</p>'),
makeCard("④ 오개념과 적용 한계",'<p>'+esc(info.caution)+'</p>')
);
const original=makeCard("⑤ 실험 탐구와 추가 해설","");
original.classList.add("e7-original");
for(const item of grouped.lesson){item.classList.add("e7-original-item");original.append(item);}
conceptGrid.append(original);lessons.append(conceptGrid);
const modeDefs=(MODES[ID]||[["실험 장면",null]]).map((mode,i)=>({id:"m"+i,label:mode[0],action:mode[1]}));
const tabs=[...modeDefs,{id:"graphs",label:"그래프·비교"},{id:"concepts",label:"개념 설명"}];
const buttons=[];
let active=null;
function announceResize(){requestAnimationFrame(()=>window.dispatchEvent(new Event("resize")));}
function choose(tab,activate){
 if(tab.id===active){if(activate&&tab.action){const btn=document.querySelector(tab.action);if(btn)btn.click();}return;}
 active=tab.id;
 root.dataset.view=tab.id==="graphs"?"graphs":tab.id==="concepts"?"concepts":"experiment";
 stage.hidden=root.dataset.view!=="experiment";
 graphstage.hidden=root.dataset.view!=="graphs";
 side.hidden=root.dataset.view==="concepts";
 lessons.hidden=root.dataset.view!=="concepts";
 buttons.forEach(b=>{const isOn=b.dataset.tab===tab.id;b.setAttribute("aria-selected",String(isOn));b.tabIndex=isOn?0:-1;});
 if(tab.action&&activate){
 const control=document.querySelector(tab.action);if(control)control.click();
 }
 if(root.dataset.view!=="concepts"){
  announceResize();
  requestAnimationFrame(()=>requestAnimationFrame(announceResize));
 }
}
tabs.forEach((t,i)=>{
 const b=document.createElement("button");b.type="button";b.textContent=t.label;b.dataset.tab=t.id;b.setAttribute("role","tab");b.setAttribute("aria-selected","false");
 b.addEventListener("click",()=>choose(t,true));
 b.addEventListener("keydown",e=>{if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;e.preventDefault();const next=(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;buttons[next].focus();choose(tabs[next],true);});
 navigation.append(b);buttons.push(b);
});
if(!graphstage.children.length){
 const message=document.createElement("p");message.className="e7-empty";message.textContent="이 실험에서는 현재 그래프·비교 기록 대신 실험 장면에서 물리 관계를 관찰합니다.";graphstage.append(message);
}
document.addEventListener("fullscreenchange",()=>{
 fullscreen.textContent=document.fullscreenElement?"⛶ 전체화면 종료":"⛶ 전체화면";
 announceResize();
});
document.body.dataset.electricV6="1";choose(tabs[0],false);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});else initialize();
})();
