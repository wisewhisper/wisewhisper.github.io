/* Zoom the document in place; crop handles keep their original coordinate system. */
'use strict';
let documentZoomDetailTimer;
let documentZoom=1,documentPanX=0,documentPanY=0,documentZoomKey='',documentPinch=null,documentPanDrag=null,documentLastTap=null,documentGestureMulti=false;
const documentPointers=new Map(),documentStage=document.querySelector('.editor .stage');
function zoomImageSize(){const r=documentStage.getBoundingClientRect(),fit=Math.min(r.width/Math.max(1,view.width),r.height/Math.max(1,view.height));return {r,w:view.width*fit,h:view.height*fit};}
function paintDocumentZoom(){
 const {r,w,h}=zoomImageSize(),mx=Math.max(0,(w*documentZoom-r.width)/2),my=Math.max(0,(h*documentZoom-r.height)/2);
 documentPanX=Math.max(-mx,Math.min(mx,documentPanX));documentPanY=Math.max(-my,Math.min(my,documentPanY));
 view.style.transform=cropping?'none':`translate(${documentPanX}px,${documentPanY}px) scale(${documentZoom})`;
 $('documentZoomLabel').textContent=Math.round(documentZoom*100)+'%';
 $('documentZoomTools').hidden=!current()||cropping;
 $('documentZoomOut').disabled=documentZoom<=1;$('documentZoomIn').disabled=documentZoom>=6;
}
function scheduleDocumentDetail(){
 clearTimeout(documentZoomDetailTimer);if(documentZoom<=1||cropping||compare||!current()||!baseImage)return;
 const id=current().id;documentZoomDetailTimer=setTimeout(()=>{if(cropping||compare||documentZoom<=1||current()?.id!==id)return;const c=processed(current(),baseImage,Math.max(baseImage.width,baseImage.height));view.width=c.width;view.height=c.height;ctx.drawImage(c,0,0);paintDocumentZoom();},220);
}
function setDocumentZoom(scale,anchor){
 if(!current()||cropping)return;
 const {r}=zoomImageSize(),old=documentZoom,next=Math.max(1,Math.min(6,scale)),a=anchor||{x:r.width/2,y:r.height/2};
 documentPanX=a.x-r.width/2-(a.x-r.width/2-documentPanX)*next/old;
 documentPanY=a.y-r.height/2-(a.y-r.height/2-documentPanY)*next/old;
 documentZoom=next;paintDocumentZoom();scheduleDocumentDetail();
}
function resetDocumentZoom(){clearTimeout(documentZoomDetailTimer);documentZoom=1;documentPanX=documentPanY=0;documentPointers.clear();documentPinch=documentPanDrag=documentLastTap=null;documentGestureMulti=false;navGesture=null;paintDocumentZoom();}
const zoomRender=render;
render=function(){zoomRender();const key=(current()?.id||'')+':'+!!cropping+':'+(baseImage?.width||0)+':'+(baseImage?.height||0);if(key!==documentZoomKey){documentZoomKey=key;resetDocumentZoom();}else paintDocumentZoom();};
const tools=document.createElement('div');tools.id='documentZoomTools';tools.className='document-zoom-tools';tools.setAttribute('aria-label','문서 확대 축소');
for(const [id,label,action] of [['documentZoomOut','−',()=>setDocumentZoom(documentZoom/1.35)],['documentZoomLabel','100%',resetDocumentZoom],['documentZoomIn','＋',()=>setDocumentZoom(documentZoom*1.35)]]){const b=document.createElement('button');b.id=id;b.type='button';b.textContent=label;b.setAttribute('aria-label',id==='documentZoomLabel'?'전체 문서 보기':id==='documentZoomOut'?'문서 축소':'문서 확대');b.onclick=action;tools.append(b);}
documentStage.append(tools);
const cropDown=view.onpointerdown,cropMove=view.onpointermove,cropUp=view.onpointerup,cropCancel=view.onpointercancel;
function zoomPoint(e){const r=documentStage.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
view.onpointerdown=e=>{
 if(cropping)return cropDown(e);if(!current())return;
 e.preventDefault();view.setPointerCapture(e.pointerId);documentPointers.set(e.pointerId,zoomPoint(e));
 if(documentPointers.size===1){documentGestureMulti=false;documentPanDrag={p:zoomPoint(e),x:documentPanX,y:documentPanY,time:performance.now(),moved:false};}
 if(documentPointers.size===2){documentLastTap=null;documentGestureMulti=true;const [a,b]=[...documentPointers.values()];documentPinch={distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),scale:documentZoom,center:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},x:documentPanX,y:documentPanY};}
};
view.onpointermove=e=>{
 if(cropping)return cropMove(e);if(!documentPointers.has(e.pointerId))return;e.preventDefault();const p=zoomPoint(e);documentPointers.set(e.pointerId,p);
 if(documentPointers.size===2&&documentPinch){const [a,b]=[...documentPointers.values()],g=documentPinch,c={x:(a.x+b.x)/2,y:(a.y+b.y)/2},r=documentStage.getBoundingClientRect();documentZoom=g.scale;documentPanX=g.x;documentPanY=g.y;setDocumentZoom(g.scale*Math.hypot(a.x-b.x,a.y-b.y)/g.distance,g.center);documentPanX+=c.x-g.center.x;documentPanY+=c.y-g.center.y;paintDocumentZoom();}
 else if(documentPointers.size===1&&documentPanDrag){const g=documentPanDrag;g.moved ||= Math.hypot(p.x-g.p.x,p.y-g.p.y)>10;if(documentZoom>1){documentPanX=g.x+p.x-g.p.x;documentPanY=g.y+p.y-g.p.y;paintDocumentZoom();}}
};
function releaseDocumentPointer(e,cancelled=false){
 if(cropping)return cancelled?cropCancel(e):cropUp(e);
 if(!documentPointers.has(e.pointerId))return;
 const p=zoomPoint(e),g=documentPanDrag;documentPointers.delete(e.pointerId);
 if(!cancelled&&!documentGestureMulti&&g){const dx=p.x-g.p.x,dy=p.y-g.p.y,now=performance.now();
  if(!g.moved&&Math.hypot(dx,dy)<10&&now-g.time<400){if(documentLastTap&&now-documentLastTap.time<320&&Math.hypot(p.x-documentLastTap.x,p.y-documentLastTap.y)<28){setDocumentZoom(documentZoom>1?1:2.5,p);documentLastTap=null;}else documentLastTap={...p,time:now};}
  else if(documentZoom===1&&Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4){documentLastTap=null;safe(()=>navigatePage(dx<0?1:-1));}
 }
 documentPinch=null;const rest=[...documentPointers.values()][0];documentPanDrag=rest?{p:rest,x:documentPanX,y:documentPanY,time:performance.now(),moved:true}:null;
}
view.onpointerup=e=>releaseDocumentPointer(e);view.onpointercancel=e=>releaseDocumentPointer(e,true);
view.addEventListener('wheel',e=>{if(!current()||cropping)return;e.preventDefault();setDocumentZoom(documentZoom*(e.deltaY<0?1.12:1/1.12),zoomPoint(e));},{passive:false});
window.addEventListener('resize',()=>paintDocumentZoom());
$('largePreview').hidden=true;$('largePreview').style.display='none';
view.setAttribute('aria-label','문서. 두 손가락 확대 축소, 확대 후 끌어서 이동, 두 번 누르면 확대 또는 전체 보기');
paintDocumentZoom();
