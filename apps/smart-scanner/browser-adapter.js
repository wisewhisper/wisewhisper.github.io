'use strict';
window.nativeResult=message=>status(message);
async function nativeFile(blob,title,operation){
 if(window.showSaveFilePicker){const handle=await showSaveFilePicker({suggestedName:title,types:[{description:'PDF 문서',accept:{'application/pdf':['.pdf']}}]});const writable=await handle.createWritable();await writable.write(blob);await writable.close();return true;}
 download(blob,title);return false;
}
$('appSettings').textContent='설정';$('appSettings').onclick=()=>$('appDialog').showModal();$('closeAppDialog').onclick=()=>$('appDialog').close();
$('updateState').textContent='스마트 스캐너 웹 2.0';$('copyAddress').onclick=()=>status('휴대폰 카메라로 촬영한 사진을 선택하거나 파일에서 가져오세요.');
