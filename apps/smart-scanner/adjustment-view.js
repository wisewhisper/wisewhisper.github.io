/* Same adjustment controls and render function, presented beside a large live preview. */
'use strict';
const adjustmentControls=document.querySelector('.adjust-controls'),adjustmentHome=adjustmentControls.parentElement;
function paintAdjustmentPreview(){if(!$('adjustDialog').open||!current()||!baseImage)return;const source=processed(current(),baseImage,1800),target=$('adjustLiveView');target.width=source.width;target.height=source.height;target.getContext('2d').drawImage(source,0,0);$('adjustReadout').textContent='밝기 '+current().brightness+' · 대비 '+current().contrast+' · '+({color:'컬러',gray:'회색조',bw:'흑백'}[current().filter]||'컬러');}
const adjustmentRender=render;render=function(){adjustmentRender();paintAdjustmentPreview();};
function openAdjustment(){if(!current()||ocrBusy)return;cropping=false;drag=-1;cropDrag=null;render();$('adjustControlSlot').append(adjustmentControls);$('adjustDialog').showModal();paintAdjustmentPreview();}
$('adjustClose').onclick=()=>$('adjustDialog').close();$('adjustDialog').addEventListener('close',()=>{adjustmentHome.prepend(adjustmentControls);cropping=false;compare=false;drag=-1;cropDrag=null;originalSwitchPanel('edit');render();});
$('adjustZoom').onclick=()=>{const stage=$('adjustLiveStage'),zoom=stage.classList.toggle('width-reading');$('adjustZoom').textContent=zoom?'전체 문서 보기':'폭에 맞춰 확대';};
const originalSwitchPanel=switchPanel;switchPanel=function(panel){originalSwitchPanel(panel);if(panel==='adjust'&&current()&&window.matchMedia('(max-width: 900px)').matches)openAdjustment();};
$('adjustEnlarge').onclick=openAdjustment;

$('paperBright').onclick=()=>{
  const page=current();
  if(!page||ocrBusy)return;
  checkpoint();
  page.brightness=16;
  page.contrast=12;
  page.ocrStale=true;
  compare=false;
  render();
};
