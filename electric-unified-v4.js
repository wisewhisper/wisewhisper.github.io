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
const id=decodeURIComponent(location.pathname.split("/").pop()||"").replace(/^06_전기와_회로_/,"").replace(/\.html$/,"");
const d=DATA[id];if(!d||id==="실험02_전기장과전위")return;
function init(){
 if(document.body.classList.contains("e6-ready"))return;
 const root=document.querySelector("main");if(!root)return;
 const panels=[...root.querySelectorAll(d.selector)];
 const types=d.types.split(",");
 if(panels.length!==types.length){console.warn("Electric lab panel mismatch",id,panels.length,types.length);return;}
 const shell=document.createElement("div");shell.className="e6-shell";
 const header=document.createElement("header");header.className="e6-header";
 const h=document.createElement("h1");h.textContent="⚡ "+(root.querySelector("h1")?.textContent||d.topic).replace(/^⚡\s*/,"");
 const full=document.createElement("button");full.textContent="⛶ 전체화면";full.onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});
 header.append(h,full);
 const nav=document.createElement("nav");nav.className="e6-tabs";nav.setAttribute("role","tablist");
 const area=document.createElement("div");area.className="e6-content";
 const scene=document.createElement("div");scene.className="e6-scene";
 const controls=document.createElement("aside");controls.className="e6-controls";
 const concepts=document.createElement("div");concepts.className="e6-concepts";
 const extras=[];
 const grouped={s:[],g:[],c:[],r:[],b:[],l:[]};
 panels.forEach((p,i)=>{const type=types[i];p.classList.add("e6-card");grouped[type].push(p);});
 grouped.s.forEach(p=>scene.append(p));
 [...grouped.c,...grouped.r].forEach(p=>controls.append(p));
 area.append(scene,controls,concepts);shell.append(header,nav,area);document.body.append(shell);
 const make=(heading,html)=>{const a=document.createElement("article");a.className="e6-concept";const title=document.createElement("h2");title.textContent=heading;const p=document.createElement("div");p.innerHTML=html;a.append(title,p);return a;};
 const safe=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
 const grid=document.createElement("div");grid.className="e6-concepts-grid";
 grid.append(make("① 핵심 개념",'<p>'+safe(d.concept)+'</p>'),make("② 공식과 물리량",'<div class="e6-formula">'+safe(d.formula)+'</div><p>공식의 기호·단위·부호와 적용 조건을 함께 확인하세요.</p>'),make("③ 계산 예제",'<p>'+safe(d.example)+'</p>'),make("④ 오개념과 모형의 한계",'<p>'+safe(d.caution)+'</p>'));
 const original=make("⑤ 탐구·기존 해설","");
 original.classList.add("e6-original");
 [...grouped.l].forEach(p=>original.append(p));grid.append(original);concepts.append(grid);
 const tabs=[["experiment","① 기본 실험"],["graph","② 그래프·비교"],["concept","③ 개념 설명"]];
 const buttons=tabs.map(([key,label])=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.dataset.tab=key;b.setAttribute("role","tab");b.onclick=()=>select(key);nav.append(b);return b;});
 function select(key){
 document.body.classList.toggle("e6-concept-mode",key==="concept");
 scene.replaceChildren(...(key==="graph"?[...grouped.g,...grouped.b]:grouped.s));
 controls.replaceChildren(...(key==="graph"?[...grouped.c,...grouped.r]:[...grouped.c,...grouped.r]));
 buttons.forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===key)));
 if(key!=="concept"){requestAnimationFrame(()=>{window.dispatchEvent(new Event("resize"));setTimeout(()=>window.dispatchEvent(new Event("resize")),80);});}
 }
 document.body.classList.add("e6-ready");select("experiment");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();