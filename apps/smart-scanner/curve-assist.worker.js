/* Offline, bounded 2D curve suggestion. Score is line alignment, never OCR accuracy. */
'use strict';
function estimateCurve({gray,w,h,region}) {
  const ink=new Float32Array(w*h),r=region||{x:0,y:0,w:1,h:1};
  const x0=Math.max(1,Math.floor(r.x*w)+2),x1=Math.min(w-1,Math.ceil((r.x+r.w)*w)-2);
  const y0=Math.max(1,Math.floor(r.y*h)+3),y1=Math.min(h-1,Math.ceil((r.y+r.h)*h)-3);
  if(x1-x0<55||y1-y0<70)return {accepted:false,reason:'영역이 너무 작습니다. 본문을 넓게 선택하세요.'};
  // Local paper brightness removes slow shadows without amplifying near-white noise.
  const stride=w+1,integral=new Float64Array(stride*(h+1));
  for(let y=0;y<h;y++){let row=0;for(let x=0;x<w;x++){row+=gray[y*w+x];integral[(y+1)*stride+x+1]=integral[y*stride+x+1]+row;}}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const l=Math.max(0,x-12),rr=Math.min(w,x+13),t=Math.max(0,y-12),b=Math.min(h,y+13);
    const avg=(integral[b*stride+rr]-integral[t*stride+rr]-integral[b*stride+l]+integral[t*stride+l])/((rr-l)*(b-t));
    ink[y*w+x]=Math.min(1,Math.max(0,(avg-gray[y*w+x]-14)/65));
  }
  const xs=[];for(let x=x0;x<x1;x+=2)xs.push(x);
  const fs=Object.fromEntries(['left','right','center'].map(shape=>[shape,xs.map(x=>{const u=x/(w-1);return shape==='left'?(1-u)**3:shape==='right'?u**3:4*u*(1-u);})]));
  function measure(shape,values){
    const rows=[],f=fs[shape];let mass=0,squares=0;
    for(let y=y0;y<y1;y++){
      const v=y/(h-1),a=v<.5?values[0]+(values[1]-values[0])*v*2:values[1]+(values[2]-values[1])*(v-.5)*2;
      let sum=0;for(let k=0;k<xs.length;k++){
        const sy=y+a*.01*f[k]*(h-1);if(sy<0||sy>=h-1)continue;
        const yy=Math.floor(sy),frac=sy-yy,i=yy*w+xs[k];sum+=ink[i]*(1-frac)+ink[i+w]*frac;
      }
      // A full-width illustration rule must not dominate the objective.
      sum=Math.min(sum,xs.length*.55);rows.push(sum);mass+=sum;squares+=sum*sum;
    }
    return {score:squares/Math.max(1,mass),mass,rows};
  }
  const baseline=measure('left',[0,0,0]),density=baseline.mass/(xs.length*(y1-y0));
  if(density<.012||density>.36)return {accepted:false,reason:'가로 글줄을 충분히 찾지 못했습니다. 본문만 영역 선택 후 다시 시도하세요.'};
  let best={shape:'left',values:[0,0,0],score:baseline.score};
  function score(shape,v){const m=measure(shape,v);return m.mass<baseline.mass*.90||m.mass>baseline.mass*1.10?0:m.score;}
  for(const shape of ['left','right','center']){
    let values=[0,0,0],s=baseline.score;
    for(const a of [-8,-4,0,4,8])for(const b of [-8,-4,0,4,8])for(const c of [-8,-4,0,4,8]){const v=[a,b,c],ss=score(shape,v);if(ss>s){values=v;s=ss;}}
    for(const step of [2,1,.5])for(let pass=0;pass<2;pass++)for(let i=0;i<3;i++){
      const old=values[i];let chosen=old;
      for(const d of [-step,step]){const v=values.slice();v[i]=Math.max(-10,Math.min(10,old+d));const ss=score(shape,v);if(ss>s){s=ss;chosen=v[i];}}
      values[i]=chosen;
    }
    if(s>best.score)best={shape,values,score:s};
    if(typeof self!=='undefined'&&self.postMessage)self.postMessage({progress:Math.round((['left','right','center'].indexOf(shape)+1)/3*100)});
  }
  const gain=best.score/Math.max(.001,baseline.score)-1;
  const final=measure(best.shape,best.values),mean=final.mass/final.rows.length;
  let bands=0,inside=false;
  for(const row of final.rows){if(row>mean*1.25){if(!inside)bands++;inside=true;}else inside=false;}
  if(gain<.08||bands<5||best.values.some(v=>Math.abs(v)>=10))return {accepted:false,gain,reason:'뚜렷한 보정 후보를 찾지 못했습니다. 수동 조절하거나 본문 영역을 다시 선택하세요.'};
  return {accepted:true,shape:best.shape,values:best.values,gain,bands};
}
if(typeof self!=='undefined')self.onmessage=e=>{try{self.postMessage({result:estimateCurve(e.data)});}catch(e){self.postMessage({error:String(e.message||e)});}};
if(typeof module!=='undefined')module.exports={estimateCurve};
