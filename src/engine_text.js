/* ===================== Text engine (Hershey + TTF) ===================== */
const HERSHEY = JSON.parse($('hershey').textContent);
const H_CAP = 21, H_BASE = 9;
const DIA = {
 'ą':['a','og'],'ć':['c','ac'],'ę':['e','og'],'ł':['l','st'],'ń':['n','ac'],'ó':['o','ac'],'ś':['s','ac'],'ź':['z','ac'],'ż':['z','dot'],
 'Ą':['A','og'],'Ć':['C','AC'],'Ę':['E','og'],'Ł':['L','ST'],'Ń':['N','AC'],'Ó':['O','AC'],'Ś':['S','AC'],'Ź':['Z','AC'],'Ż':['Z','DOT'],
 'é':['e','ac'],'á':['a','ac'],'ú':['u','ac'],'ý':['y','ac'],'ä':['a','um'],'ö':['o','um'],'ü':['u','um'],'Ä':['A','UM'],'Ö':['O','UM'],'Ü':['U','UM'],
 'č':['c','car'],'š':['s','car'],'ž':['z','car'],'ě':['e','car'],'ř':['r','car'],'Č':['C','CAR'],'Š':['S','CAR'],'Ž':['Z','CAR'],'Ř':['R','CAR'],'°':['o','deg']
};
const SUBST = {'·':'-','•':'-','–':'-','—':'-','−':'-','×':'x','„':'"','”':'"','“':'"','’':"'",'‘':"'",'…':'...','\u00a0':' ','Ø':'O','ø':'o','µ':'u'};
function hersheyGlyph(font, ch){
  const F = HERSHEY[font];
  if (F[ch]) return F[ch];
  if (SUBST[ch]) { const r = SUBST[ch]; if (r.length===1) return F[r]; const w=r.split('').reduce((a,c)=>a+F[c].w,0); let x=-w/2, st=[]; for(const c of r){ st=st.concat(F[c].s.map(k=>k.map(p=>[p[0]+x+F[c].w/2,p[1]]))); x+=F[c].w; } return {w, s:st}; }
  const d = DIA[ch]; if (!d) return F['?'];
  const base = F[d[0]]; const strokes = base.s.map(s=>s.map(p=>[p[0],p[1]])); const pts = strokes.flat();
  const xs = pts.map(p=>p[0]); const cx = pts.length? (Math.min(...xs)+Math.max(...xs))/2 : 0; const add = s=>strokes.push(s);
  switch(d[1]){
    case 'ac': add([[cx-1,-8],[cx+2,-11]]); break;
    case 'AC': add([[cx-1,-15],[cx+2,-18]]); break;
    case 'dot': add([[cx-1,-8],[cx-1,-10],[cx+1,-10],[cx+1,-8],[cx-1,-8]]); break;
    case 'DOT': add([[cx-1,-15],[cx-1,-17],[cx+1,-17],[cx+1,-15],[cx-1,-15]]); break;
    case 'um': add([[cx-4,-8],[cx-4,-10],[cx-2,-10],[cx-2,-8],[cx-4,-8]]); add([[cx+2,-8],[cx+2,-10],[cx+4,-10],[cx+4,-8],[cx+2,-8]]); break;
    case 'UM': add([[cx-4,-15],[cx-4,-17],[cx-2,-17],[cx-2,-15],[cx-4,-15]]); add([[cx+2,-15],[cx+2,-17],[cx+4,-17],[cx+4,-15],[cx+2,-15]]); break;
    case 'car': add([[cx-3,-11],[cx,-8],[cx+3,-11]]); break;
    case 'CAR': add([[cx-3,-18],[cx,-15],[cx+3,-18]]); break;
    case 'og': { const bottom = pts.filter(p=>p[1]>=7); const ax = bottom.length? Math.max(...bottom.map(p=>p[0])) : cx+3; add([[ax,9],[ax-1.5,10.5],[ax-1.5,12.5],[ax+1,14]]); break; }
    case 'st': add([[cx-3,1],[cx+3,-3]]); break;
    case 'ST': { const sx = Math.min(...xs); add([[sx-3,2],[sx+3,-2]]); break; }
    case 'deg': { const c=[]; for(let i=0;i<=12;i++){const a=i/12*2*Math.PI;c.push([cx+3*Math.cos(a),-14+3*Math.sin(a)]);} return {w:12,s:[c]}; }
  }
  return {w:base.w, s:strokes};
}
// polylines in mm, y-DOWN, baseline y=0, x from 0
function hersheyText(font, text, capH){
  const k = capH / H_CAP; let x = 0; const polys=[];
  for (const ch of text){ const g = hersheyGlyph(font, ch);
    for (const s of g.s) polys.push({closed:false, pts: s.map(p=>[x + (p[0]+g.w/2)*k, (p[1]-H_BASE)*k])});
    x += g.w*k; }
  return {polys, width:x};
}
let ttfFont=null;
function ttfCap(font){ try{ const b=font.charToGlyph('H').getBoundingBox(); if (b.y2-b.y1>0) return b.y2-b.y1; }catch(e){} return (font.tables.os2&&font.tables.os2.sCapHeight)||font.unitsPerEm*0.7; }
function ttfText(ttfFont, text, capH, segs){
  const fs = capH * ttfFont.unitsPerEm / ttfCap(ttfFont);
  const path = ttfFont.getPath(text, 0, 0, fs, {kerning:true}); const polys=[]; let cur=null;
  const push=(x,y)=>cur.pts.push([x,y]);
  for (const c of path.commands){
    if (c.type==='M'){ cur={closed:false,pts:[]}; polys.push(cur); push(c.x,c.y); }
    else if (c.type==='L') push(c.x,c.y);
    else if (c.type==='Q'){ const [x0,y0]=cur.pts[cur.pts.length-1]; for(let i=1;i<=segs;i++){const t=i/segs,u=1-t; push(u*u*x0+2*u*t*c.x1+t*t*c.x, u*u*y0+2*u*t*c.y1+t*t*c.y);} }
    else if (c.type==='C'){ const [x0,y0]=cur.pts[cur.pts.length-1]; for(let i=1;i<=segs;i++){const t=i/segs,u=1-t; push(u*u*u*x0+3*u*u*t*c.x1+3*u*t*t*c.x2+t*t*t*c.x, u*u*u*y0+3*u*u*t*c.y1+3*u*t*t*c.y2+t*t*t*c.y);} }
    else if (c.type==='Z'){ if(cur) cur.closed=true; }
  }
  return {polys:polys.filter(p=>p.pts.length>1), width: ttfFont.getAdvanceWidth(text, fs, {kerning:true})};
}
const FONTLIB = JSON.parse($('fontlib').textContent); const fontCache={};
const HERSHEY_NAMES = {simplex:'Kreskowa Simplex (prosta)', duplex:'Kreskowa Duplex (grubsza)', rowmans:'Kreskowa Roman Sans', rowmand:'Kreskowa Roman Sans grubsza', timesr:'Kreskowa szeryfowa', timesrb:'Kreskowa szeryfowa grubsza', scriptc:'Kreskowa pisana'};
function fontSelectOptions(){ let o='<optgroup label="Jednokreskowe (kontur)">'+Object.entries(HERSHEY_NAMES).filter(([k])=>HERSHEY[k]).map(([k,v])=>`<option value="h:${k}">${v}</option>`).join('')+'</optgroup>';
  o+='<optgroup label="Wbudowane TTF (wypełnienie)">'+FONTLIB.map((f,i)=>`<option value="e:${i}">${f.name}</option>`).join('')+'</optgroup>';
  if(typeof USERFONTS!=='undefined'&&USERFONTS.length) o+='<optgroup label="Własne (Biblioteka → Czcionki)">'+USERFONTS.map(f=>`<option value="u:${f.id}">${f.name}</option>`).join('')+'</optgroup>';
  return o; }
let USERFONTS=[]; const userFontCache={};
function b64buf(b64){ const bin=atob(b64); const buf=new ArrayBuffer(bin.length); const u=new Uint8Array(buf); for(let k=0;k<bin.length;k++) u[k]=bin.charCodeAt(k); return buf; }
function userFont(id){ if(userFontCache[id]) return userFontCache[id]; const f=USERFONTS.find(x=>x.id===id); if(!f) return null; try{ return userFontCache[id]=opentype.parse(b64buf(f.b64)); }catch(e){ return null; } }
function embeddedFont(i){ if(fontCache[i]) return fontCache[i]; const b64=FONTLIB[i].b64; const bin=atob(b64); const buf=new ArrayBuffer(bin.length); const u=new Uint8Array(buf); for(let k=0;k<bin.length;k++) u[k]=bin.charCodeAt(k); return fontCache[i]=opentype.parse(buf); }
function currentTtf(fnt){ if(fnt==='ttf') return ttfFont; if(fnt.startsWith('e:')) return embeddedFont(+fnt.slice(2)); if(fnt.startsWith('u:')) return userFont(fnt.slice(2))||embeddedFont(0); return null; }
function resolveFont(fnt){ fnt=fnt||'e:0'; if(fnt.startsWith('u:')&&!USERFONTS.find(x=>x.id===fnt.slice(2))) return 'e:0'; if(fnt==='ttf'&&!ttfFont) return 'e:0'; return fnt; }
function isOutlineFont(fnt){ return !(fnt||'h:simplex').startsWith('h:'); }
function textPolys(text, capH, fnt){
  fnt=resolveFont(fnt||P.label.font);
  if (fnt.startsWith('h:')) return hersheyText(HERSHEY[fnt.slice(2)]?fnt.slice(2):'simplex', text, capH);
  const font=currentTtf(fnt); if(!font) return {polys:[],width:0}; return ttfText(font, text, capH, P.label.segs);
}
// fit text in box (x,y,w,h) y-down; align c/l; returns polys with layer
let FIT_LOG=null;
function rotatePolys(polys, cx, cy, deg){ const a=deg*Math.PI/180, c=Math.cos(a), s=Math.sin(a); return polys.map(p=>Object.assign({},p,{pts:p.pts.map(q=>[cx+(q[0]-cx)*c-(q[1]-cy)*s, cy+(q[0]-cx)*s+(q[1]-cy)*c])})); }
function fitTextV(text, capH, x, y, w, h, pad, layer, fnt){ const cx=x+w/2, cy=y+h/2; const m=fitText(text,capH,cx-h/2,cy-w/2,h,w,pad,layer,fnt); return rotatePolys(m, cx, cy, -90); }
function fitText(text, capH, x, y, w, h, pad, layer, fnt, opt){
  const lines = (opt&&opt.raw)? [String(text||'').trim()].filter(Boolean) : String(text||'').split('/').map(s=>s.trim()).filter(Boolean); if (!lines.length) return [];
  const gap = capH*0.35; const rs = lines.map(t=>textPolys(t, capH, fnt));
  const total = capH*lines.length + gap*(lines.length-1); const maxW = Math.max(...rs.map(r=>r.width));
  let k=1; if (maxW>w-2*pad) k=Math.min(k,(w-2*pad)/maxW); if (total>h-2*pad) k=Math.min(k,(h-2*pad)/total);
  if(k<0.999&&FIT_LOG&&!(opt&&opt.box)) FIT_LOG.push({text, capH, k, layer, tag:opt&&opt.tag});
  const shrunk=k<0.999;
  let out=[]; let top = y + h/2 - total*k/2;
  rs.forEach((r,i)=>{ const base = top + capH*k; const tw=r.width*k; const x0 = (opt&&opt.align==='left')? x+pad : (opt&&opt.align==='right')? x+w-pad-tw : x + w/2 - tw/2;
    out = out.concat(r.polys.map(p=>({closed:p.closed, layer, shrunk, outline:isOutlineFont(resolveFont(fnt||P.label.font)), pts:p.pts.map(q=>[x0+q[0]*k, base+q[1]*k])})));
    top = base + gap*k; });
  return out;
}

