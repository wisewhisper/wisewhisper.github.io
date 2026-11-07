/* Local live document guide; user shutter only. Never silently crops an uncertain frame. */
'use strict';
let cameraQualityMode='normal';
let documentCameraTimer=0,documentCameraGeneration=0,documentCameraPoints=null,documentCameraStable=0,documentCameraBusy=false;
function cameraPointDistance(a,b){return !a||!b?Infinity:Math.max(...a.map((p,i)=>Math.hypot(p.x-b[i].x,p.y-b[i].y)))}
function detectCameraDocument(image){return detectDocumentQuad(image,Math.max(image.width,image.height)>640?640:420)}
function drawCameraOutline(pts,ready){
  const v=$('video'),o=$('cameraOutline'),box=v.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);o.width=Math.max(1,Math.round(box.width*dpr));o.height=Math.max(1,Math.round(box.height*dpr));const x=o.getContext('2d');x.clearRect(0,0,o.width,o.height);if(!pts||!v.videoWidth)return;
  const scale=Math.min(o.width/v.videoWidth,o.height/v.videoHeight),w=v.videoWidth*scale,h=v.videoHeight*scale,dx=(o.width-w)/2,dy=(o.height-h)/2;
  x.beginPath();pts.forEach((p,i)=>{const xx=dx+p.x*w,yy=dy+p.y*h;i?x.lineTo(xx,yy):x.moveTo(xx,yy)});x.closePath();x.strokeStyle=ready?'#63efad':'#ffcc72';x.fillStyle=ready?'#63efad18':'#ffcc7210';x.lineWidth=3*dpr;x.fill();x.stroke();for(const p of pts){x.beginPath();x.arc(dx+p.x*w,dy+p.y*h,5*dpr,0,Math.PI*2);x.fillStyle=x.strokeStyle;x.fill();}
}
function closeCamera(){window.scannerRetakeTarget=null;documentCameraGeneration++;clearTimeout(documentCameraTimer);documentCameraTimer=0;stream?.getTracks().forEach(t=>t.stop());stream=null;$('video').srcObject=null;documentCameraPoints=null;documentCameraStable=0;$('shutter').disabled=true;drawCameraOutline(null,false);if($('cameraDialog').open)$('cameraDialog').close();}
function scanCameraFrame(generation){
  if(generation!==documentCameraGeneration||!stream||!$('cameraDialog').open)return;
  const v=$('video');if(v.videoWidth&&v.readyState>=2){$('shutter').disabled=documentCameraBusy;try{const s=Math.min(1,420/Math.max(v.videoWidth,v.videoHeight)),c=canvas(Math.round(v.videoWidth*s),Math.round(v.videoHeight*s));c.getContext('2d').drawImage(v,0,0,c.width,c.height);const pts=detectCameraDocument(c);documentCameraStable=cameraPointDistance(pts,documentCameraPoints)<.035?documentCameraStable+1:1;documentCameraPoints=documentCameraStable>1?pts.map((p,i)=>({x:documentCameraPoints[i].x*.3+p.x*.7,y:documentCameraPoints[i].y*.3+p.y*.7})):pts;const ready=documentCameraStable>=3;drawCameraOutline(documentCameraPoints,ready);$('cameraGuide').textContent=ready?'문서 경계가 안정적입니다. 글자가 잘리지 않는지 확인하고 촬영하세요.':'문서 경계를 찾았습니다. 잠시 고정해 주세요.';}catch(e){documentCameraPoints=null;documentCameraStable=0;drawCameraOutline(null,false);$('cameraGuide').textContent='문서 전체와 바깥 여백을 비춰 주세요. 경계가 없어도 촬영 후 직접 자를 수 있습니다.';}}
  documentCameraTimer=setTimeout(()=>scanCameraFrame(generation),400);
}
$('camera').onclick=()=>safe(async()=>{
  if(ocrBusy||documentCameraBusy||window.nativeCapturePending)return;if(window.AndroidScanner){openNativeHighCamera();return;}if(pages.length>=MAX_PAGES)throw Error('페이지가 가득 찼습니다. 먼저 PDF로 저장하세요.');closeCamera();const generation=documentCameraGeneration;
  $('cameraDialog').querySelector('h2').textContent='문서 촬영';$('shutter').disabled=true;$('cameraGuide').textContent='카메라를 준비합니다. 처음에는 카메라 권한을 허용하세요.';$('cameraDialog').showModal();
  try{if(!navigator.mediaDevices?.getUserMedia)throw Error('카메라 API 없음');const high=cameraQualityMode==='high';const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:high?4096:2560},height:{ideal:high?3072:1920}},audio:false});if(generation!==documentCameraGeneration||!$('cameraDialog').open){next.getTracks().forEach(t=>t.stop());return;}stream=next;const v=$('video');v.srcObject=stream;await v.play();if(generation!==documentCameraGeneration)return;$('cameraResolution').textContent=(high?'고화질':'일반')+' · 미리보기 '+v.videoWidth+'×'+v.videoHeight+'px · 촬영 후 실제 저장 크기를 표시합니다.';scanCameraFrame(generation);
  }catch(e){if(generation!==documentCameraGeneration)return;closeCamera();$('cameraDialog').showModal();$('cameraGuide').textContent='카메라를 열지 못했습니다. 앱의 카메라 권한을 확인하세요. 닫은 뒤 다시 시도하거나 갤러리를 이용하세요.';status('카메라 권한을 확인하거나 갤러리에서 사진을 가져오세요.');}
});
$('closeCamera').onclick=closeCamera;$('cameraDialog').addEventListener('cancel',e=>{e.preventDefault();closeCamera()});$('cameraDialog').addEventListener('close',()=>{if(!$('cameraDialog').open&&(stream||documentCameraTimer))closeCamera()});
function openNativeHighCamera(retakeTarget=window.scannerRetakeTarget||null){
  if(pages.length>=MAX_PAGES){status('문서당 최대 30페이지입니다.');return;}
  if(window.nativeCapturePending||documentCameraBusy)return;
  closeCamera();
  if(window.AndroidScanner?.capturePhoto){
    window.nativeCapturePending=true;
    safe(async()=>{
      try{
        await window.scannerResume.save();
        const context=JSON.stringify({retakeTarget});
        if(AndroidScanner.capturePhotoWithContext)AndroidScanner.capturePhotoWithContext(context);
        else AndroidScanner.capturePhoto();
      }catch(error){
        window.nativeCapturePending=false;
        throw error;
      }
    });
  }else $('capture').click();
}
$('cameraFallback').hidden=true;
$('cameraFallback').style.display='none';
$('cameraFallback').onclick=openNativeHighCamera;
$('capture').onchange=event=>{
  const file=event.target.files[0];
  event.target.value='';
  if(!file)return;
  safe(async()=>{
    if(documentCameraBusy)return;
    documentCameraBusy=true;
    const url=URL.createObjectURL(file);
    try{
      const {width,height,fallback}=await addSource(url,'고화질 촬영',{mode:'high',file});
      await window.scannerResume.save();
      status(`사진 추가 · ${width}×${height}px${fallback?' · 메모리 보호로 해상도 감소':''} · 필요하면 영역 조정을 누르세요.`);
    }finally{documentCameraBusy=false;URL.revokeObjectURL(url);}
  });
};
$('shutter').onclick=()=>safe(async()=>{
  const v=$('video');if(documentCameraBusy||window.nativeCapturePending)return;
  if(!v.videoWidth||v.readyState<2)return;
  const retakeTarget=window.scannerRetakeTarget;
  documentCameraBusy=true;$('shutter').disabled=true;const auto=$('cameraAutoCrop').checked,stable=documentCameraStable>=3,live=documentCameraPoints;
  try{const generation=documentCameraGeneration,mode=cameraQualityMode;let image=v,photoURL=null,photoUsed=false;
    if(mode==='high'&&window.ImageCapture&&stream?.getVideoTracks()[0]){try{const capture=new ImageCapture(stream.getVideoTracks()[0]),caps=await cameraPhotoTimeout(capture.getPhotoCapabilities()),settings={};if(caps.imageWidth?.max)settings.imageWidth=Math.min(6000,caps.imageWidth.max);if(caps.imageHeight?.max)settings.imageHeight=Math.min(6000,caps.imageHeight.max);const blob=await cameraPhotoTimeout(capture.takePhoto(settings));photoURL=URL.createObjectURL(blob);image=await loadImage(photoURL);photoUsed=true;}catch(e){image=v;}finally{if(photoURL)URL.revokeObjectURL(photoURL);}}
    if(generation!==documentCameraGeneration||!stream)return;
    const source=photoUsed?image:canvas(v.videoWidth,v.videoHeight);if(!photoUsed)source.getContext('2d').drawImage(v,0,0,source.width,source.height);const res=resolutionCanvas(source,mode),c=res.canvas;let pts=null;if(auto)try{const fresh=detectCameraDocument(c);if(stable&&cameraPointDistance(fresh,live)<.06&&(!photoUsed||Math.abs(c.width/c.height-v.videoWidth/v.videoHeight)<.03))pts=fresh;}catch(e){}closeCamera();await addSource(c.toDataURL('image/jpeg',.98),'문서 촬영',{mode:res.mode});$('resolutionInfo').textContent=(mode==='high'?'고화질 요청':'일반 촬영')+' → 실제 '+c.width+'×'+c.height+'px · '+(photoUsed?'정지 사진 촬영':'미리보기 프레임 저장')+(res.fallback?' · 메모리 보호로 해상도 감소':'');
    if(auto&&pts){try{const cropped=warp(baseImage,pts);current().base=cropped.toDataURL('image/jpeg',.97);current().ocrStale=true;await select(selected);status('문서 영역을 자동으로 잘라 원근을 보정했습니다. 잘못 잘렸다면 원본 복원 후 모서리를 조절하세요.');}catch(e){status('원본 사진을 유지했습니다. 필요하면 영역 조정을 눌러 주세요.');}}
    else if(auto){status('사진을 추가했습니다. 문서 영역을 확인하고 필요하면 영역 조정을 눌러 주세요.');}else status('전체 사진을 추가했습니다. 필요하면 모서리 편집으로 자르세요.');
    if(retakeTarget)await window.scannerFinishRetake(retakeTarget);
    await window.scannerResume.save();
  }finally{documentCameraBusy=false;}
});
window.stopDocumentCamera=()=>{if(stream)closeCamera()};document.addEventListener('visibilitychange',()=>{if(document.hidden)closeCamera()});window.addEventListener('pagehide',closeCamera);

function setCameraQuality(mode){if(documentCameraBusy||window.nativeCapturePending)return;cameraQualityMode=mode;$('cameraNormal').setAttribute('aria-pressed',String(mode==='normal'));$('cameraHigh').setAttribute('aria-pressed',String(mode==='high'));if($('cameraDialog').open){const retake=window.scannerRetakeTarget;$('camera').click();window.scannerRetakeTarget=retake;if(retake)$('cameraDialog').querySelector('h2').textContent='현재 쪽 다시 찍기';}}
$('cameraNormal').onclick=()=>setCameraQuality('normal');$('cameraHigh').onclick=()=>setCameraQuality('high');
$('captureQuality').onchange=()=>{$('resolutionInfo').textContent=highResolution()?'사진 가져오기: 최대 6000px / 1,250만 화소. 이미 추가한 사진과 촬영 품질에는 적용되지 않습니다.':'사진 가져오기: 최대 3600px / 600만 화소. 촬영 품질은 촬영 화면에서 선택합니다.';};

function cameraPhotoTimeout(promise){let timer;return Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('정지 사진 시간 초과')),10000)})]).finally(()=>clearTimeout(timer));}

window.nativeCapturePending=false;
window.scannerCameraStatus=message=>{
  window.nativeCapturePending=false;
  status(message);
};
let nativeImportRunning=false;
window.scannerCameraPhoto=async(url,captureId,context='')=>{
  let retakeTarget=null;try{retakeTarget=JSON.parse(context||'{}').retakeTarget||null;}catch{}
  if(nativeImportRunning)return;
  nativeImportRunning=true;
  window.nativeCapturePending=true;
  try{
    await window.scannerWorkReady;
    let page=pages.find(item=>item.captureId===captureId);
    if(!page){
      const response=await fetch(url);
      if(!response.ok)throw Error('촬영 사진을 읽지 못했습니다.');
      const blob=await response.blob();
      if(!blob.size)throw Error('촬영 사진이 비어 있습니다.');
      const file=new File([blob],'촬영 사진.jpg',{type:'image/jpeg'});
      const imageURL=URL.createObjectURL(file);
      try{
        await addSource(imageURL,'고화질 촬영',{mode:'high',file});
        page=current();
        page.captureId=captureId;
      }finally{URL.revokeObjectURL(imageURL);}
    }
    if(retakeTarget&&page&&!page.retakeCompleted){await select(pages.indexOf(page));await window.scannerFinishRetake(retakeTarget);page.retakeCompleted=true;}
    await window.scannerResume.save();
    AndroidScanner.ackPhoto(captureId);
    status((retakeTarget?'현재 쪽을 교체했습니다. ':'휴대폰 카메라 사진을 추가했습니다. ')+(page.pixelWidth||'?')+'×'+(page.pixelHeight||'?')+'px · 전체 '+pages.length+'쪽');
  }catch(error){
    status('사진 보관을 완료하지 못했습니다. 앱을 다시 열면 가져오기를 재시도합니다. '+error.message);
  }finally{
    nativeImportRunning=false;
    window.nativeCapturePending=false;
  }
};
function requestPendingCameraPhoto(){
  if(window.AndroidScanner?.cameraReady)window.scannerWorkReady.then(()=>AndroidScanner.cameraReady());
}
requestPendingCameraPhoto();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)requestPendingCameraPhoto();});
