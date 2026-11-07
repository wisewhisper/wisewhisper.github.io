'use strict';
// The image remains visible. Embedded Unicode text is rendered with mode 3.
function searchPDF(images,font){
 const enc=new TextEncoder(),parts=[],offsets=[0],meta=font.info,F=3+images.length*3;
 let len=0;const push=v=>{const a=typeof v==='string'?enc.encode(v):v;parts.push(a);len+=a.length},obj=(n,body)=>{offsets[n]=len;push(`${n} 0 obj\n`);push(body);push('\nendobj\n')},stream=(n,dict,bytes)=>{offsets[n]=len;push(`${n} 0 obj\n<< ${dict} /Length ${bytes.length} >>\nstream\n`);push(bytes);push('\nendstream\nendobj\n')};
 const chars=[...new Set(images.flatMap(im=>(im.lines||[]).flatMap(l=>Array.from(l.text))))],cid=new Map(chars.map((c,i)=>[c,i+1]));if(chars.length>65534)throw Error('텍스트 종류가 너무 많습니다. 문서를 나누어 저장하세요.');
 const hex=n=>n.toString(16).padStart(4,'0').toUpperCase(),unicode=c=>Array.from({length:c.length},(_,i)=>hex(c.charCodeAt(i))).join(''),metric=c=>meta.glyphs[c.codePointAt(0)]||[0,meta.units];
 push('%PDF-1.7\n%WiseWhisper\n');obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,`<< /Type /Pages /Count ${images.length} /Kids [${images.map((_,i)=>`${3+i*3} 0 R`).join(' ')}] >>`);
 images.forEach((im,i)=>{const n=3+i*3,land=im.w>im.h,pw=land?841.89:595.28,ph=land?595.28:841.89,scale=Math.min((pw-24)/im.w,(ph-24)/im.h),w=im.w*scale,h=im.h*scale,ix=(pw-w)/2,iy=(ph-h)/2;
 obj(n,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /Font << /F0 ${F} 0 R >> /XObject << /Im${i} ${n+1} 0 R >> >> /Contents ${n+2} 0 R >>`);
 stream(n+1,`/Type /XObject /Subtype /Image /Width ${im.w} /Height ${im.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`,im.bytes);
 let content=`q ${w} 0 0 ${h} ${ix} ${iy} cm /Im${i} Do Q\n`;
 for(const line of im.lines||[]){if(!line.text.trim())continue;const b=line.box,sz=Math.max(.5,b.h*h*.85),width=Array.from(line.text).reduce((s,c)=>s+metric(c)[1]/meta.units*sz,0),stretch=Math.max(1,Math.min(1000,b.w*w/Math.max(.01,width)*100));content+=`BT /F0 ${sz.toFixed(4)} Tf 3 Tr ${stretch.toFixed(4)} Tz 1 0 0 1 ${(ix+b.x*w).toFixed(4)} ${(iy+h-(b.y+b.h*.85)*h).toFixed(4)} Tm <${Array.from(line.text).map(c=>hex(cid.get(c))).join('')}> Tj ET\n`;}
 stream(n+2,'',enc.encode(content));});
 obj(F,`<< /Type /Font /Subtype /Type0 /BaseFont /NotoSansKR-Regular /Encoding /Identity-H /DescendantFonts [${F+1} 0 R] /ToUnicode ${F+5} 0 R >>`);
 const widths=chars.map((c,i)=>`${i+1} [${(metric(c)[1]*1000/meta.units).toFixed(3)}]`).join(' ');
 obj(F+1,`<< /Type /Font /Subtype /CIDFontType2 /BaseFont /NotoSansKR-Regular /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor ${F+2} 0 R /DW 1000 /W [${widths}] /CIDToGIDMap ${F+4} 0 R >>`);
 obj(F+2,`<< /Type /FontDescriptor /FontName /NotoSansKR-Regular /Flags 4 /FontBBox [${meta.bbox.map(v=>v*1000/meta.units).join(' ')}] /ItalicAngle 0 /Ascent ${meta.ascent*1000/meta.units} /Descent ${meta.descent*1000/meta.units} /CapHeight 733 /StemV 80 /FontFile2 ${F+3} 0 R >>`);
 stream(F+3,`/Filter /FlateDecode /Length1 ${meta.length}`,font.bytes);const gids=new Uint8Array((chars.length+1)*2);chars.forEach((c,i)=>{const gid=metric(c)[0];gids[(i+1)*2]=gid>>8;gids[(i+1)*2+1]=gid&255});stream(F+4,'',gids);
 let cmap='/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /WiseWhisper-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n';
 for(let i=0;i<chars.length;i+=100){const block=chars.slice(i,i+100);cmap+=`${block.length} beginbfchar\n`+block.map((c,j)=>`<${hex(i+j+1)}> <${unicode(c)}>`).join('\n')+'\nendbfchar\n'}cmap+='endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';stream(F+5,'',enc.encode(cmap));
 const start=len,count=F+6;push(`xref\n0 ${count}\n0000000000 65535 f \n`);for(let i=1;i<count;i++)push(String(offsets[i]).padStart(10,'0')+' 00000 n \n');push(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`);return new Blob(parts,{type:'application/pdf'});
}
