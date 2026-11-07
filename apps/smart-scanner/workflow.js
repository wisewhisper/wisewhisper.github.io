/* Clear edit modes and explicit app-storage versus exported-file exit choices. */
'use strict';
function cancelCrop(){
  cropping=false;compare=false;drag=-1;cropDrag=null;render();
  status('영역 조정을 취소했습니다. 사진은 그대로이며 테두리 선을 지웠습니다.');
}
$('cancelCrop').onclick=cancelCrop;
window.scannerRequestExit=()=>{
  if(ocrBusy||documentCameraBusy||window.nativeCapturePending){status('진행 중인 처리를 완료하거나 중지한 뒤 나가세요.');return;}
  $('exitPDF').disabled=!pages.length;
  $('exitStatus').textContent='';
  if(!$('exitDialog').open)$('exitDialog').showModal();
};
window.scannerHandleBack=()=>{
  const dialog=[...document.querySelectorAll('dialog[open]')].pop();
  if(dialog){
    if(dialog.id==='cameraDialog')closeCamera();
    else if(dialog.id==='exitDialog'&&exitWorking)status('저장 창을 완료하거나 취소해 주세요.');
    else dialog.close();
    return;
  }
  if(cropping){cancelCrop();return;}
  if(document.body.dataset.panel!=='edit'){switchPanel('edit');return;}
  window.scannerRequestExit();
};
let exitWorking=false;
function setExitWorking(busy){exitWorking=busy;for(const id of ['exitKeep','exitPDF','exitDiscard','exitCancel'])$(id).disabled=busy||(id==='exitPDF'&&!pages.length);}
$('exitCancel').onclick=()=>$('exitDialog').close();
$('exitDialog').addEventListener('cancel',e=>{if(exitWorking)e.preventDefault()});
$('exitKeep').onclick=()=>safe(async()=>{
  if(exitWorking)return;
  setExitWorking(true);
  try{await window.scannerResume.save();$('exitDialog').close();setExitWorking(false);status('작업을 이 브라우저에 보관했습니다. 탭을 닫아도 됩니다.');}
  catch(error){$('exitStatus').textContent='작업을 보관하지 못했습니다. 편집을 계속하거나 PDF로 저장하세요.';setExitWorking(false);}
});
$('exitDiscard').onclick=()=>safe(async()=>{
  if(exitWorking)return;
  setExitWorking(true);
  try{await window.scannerResume.discard();pages=[];await select(-1);$('exitDialog').close();setExitWorking(false);discardWork=false;status('현재 작업을 삭제했습니다. 내 문서의 별도 보관본은 유지됩니다.');}
  catch(error){$('exitStatus').textContent='작업을 정리하지 못했습니다. 다시 시도하세요.';setExitWorking(false);}
});
$('exitPDF').onclick=()=>safe(async()=>{
  if(exitWorking||!pages.length)return;
  setExitWorking(true);$('exitStatus').textContent='PDF 준비 중… 저장 폴더를 선택하면 파일 저장 후 종료합니다.';
  try{
    await window.scannerResume.save();
    const blob=await makePDF();
    const saved=await nativeFile(blob,name()+'.pdf','save_exit');setExitWorking(false);$('exitStatus').textContent=saved?'PDF 저장을 완료했습니다. 탭을 닫아도 됩니다.':'PDF 다운로드를 요청했습니다. 브라우저 다운로드 목록을 확인한 뒤 탭을 닫아 주세요.';
  }catch(error){$('exitStatus').textContent='PDF 저장 준비 실패: '+error.message;setExitWorking(false);}
});
const workflowNativeResult=window.nativeResult;
window.nativeResult=message=>{
  workflowNativeResult(message);
  if(exitWorking){$('exitStatus').textContent=message;setExitWorking(false);}
};
// Keep follow-up capture reachable above the document after the first page.
const captureActions=$('previewCamera').parentElement;
captureActions.hidden=false;
captureActions.style.display='flex';
captureActions.classList.add('capture-actions');
document.querySelector('.editor').insertBefore(captureActions,document.querySelector('.editor .stage'));
$('previewCamera').textContent='＋ 다음 장 촬영';
$('largePreview').textContent='문서 확대';
$('closeCamera').textContent='취소 · 문서로';
$('cameraNormal').textContent='일반 · 빠르게';
$('cameraHigh').textContent='고화질 · 작은 글씨';
$('library').textContent='내 문서';
const exitButton=document.createElement('button');exitButton.id='appExit';exitButton.textContent='나가기';exitButton.onclick=()=>{if(cropping)cancelCrop();window.scannerRequestExit();};
document.querySelector('header .top').append(exitButton);
const exportHelp=document.createElement('p');exportHelp.className='storage-help';exportHelp.textContent='PDF 저장: 폴더를 선택해 파일로 남깁니다. 브라우저 보관: 내 문서에서 다시 편집합니다.';
document.querySelector('.save-controls').append(exportHelp);
syncControls();

window.scannerRetakeTarget=null;
$('retakePage').onclick=()=>{
  if(!current()||ocrBusy||documentCameraBusy||window.nativeCapturePending)return;
  const target=current().id;
  if(window.AndroidScanner){openNativeHighCamera(target);return;}
  $('camera').click();
  window.scannerRetakeTarget=target;
  $('cameraDialog').querySelector('h2').textContent='현재 쪽 다시 찍기';
  status('촬영 완료 후 현재 쪽을 교체합니다. 촬영 취소 시 기존 사진은 유지합니다.');
};
window.scannerFinishRetake=async target=>{
  if(!target)return;
  const oldIndex=pages.findIndex(p=>p.id===target),newPage=current();
  if(oldIndex<0||!newPage||newPage.id===target)return;
  const newIndex=pages.indexOf(newPage);
  pages.splice(newIndex,1);
  pages.splice(oldIndex,1,newPage);
  await select(oldIndex);
  status('현재 쪽을 새 사진으로 교체했습니다.');
};

$('camera').textContent='휴대폰 카메라로 촬영';
$('previewCamera').textContent='＋ 다음 장 촬영';
$('installGuide').textContent='촬영은 휴대폰 카메라 앱에서 합니다. 촬영 후 확인하면 스캐너 문서에 추가됩니다. 카메라 앱의 문서 인식 기능은 기종에 따라 다릅니다.';
