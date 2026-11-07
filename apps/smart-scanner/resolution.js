/* No enlargement: retain available detail within explicit mobile memory budgets. */
'use strict';
function highResolution(){return document.getElementById('captureQuality')?.value==='high'}
function resolutionSize(w,h,mode='normal'){const high=mode==='high',scale=Math.min(1,(high?6000:3600)/Math.max(w,h),Math.sqrt((high?12500000:6000000)/(w*h)));return {w:Math.max(1,Math.floor(w*scale)),h:Math.max(1,Math.floor(h*scale))};}
function resolutionCanvas(image,mode){let used=mode;for(const candidate of mode==='high'?['high','normal']:['normal']){try{const d=resolutionSize(image.width,image.height,candidate),c=canvas(d.w,d.h),x=c.getContext('2d');if(!x)throw Error('메모리 부족');x.drawImage(image,0,0,d.w,d.h);x.getImageData(0,0,1,1);used=candidate;return {canvas:c,mode:used,fallback:used!==mode};}catch(e){if(candidate==='normal')throw e;}}}

// Preserve unchanged JPEG bytes in the PDF when no orientation transform is needed.
function originalJPEGForPDF(page){
  if(page.brightness||page.contrast||page.shadows||page.filter!=='color'||!page.base?.startsWith('data:image/jpeg;base64,'))return null;
  const raw=atob(page.base.split(',')[1]),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
  const v=new DataView(bytes.buffer);let pos=2,width=0,height=0,orientation=1;
  if(v.byteLength<4||v.getUint16(0)!==0xffd8)return null;
  try{while(pos+4<=bytes.length){
    if(bytes[pos]!==255)break;const marker=bytes[pos+1];pos+=2;
    if(marker===0xda||marker===0xd9)break;
    if(marker===0x01||(marker>=0xd0&&marker<=0xd7))continue;
    const length=v.getUint16(pos);if(length<2||pos+length>bytes.length)return null;
    if([0xc0,0xc1,0xc2].includes(marker)){height=v.getUint16(pos+3);width=v.getUint16(pos+5);}
    if(marker===0xe1&&length>=16&&v.getUint32(pos+2)===0x45786966){
      const t=pos+8,little=v.getUint16(t)===0x4949,dir=t+v.getUint32(t+4,little);
      const count=v.getUint16(dir,little);
      for(let i=0;i<count;i++){const e=dir+2+i*12;if(e+12>pos+length)return null;if(v.getUint16(e,little)===0x0112)orientation=v.getUint16(e+8,little);}
    }
    pos+=length;
  }}catch{return null;}
  return width&&height&&orientation===1?{w:width,h:height,bytes}:null;
}
