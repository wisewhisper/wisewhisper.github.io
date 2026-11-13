/* Independent slow 3D-style loops for the nine catalogue categories; no external assets. */
(() => {
'use strict';
const buttons=[...document.querySelectorAll('.filter-list .unit-filter[data-unit]')].filter(b=>b.dataset.unit!=='all');
const palette=['#79d7ff','#ffc878','#ff978e','#bd9bff','#8ae5b1','#76e7e4','#82b2ff','#c6a9ff','#ffd383'];
const anim=(typ,values,dur='2.8s',more='')=>'<animateTransform attributeName="transform" type="'+typ+'" values="'+values+'" dur="'+dur+'" repeatCount="indefinite" '+more+'/>';
const line=(d,col='#8adfff',w=5,extra='')=>'<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round" '+extra+'/>';
const circ=(x,y,r,col)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+col+'"/>';
const rect=(x,y,w,h,col,rx=8)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+col+'"/>';
function art(n){
 switch(n){
 case 0:return '<g>'+anim('translate','-22 0;50 0;-22 0')+rect(125,116,157,67,'url(#metal)')+rect(146,92,81,40,'url(#metal)')+
   circ(163,188,25,'url(#wheel)')+circ(261,188,25,'url(#wheel)')+
   circ(163,188,10,'#abcfea')+circ(261,188,10,'#abcfea')+
   line('M289 132H381M360 111L382 132L360 153','#7cddff',7)+'</g>';
 case 1:return rect(73,98,24,103,'url(#metal)')+
   '<g>'+anim('scale','1 1;.77 1;1 1')+line('M98 150L120 150L136 114L153 183L171 114L189 183L207 114L225 183L243 114L261 183L279 150','#9bd9f5',7)+'</g>'+
   '<g>'+anim('translate','0 0;-45 0;0 0')+circ(328,150,45,'url(#gold)')+circ(315,136,10,'#fff2c9')+'</g>';
 case 2:{
   let s=rect(148,69,184,151,'url(#glass)',18)+line('M147 85V207Q239 235 331 207V85','#81dafa',5);
   for(let k=0;k<9;k++){let x=174+k%3*60, y=107+Math.floor(k/3)*43;
     s+='<g>'+anim('translate','0 0;'+(k%2?13:-15)+' '+(k%3?11:-10)+';0 0','2.8s')+circ(x,y,8,k%2?'#f7b783':'#8adfff')+'</g>';}
   return s+'<g>'+anim('translate','0 0;0 30;0 0')+rect(138,61,204,19,'url(#metal)',5)+rect(222,23,35,41,'url(#metal)',5)+'</g>';
 }
 case 3:{
   let s=line('M-140 146Q-105 58 -70 146T0 146T70 146T140 146T210 146T280 146T350 146T420 146T490 146T560 146T630 146','#88caff',5);
   return '<g>'+anim('translate','0 0;-70 0;0 0')+s+'</g>'+line('M-30 195Q5 151 40 195T110 195T180 195T250 195T320 195T390 195T460 195T530 195','#b79dff',4);
 }
 case 4:return '<path d="M236 57Q185 139 236 219Q287 139 236 57Z" fill="url(#glass)" stroke="#a6ecff" stroke-width="5"/>'+
   line('M52 95H231L421 178M52 140H423M52 185H231L421 101','#ffd483',4)+
   '<g>'+anim('translate','-20 0;54 0;-20 0')+circ(110,95,7,'#fffae7')+circ(110,140,7,'#fffae7')+circ(110,185,7,'#fffae7')+'</g>';
 case 5:return line('M123 75H358V207H123V75','#df995b',9)+rect(113,135,17,54,'url(#metal)',2)+rect(131,145,17,34,'#e7c478',2)+
   circ(360,139,39,'url(#glass)')+
   '<g>'+circ(360,138,27,'#ffe5a8')+'<animate attributeName="opacity" values=".25;1;.25" dur="2.8s" repeatCount="indefinite"/></g>'+
   '<path d="M154 75H332M358 177V203H154" stroke="#82effd" stroke-width="5" stroke-linecap="round" stroke-dasharray="8 25" fill="none"><animate attributeName="stroke-dashoffset" values="0;-170" dur="2.8s" repeatCount="indefinite"/></path>';
 case 6:{
   let s='';for(let k=0;k<7;k++)s+='<ellipse cx="'+(220+k*21)+'" cy="137" rx="16" ry="57" fill="none" stroke="url(#copper)" stroke-width="8"/>';
   return s+'<g>'+anim('translate','-27 0;52 0;-27 0')+
     rect(86,108,112,59,'url(#metal)',6)+rect(86,108,57,59,'#bd5f68',6)+
     '<text x="114" y="147" font-size="24" text-anchor="middle" fill="#fff">N</text><text x="172" y="147" font-size="24" text-anchor="middle" fill="#fff">S</text></g>'+
     '<g>'+line('M180 91Q240 30 364 91M180 183Q241 244 364 187','#6dbeff',3)+
     '<animate attributeName="opacity" values=".25;1;.25" dur="2.8s" repeatCount="indefinite"/></g>';
 }
 case 7:return '<g><g>'+anim('rotate','0 240 139;360 240 139')+
   '<ellipse cx="240" cy="139" rx="158" ry="61" transform="rotate(-30 240 139)" fill="none" stroke="#558fff" stroke-width="4"/>'+
   circ(365,77,13,'url(#cyan)')+'</g><g>'+anim('rotate','360 240 139;0 240 139')+
   '<ellipse cx="240" cy="139" rx="154" ry="64" transform="rotate(30 240 139)" fill="none" stroke="#bf92f1" stroke-width="4"/>'+
   circ(114,200,12,'url(#cyan)')+'</g>'+circ(240,139,38,'url(#nucleus)')+'</g>';
 case 8:return '<g>'+anim('rotate','-3 242 142;3 242 142;-3 242 142')+
   '<path d="M154 57L306 49Q327 48 333 67L346 206Q348 219 332 223L180 232Q162 232 160 215Z" fill="url(#metal)" stroke="#85ccff" stroke-width="5"/>'+
   rect(179,89,58,49,'#515ac7',8)+rect(249,84,58,49,'#308c77',8)+
   rect(183,153,59,51,'#b77a36',8)+rect(254,149,59,51,'#346fbb',8)+
   '<text x="208" y="123" font-size="34" fill="white" text-anchor="middle">⚛</text>'+
   '<text x="277" y="119" font-size="33" fill="white" text-anchor="middle">∿</text>'+
   '<text x="213" y="188" font-size="33" fill="white" text-anchor="middle">⚙</text>'+
   '<text x="283" y="185" font-size="33" fill="white" text-anchor="middle">▦</text></g>';
 default:return '';
 }
}
function svg(n){
 const accent=palette[n],id='cat-bg-'+n;
 return '<svg viewBox="0 0 480 270" class="category-motion-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+
  '<defs><radialGradient id="'+id+'"><stop stop-color="#19334c"/><stop offset="1" stop-color="#070e18"/></radialGradient>'+
  '<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b7d6ef"/><stop offset=".45" stop-color="#446b91"/><stop offset="1" stop-color="#183650"/></linearGradient>'+
  '<radialGradient id="wheel"><stop stop-color="#639ac3"/><stop offset=".65" stop-color="#111e31"/><stop offset="1" stop-color="#9cc8e6"/></radialGradient>'+
  '<radialGradient id="gold" cx=".3" cy=".25"><stop stop-color="#fff1b6"/><stop offset=".5" stop-color="#e6a139"/><stop offset="1" stop-color="#75411e"/></radialGradient>'+
  '<linearGradient id="glass"><stop stop-color="#72d8fa" stop-opacity=".7"/><stop offset=".5" stop-color="#5cbade" stop-opacity=".14"/><stop offset="1" stop-color="#58b6e9" stop-opacity=".75"/></linearGradient>'+
  '<linearGradient id="copper"><stop stop-color="#ffda88"/><stop offset=".55" stop-color="#a8582b"/><stop offset="1" stop-color="#ffdfaa"/></linearGradient>'+
  '<radialGradient id="cyan"><stop stop-color="white"/><stop offset=".45" stop-color="#70dcff"/><stop offset="1" stop-color="#1b6edc"/></radialGradient>'+
  '<radialGradient id="nucleus"><stop stop-color="#ffa881"/><stop offset=".5" stop-color="#bc557c"/><stop offset="1" stop-color="#3d60ba"/></radialGradient></defs>'+
  '<rect width="480" height="270" fill="url(#'+id+')"/>'+
  '<path d="M0 232H480M0 204H480 M0 176H480 M88 164L35 270M174 164L150 270M306 164L331 270M392 164L445 270" fill="none" stroke="#294059" opacity=".64" stroke-width="1"/>'+
  '<g>'+art(n)+'</g><rect x="5" y="5" width="470" height="260" rx="9" fill="none" stroke="'+accent+'" stroke-opacity=".4" stroke-width="2"/></svg>';
}
buttons.forEach((button,i)=>{
 const prev=button.querySelector('.category-art');if(prev)prev.remove();
 const holder=document.createElement('span');holder.className='category-motion';
 holder.innerHTML=svg(i);
 const kicker=button.querySelector('.category-kicker');
 button.insertBefore(holder,kicker||button.firstChild);
 button.style.setProperty('--category-glow',palette[i]);
 button.classList.add('category-motion-ready');
});
document.addEventListener('visibilitychange',()=>{
 document.querySelectorAll('.category-motion-svg').forEach(svg=>{
   if(!svg.pauseAnimations)return;
   if(document.hidden)svg.pauseAnimations();else svg.unpauseAnimations();
 });
});
})();