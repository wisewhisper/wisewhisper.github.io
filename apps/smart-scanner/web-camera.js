/* Browser camera picker: keeps the camera JPEG instead of a video preview frame. */
'use strict';
$('camera').textContent='사진 촬영';$('previewCamera').textContent='＋ 다음 장 촬영';$('captureQuality').value='high';
$('camera').onclick=()=>{
 if(ocrBusy||documentCameraBusy)return;
 if(pages.length>=MAX_PAGES)return status('최대 30쪽입니다. PDF로 저장 후 새 문서를 시작하세요.');
 window.scannerRetakeTarget=null;$('capture').click();
};
$('retakePage').onclick=()=>{if(!current()||ocrBusy||documentCameraBusy)return;window.scannerRetakeTarget=current().id;$('capture').click();};
$('capture').addEventListener('cancel',()=>{window.scannerRetakeTarget=null;status('촬영을 취소했습니다. 기존 문서는 유지됩니다.');});
$('capture').onchange=event=>{
 const file=event.target.files[0],target=window.scannerRetakeTarget;event.target.value='';window.scannerRetakeTarget=null;if(!file)return;
 safe(async()=>{if(documentCameraBusy)return;documentCameraBusy=true;const url=URL.createObjectURL(file);
 try{const result=await addSource(url,'카메라 사진',{mode:'high',file});if(target)await scannerFinishRetake(target);await scannerResume.save();status((target?'현재 쪽을 교체했습니다. ':'사진을 추가했습니다. ')+result.width+'×'+result.height+'px · 전체 '+pages.length+'쪽');}
 finally{documentCameraBusy=false;URL.revokeObjectURL(url);}});
};
$('exitPDF').firstChild.textContent='PDF 저장하기';$('appExit').textContent='작업 마치기';
$('pdfDownload').onclick=()=>status('PDF 다운로드를 요청했습니다. 브라우저 다운로드 목록에서 확인하세요.');
$('installGuide').textContent='휴대폰에서는 카메라 또는 사진 선택기를 사용합니다. 브라우저 메뉴에서 홈 화면에 추가할 수 있습니다.';
$('offlineHelp').textContent='사진과 글자 인식은 이 기기에서 처리합니다. 오프라인 준비를 완료하면 엔진과 모델도 이 브라우저에 보관합니다.';
$('offlineState').textContent='오프라인 준비 상태를 확인합니다.';
$('libraryDialog').querySelector('h2').textContent='내 문서 · 이 브라우저에 보관';
