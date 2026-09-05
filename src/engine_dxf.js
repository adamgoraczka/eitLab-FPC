/* ===================== DXF ===================== */
function dxfPoly(p, ver, hnd){ const pts=p.pts; if(pts.length<2) return '';
  if (ver==='r2000'){ let s=`0\nLWPOLYLINE\n5\n${hnd()}\n100\nAcDbEntity\n8\n${p.layer}\n100\nAcDbPolyline\n90\n${pts.length}\n70\n${p.closed?1:0}\n`; for(const q of pts) s+=`10\n${f(q[0])}\n20\n${f(q[1])}\n`; return s; }
  let s=`0\nPOLYLINE\n8\n${p.layer}\n66\n1\n70\n${p.closed?1:0}\n10\n0\n20\n0\n30\n0\n`; for(const q of pts) s+=`0\nVERTEX\n8\n${p.layer}\n10\n${f(q[0])}\n20\n${f(q[1])}\n30\n0\n`; return s+`0\nSEQEND\n8\n${p.layer}\n`; }
const LAYER_COLORS={CUT:1, FRAME:3, TEXT:7, DEVICES:8, RAIL:9, CABINET:5, PLATE:6};
function dxfFile(polys, ver){
  let h=0x100; const hnd=()=>(h++).toString(16).toUpperCase();
  let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9; polys.forEach(p=>p.pts.forEach(q=>{minx=Math.min(minx,q[0]);miny=Math.min(miny,q[1]);maxx=Math.max(maxx,q[0]);maxy=Math.max(maxy,q[1]);})); if(minx>maxx){minx=miny=0;maxx=maxy=1;}
  let s=`0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\n${ver==='r2000'?'AC1015':'AC1009'}\n9\n$INSUNITS\n70\n4\n9\n$EXTMIN\n10\n${f(minx)}\n20\n${f(miny)}\n30\n0\n9\n$EXTMAX\n10\n${f(maxx)}\n20\n${f(maxy)}\n30\n0\n0\nENDSEC\n`;
  s+=`0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLTYPE\n70\n1\n0\nLTYPE\n2\nCONTINUOUS\n70\n0\n3\nSolid line\n72\n65\n73\n0\n40\n0\n0\nENDTAB\n0\nTABLE\n2\nLAYER\n70\n8\n0\nLAYER\n2\n0\n70\n0\n62\n7\n6\nCONTINUOUS\n`;
  for (const [l,c] of Object.entries(LAYER_COLORS)) s+=`0\nLAYER\n2\n${l}\n70\n0\n62\n${c}\n6\nCONTINUOUS\n`;
  s+=`0\nENDTAB\n0\nENDSEC\n`; if(ver==='r2000') s+=`0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n`;
  s+=`0\nSECTION\n2\nENTITIES\n`; for(const p of polys) s+=dxfPoly(p,ver,hnd); return s+`0\nENDSEC\n0\nEOF\n`;
}
/* ===================== Files / downloads ===================== */
const DL = (window.claude && typeof claude.use==='function') ? claude.use('downloads').catch(()=>null) : Promise.resolve(null);
async function saveFile(name, text){
  const dl = await DL;
  if (dl){ const fn = /\.dxf$/i.test(name) ? name+'.txt' : name;
    try{ await dl.save({filename:fn, data:text}); if(fn!==name) showDl(`Zapisano jako ${fn} – po pobraniu zmień nazwę na ${name} (podgląd Claude nie zapisuje rozszerzenia .dxf). Wersja offline zapisuje od razu .dxf.`); }
    catch(e){ if(e&&e.code!=='declined') showDl('Nie udało się zapisać: '+(e.message||e.code), true); }
    return; }
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type:'application/octet-stream'})); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);
}
function showDl(t,err){ const e=$('dlMsg'); e.style.display='block'; e.textContent=t; e.className='msg'+(err?' err':''); }
function toast(t){ const e=$('toast'); e.textContent=t; e.classList.add('on'); clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove('on'),2600); }

