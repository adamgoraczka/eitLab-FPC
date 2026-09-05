/* ===================== Model ===================== */
const TABLES={std:'Standard (nazwa + symbol)', r2:'2 pola pod sobą', r3:'3 pola pod sobą', r4:'4 pola pod sobą', c2:'2 pola obok siebie', c3:'3 pola obok siebie'};
const DEFAULT_DB = [
  {code:'S301',name:'Wyłącznik nadprądowy 1P',mod:1,prefix:'F',table:'std',rating:'B16'},
  {code:'S302',name:'Wyłącznik nadprądowy 2P',mod:2,prefix:'F',table:'std',rating:'B16'},
  {code:'S303',name:'Wyłącznik nadprądowy 3P',mod:3,prefix:'F',table:'std',rating:'C16'},
  {code:'S304',name:'Wyłącznik nadprądowy 4P',mod:4,prefix:'F',table:'std',rating:'C16'},
  {code:'P302',name:'Wył. różnicowoprądowy 2P',mod:2,prefix:'I',table:'std',rating:'25A 30mA'},
  {code:'P304',name:'Wył. różnicowoprądowy 4P',mod:4,prefix:'I',table:'std',rating:'40A 30mA'},
  {code:'P312',name:'Wył. różnicowoprądowy 2P',mod:2,prefix:'I',table:'std',rating:'25A 30mA A'},
  {code:'P314',name:'Wył. różnicowoprądowy 4P',mod:4,prefix:'I',table:'std',rating:'40A 30mA A'},
  {code:'FR303',name:'Rozłącznik 3P',mod:3,prefix:'Q',table:'std',rating:'63A'},
  {code:'FR304',name:'Rozłącznik 4P',mod:4,prefix:'Q',table:'std',rating:'63A'},
  {code:'SPD',name:'Ochronnik przepięć',mod:4,prefix:'SPD',table:'std',rating:'T1+T2'},
  {code:'K',name:'Stycznik',mod:3,prefix:'K',table:'std',rating:'25A'},
  {code:'PK',name:'Przekaźnik',mod:1,prefix:'K',table:'std',rating:''},
  {code:'H',name:'Lampka',mod:1,prefix:'H',table:'std',rating:''},
  {code:'PRZ',name:'Przełącznik 3-poz.',mod:1,prefix:'S',table:'r3',rating:''},
  {code:'Z',name:'Zaślepka',mod:1,prefix:'',blank:true,table:'std',rating:''},
];
const DEFAULT_ENC = [
  {name:'Szafa 600×2000 (cokół 100)',w:600,h:2000,plinth:100,coverW:'500',coverH:'150,200,300'},
  {name:'Szafa 800×2000 (cokół 100)',w:800,h:2000,plinth:100,coverW:'700',coverH:'150,200,300'},
  {name:'Szafa 750×2000',w:750,h:2000,plinth:0,coverW:'600',coverH:'150,200'},
  {name:'Rozdzielnica naścienna 600×1000',w:600,h:1000,plinth:0,coverW:'500',coverH:'150'},
];
const ITEM_NAMES={cover:'Maskownica z wycięciem', blank:'Maskownica zaślepka', plate:'Płyta montażowa', empty:'Puste pole'};
const ALIGN_NAMES={left:'do lewej', right:'do prawej', free:'swobodna'};
const LINE_TYPES={solid:'ciągła', dash:'kreskowa', dot:'kropkowa', dashdot:'kreska-kropka'};
const LAYERS=[['CUT','obrys maskownicy i okno wycięcia',1],['HOLES','otwory mocowania',1],['ICON','symbole graficzne',7],['FRAME_MAIN','obrysy ramek opisów',3],['FRAME_DIV_V','pionowe linie podziału',3],['FRAME_DIV_H','poziome linie podziału',3],['TEXT_SYMBOL','symbole aparatów',7],['TEXT_NAME','nazwy / pola / modele',7],['GRP_TOP_LINE','linie grup – góra',4],['GRP_TOP_TEXT','podpisy grup – góra',7],['GRP_BOT_LINE','linie grup – dół',4],['GRP_BOT_TEXT','podpisy grup – dół',7],['INFO','tekst informacyjny',8],['QR','kod QR',7],['DEVICES','obrysy aparatów (ref.)',8],['RAIL','szyna DIN i moduły',9],['CABINET','szafy, cokoły, puste pola',5],['PLATE','płyty montażowe',6]];
const LAYER_COLORS=Object.fromEntries(LAYERS.map(l=>[l[0],l[2]]));
const DEFAULT_ON=new Set(['CUT','HOLES','ICON','FRAME_MAIN','FRAME_DIV_V','FRAME_DIV_H','TEXT_SYMBOL','TEXT_NAME','GRP_TOP_LINE','GRP_TOP_TEXT','GRP_BOT_LINE','GRP_BOT_TEXT','QR']);
function defaultLabel(){ return {h:16, gap:2, pad:0.6, symH:3.5, nameH:2.5, cellH:2.2, split:50, symTop:false, frame:true, divV:true, divH:true, lwMain:0.3, lwDivV:0.3, lwDivH:0.3, frameR:1.5, font:'e:0', fontSym:'e:0', fontInfo:'e:0', segs:8, showRating:false, iconScale:0.9}; }
function defaultGrp(side){ return {lineType:side==='top'?'dash':'dot', dash:'2/1.5', font:'e:0', size:2.8, lw:0.3, textPos:side==='top'?'above':'inline', align:side==='top'?'center':'left', offset:2, gap:3, inset:2}; }
function newGroup(name, align){ return {id:uid(), name:name||'', bot:'', align:align||'left', x:0, devices:[]}; }
function newRow(){ return {mod:24, nicheH:45, nicheY:null, pos:'block', groups:[]}; }
function newItem(type, cab){ const w = type==='empty'? cab.w : Math.min(cab.w, 600); const it={id:uid(), type, w, h: type==='cover'?150: type==='blank'?150: type==='plate'?400:100}; if(type==='cover') it.row=newRow(); return it; }
function newCab(){ return {id:uid(), w:750, h:2000, plinth:0, door:false, hinge:'left', leaves:1, items:[]}; }
function newBoard(){ const B={format:FORMAT, app:APP_NAME, id:uid(), name:'Rozdzielnica', tag:'RG', revision:'A', pitch:17.5, cabGap:0, label:defaultLabel(), grpTop:defaultGrp('top'), grpBot:defaultGrp('bot'), info:{on:true,h:3}, qr:{pos:0,size:15}, holes:{n:0,d:5,off:10}, cabinets:[], updated:Date.now()}; const c=newCab(); B.cabinets.push(c); c.items.push(newItem('empty',c)); c.items.push(newItem('cover',c)); return B; }
function newOrder(){ return {format:FORMAT, id:uid(), number:'', client:'', object:'', address:'', contact:'', phone:'', email:'', dateStart:new Date().toISOString().slice(0,10), dateDue:'', status:'nowe', notes:'', created:Date.now(), updated:Date.now()}; }
let P=newBoard(), ORDER=newOrder(), DB=JSON.parse(JSON.stringify(DEFAULT_DB)), ENC=JSON.parse(JSON.stringify(DEFAULT_ENC)), SETTINGS={theme:'light',gClientId:'',gAuto:false};
let selCab=null, selItem=null, selGrp=null, selDev=null, multi=new Set(), history=[], future=[], VIEW='all', MODE='design';
function snapshot(){ history.push(JSON.stringify(P)); if(history.length>50) history.shift(); future.length=0; }
function coverItems(){ const out=[]; P.cabinets.forEach((c,ci)=>c.items.forEach((it,ii)=>{ if(it.type==='cover') out.push({cab:c,item:it,ci,ii}); })); return out; }
function rowDevices(r){ return r.groups.flatMap(g=>g.devices); }
function groupMod(g){ return Math.max(g.devices.reduce((a,d)=>a+d.mod,0), g.devices.length?0:2); }
function groupX(r){ const m=new Map(); let L=0; for(const g of r.groups) if(g.align==='left'){ m.set(g.id,L); L+=groupMod(g); }
  let R=r.mod; for(const g of [...r.groups].reverse()) if(g.align==='right'){ R-=groupMod(g); m.set(g.id,R); }
  let cur=L; for(const g of r.groups.filter(x=>x.align==='free').sort((a,b)=>(a.x||0)-(b.x||0))){ const gm=groupMod(g); let x=Math.max(cur, g.x||0); x=Math.min(x, R-gm); x=Math.max(L,x); m.set(g.id,x); cur=x+gm; } return m; }
function freeRange(r, g){ let L=0; for(const o of r.groups) if(o!==g&&o.align==='left') L+=groupMod(o); let R=r.mod; for(const o of r.groups) if(o!==g&&o.align==='right') R-=groupMod(o); return [L, R-groupMod(g)]; }
function renumber(){ const cnt={}; for(const {item} of coverItems()){ const gx=groupX(item.row); const list=[]; for(const g of item.row.groups){ let m=gx.get(g.id); for(const d of g.devices){ list.push({d,x:m}); m+=d.mod; } } list.sort((a,b)=>a.x-b.x);
    for(const {d} of list){ if(d.blank) continue; if(d.auto!==false){ if((d.table||'std')!=='std'){ d.symbol=''; continue; } const pf=d.prefix||''; cnt[pf]=(cnt[pf]||0)+1; d.symbol=pf+cnt[pf]; } } } }
function findDev(id){ for(const {cab,item} of coverItems()) for(const g of item.row.groups){ const i=g.devices.findIndex(d=>d.id===id); if(i>=0) return {cab,item,row:item.row,grp:g,idx:i,dev:g.devices[i]}; } return null; }
function findGrp(id){ for(const {cab,item} of coverItems()){ const g=item.row.groups.find(x=>x.id===id); if(g) return {cab,item,row:item.row,grp:g}; } return null; }
function findItem(id){ for(const c of P.cabinets){ const it=c.items.find(x=>x.id===id); if(it) return {cab:c,item:it}; } return null; }
function makeDev(db, name){ return {id:uid(), code:db.code, name:db.blank?'':(name!=null?name:db.name), mod:db.mod, prefix:db.prefix, blank:!!db.blank, auto:true, symbol:'', table:db.table||'std', rating:db.rating||''}; }
function addDevice(db){ let it=selItem&&selItem.type==='cover'? selItem : (coverItems()[0]&&coverItems()[0].item); if(!it){ toast('Najpierw dodaj maskownicę z wycięciem'); return; }
  snapshot(); let g=selGrp&&it.row.groups.includes(selGrp)? selGrp : it.row.groups[it.row.groups.length-1]; if(!g){ g=newGroup('', 'left'); it.row.groups.push(g); }
  const d=makeDev(db); g.devices.push(d); selDev=d; multi.clear(); selGrp=g; selItem=it; change(); }
function addGroup(align){ const it=selItem&&selItem.type==='cover'? selItem : null; if(!it){ toast('Zaznacz maskownicę z wycięciem'); return; } snapshot(); const g=newGroup('', align||'left'); it.row.groups.push(g); selGrp=g; selDev=null; change(); }
function cabTotalH(c){ return c.h+(c.plinth||0); }

/* ===================== Geometry ===================== */
function cabX(c){ let x=0; for(const k of P.cabinets){ if(k===c) return x; x+=k.w+(P.cabGap||0); } return x; }
function totalW(){ return P.cabinets.reduce((a,c)=>a+c.w,0)+(P.cabGap||0)*Math.max(0,P.cabinets.length-1); }
function totalH(){ return Math.max(1,...P.cabinets.map(cabTotalH)); }
function itemBox(cab,it){ const x=cabX(cab)+(cab.w-it.w)/2; let y=0; for(const k of cab.items){ if(k===it) break; y+=k.h; } return {x,y,w:it.w,h:it.h}; }
function rect(x,y,w,h,layer){ return {closed:true, layer, pts:[[x,y],[x+w,y],[x+w,y+h],[x,y+h]]}; }
function circle(cx,cy,r,layer){ const n=Math.max(12,(P.label.segs||8)*3); const pts=[]; for(let i=0;i<n;i++){ const a=i/n*2*Math.PI; pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]); } return {closed:true,layer,pts}; }
function rrect(x,y,w,h,r,layer){ r=Math.min(r,w/2,h/2); if(r<=0.01) return rect(x,y,w,h,layer); const n=Math.max(3,Math.round((P.label.segs||8)/2)); const pts=[];
  const corner=(cx,cy,a0)=>{ for(let i=0;i<=n;i++){ const a=a0+i/n*Math.PI/2; pts.push([cx+r*Math.cos(a), cy+r*Math.sin(a)]); } };
  corner(x+w-r,y+r,-Math.PI/2); corner(x+w-r,y+h-r,0); corner(x+r,y+h-r,Math.PI/2); corner(x+r,y+r,Math.PI); return {closed:true, layer, pts}; }
function line(x1,y1,x2,y2,layer){ return {closed:false, layer, pts:[[x1,y1],[x2,y2]]}; }
function seg(x1,y1,x2,y2,layer,lw){ if(!(lw>0)) return line(x1,y1,x2,y2,layer); const L=Math.hypot(x2-x1,y2-y1)||1; const nx=-(y2-y1)/L*lw/2, ny=(x2-x1)/L*lw/2;
  return {closed:true, band:true, layer, pts:[[x1+nx,y1+ny],[x2+nx,y2+ny],[x2-nx,y2-ny],[x1-nx,y1-ny]]}; }
function frame(x,y,w,h,layer,lw,r){ if(!(lw>0)) return [rrect(x,y,w,h,r,layer)]; const id=uid(); const o=rrect(x,y,w,h,r,layer), i=rrect(x+lw,y+lw,w-2*lw,h-2*lw,Math.max(0,r-lw),layer); o.pair=id; i.pair=id; i.hole=true; return [o,i]; }
function patterned(x1,y1,x2,y2,layer,G){ const L=Math.hypot(x2-x1,y2-y1); if(L<=0) return []; const lw=G.lw||0; const t=G.lineType||'dash'; if(t==='solid') return [seg(x1,y1,x2,y2,layer,lw)];
  let [dl,gl]=(G.dash||'2/1.5').split('/').map(Number); if(!(dl>0)) dl=2; if(!(gl>=0)) gl=1.5; const ux=(x2-x1)/L, uy=(y2-y1)/L; const out=[]; const dot=Math.max(0.3,lw||0.3);
  const seq= t==='dot'? [dot] : t==='dashdot'? [dl,dot] : [dl];
  let s=0, k=0; while(s<L){ const len=seq[k%seq.length]; const e=Math.min(L,s+len); if(len===dot&&lw>0) out.push(circle(x1+ux*(s+e)/2, y1+uy*(s+e)/2, lw/2*1.2, layer)); else out.push(seg(x1+ux*s,y1+uy*s,x1+ux*e,y1+uy*e,layer,lw)); s=e+gl; k++; } return out; }
function tableCells(d){ const t=d.table||'std'; if(t==='std') return null; const n=+t[1]; return {n, dir:t[0]==='r'?'rows':'cols'}; }
function grpTextGeom(G, name, xa, xb, yLine, side, layerT, layerL){ // returns polys for line + text
  const polys=[]; const ins=Math.min(G.inset||0,(xb-xa)/2-1); const x1=xa+ins, x2=xb-ins; if(x2<=x1) return polys;
  const th=G.size||2.8; const tw=Math.max(0,...[textPolys(name,th,G.font).width]); const pad=th*0.5; const fnt=G.font;
  let tx; if(G.align==='left') tx=x1+(G.offset||0); else if(G.align==='right') tx=x2-(G.offset||0)-tw; else tx=(x1+x2)/2-tw/2; tx=Math.max(x1,Math.min(x2-tw,tx));
  const pos=G.textPos||'above';
  if(pos==='inline'&&name){ if(tx-pad>x1) polys.push(...patterned(x1,yLine,tx-pad,yLine,layerL,G)); if(tx+tw+pad<x2) polys.push(...patterned(tx+tw+pad,yLine,x2,yLine,layerL,G)); polys.push(...fitText(name,th,tx,yLine-th*0.8,tw+0.01,th*1.6,0,layerT,fnt)); }
  else { polys.push(...patterned(x1,yLine,x2,yLine,layerL,G)); if(name){ const ty = pos==='above'? yLine-(G.offset||0)-th*1.35 : yLine+(G.offset||0)+th*0.15; polys.push(...fitText(name,th,tx,ty,tw+0.01,th*1.2,0,layerT,fnt)); } }
  if(tw>x2-x1&&FIT_LOG) FIT_LOG.push({text:name,capH:th,k:(x2-x1)/tw,layer:layerT,tag:'grp:'+(side==='top'?'name':'bot')+':'+(G._gid||'')});
  return polys; }
function grpSpaceOf(G, hasName){ const th=G.size||2.8; const pos=G.textPos||'above'; return (G.gap||0)+(G.lw||0)+ (hasName&&pos!=='inline'? (G.offset||0)+th*1.5 : th*0.9); }
function coverInfoText(cab,it){ const ci=P.cabinets.indexOf(cab)+1, ii=cab.items.indexOf(it)+1; return `${ORDER.number?ORDER.number+' - ':''}${P.name||''}${P.tag?' '+P.tag:''}${P.revision?' rev.'+P.revision:''} - Szafa ${ci} - Maskownica ${ii} - ${it.w}x${it.h} - ${it.row.mod} mod - ${new Date().toISOString().slice(0,10)}`; }
function qrPolys(text, x, y, size, layer){ try{ const q=qrcode(0,'M'); q.addData(text); q.make(); const n=q.getModuleCount(); const m=size/n; const out=[]; for(let r=0;r<n;r++) for(let c=0;c<n;c++) if(q.isDark(r,c)) out.push(rect(x+c*m,y+r*m,m,m,layer)); return out; }catch(e){ return []; } }

function coverGeometry(cab,it){
  const L=P.label, px=P.pitch, r=it.row, box=itemBox(cab,it); const polys=[]; const labels=[]; const groups=[];
  const nicheW=r.mod*px, nx=box.x+(box.w-nicheW)/2;
  const hasTop=r.groups.some(g=>g.name&&g.devices.some(d=>!d.blank)), hasBot=r.groups.some(g=>g.bot&&g.devices.some(d=>!d.blank));
  const GT=P.grpTop||defaultGrp('top'), GB=P.grpBot||defaultGrp('bot');
  const topSpace = hasTop? grpSpaceOf(GT,true) : 0, botSpace = hasBot? grpSpaceOf(GB,true) : 0;
  const blockH = L.h+L.gap+r.nicheH+topSpace+botSpace;
  const pos=r.pos||'block'; let nicheTop;
  if(pos==='top') nicheTop = box.y + (r.nicheY==null? blockH-botSpace-r.nicheH : r.nicheY);
  else if(pos==='niche') nicheTop = box.y + (box.h-r.nicheH)/2;
  else nicheTop = box.y + (box.h-blockH)/2 + topSpace + L.h + L.gap;
  const labBottom=nicheTop-L.gap, labTop=labBottom-L.h, lwM=L.lwMain||0, lwV=L.lwDivV||0, lwH=L.lwDivH||0, splitY=labTop+L.h*(L.split/100);
  const gx=groupX(r);
  for(const g of r.groups){ const x0=gx.get(g.id); let m=x0; const gi={grp:g, x:nx+x0*px, w:groupMod(g)*px, m0:x0, labels:[]}; groups.push(gi);
    for(const d of g.devices){ const lb={dev:d, grp:g, x:nx+m*px, w:d.mod*px, m}; labels.push(lb); gi.labels.push(lb); m+=d.mod; } }
  labels.sort((a,b)=>a.x-b.x);
  polys.push(rect(box.x,box.y,box.w,box.h,'CUT')); polys.push(rect(nx,nicheTop,nicheW,r.nicheH,'CUT'));
  const H=P.holes||{n:0}; if(H.n>0){ const o=H.off||10, rr=(H.d||5)/2; const pts=[[box.x+o,box.y+o],[box.x+box.w-o,box.y+o],[box.x+o,box.y+box.h-o],[box.x+box.w-o,box.y+box.h-o]]; if(H.n>=6){ pts.push([box.x+box.w/2,box.y+o],[box.x+box.w/2,box.y+box.h-o]); } for(const p of pts) polys.push(circle(p[0],p[1],rr,'HOLES')); }
  let i=0; while(i<labels.length){ if(labels[i].dev.blank){i++;continue;} let j=i; while(j+1<labels.length && !labels[j+1].dev.blank && Math.abs(labels[j+1].x-(labels[j].x+labels[j].w))<0.01) j++;
    const run=labels.slice(i,j+1); const x1=run[0].x, x2=run[run.length-1].x+run[run.length-1].w;
    if(L.frame) polys.push(...frame(x1,labTop,x2-x1,L.h,'FRAME_MAIN',lwM,L.frameR||0));
    if(L.divV) for(let k=1;k<run.length;k++) polys.push(seg(run[k].x,labTop+lwM,run[k].x,labBottom-lwM,'FRAME_DIV_V',lwV));
    if(L.divH){ let a=0; while(a<run.length){ if(tableCells(run[a].dev)){a++;continue;} let b=a; while(b+1<run.length && !tableCells(run[b+1].dev)) b++; polys.push(seg(run[a].x+(a===0?lwM:0), splitY, run[b].x+run[b].w-(b===run.length-1?lwM:0), splitY,'FRAME_DIV_H',lwH)); a=b+1; } }
    for(const lb of run){ const d=lb.dev; const symH=d.symH||L.symH, nameH=d.nameH||L.nameH, cellH=d.cellH||L.cellH||nameH; const tc=tableCells(d); const first=lb===run[0], last=lb===run[run.length-1];
      const ipos=d.icon? (d.iconPos||'left') : ''; const isc=(d.iconScale||L.iconScale||0.9);
      const cellContent=(txt,k,bx,by,bw,bh)=>{ if(ipos==='cell'+(k+1)){ polys.push(...iconPolys(d.icon,bx+L.pad,by+L.pad,bw-2*L.pad,bh-2*L.pad,'ICON',isc)); return; } polys.push(...fitText(txt, cellH, bx,by,bw,bh, L.pad,'TEXT_NAME',L.font,{tag:'cell:'+d.id+':'+k})); };
      if(tc){ const cells=(d.name||'').split('|'); const n=tc.n;
        if(tc.dir==='rows'){ const ch=L.h/n; for(let k=0;k<n;k++){ cellContent(cells[k]||'',k,lb.x,labTop+k*ch,lb.w,ch); if(k>0&&L.divH) polys.push(seg(lb.x+(first?lwM:0), labTop+k*ch, lb.x+lb.w-(last?lwM:0), labTop+k*ch,'FRAME_DIV_H',lwH)); } }
        else { const cw=lb.w/n; for(let k=0;k<n;k++){ cellContent(cells[k]||'',k,lb.x+k*cw,labTop,cw,L.h); if(k>0&&L.divV) polys.push(seg(lb.x+k*cw, labTop+lwM, lb.x+k*cw, labBottom-lwM,'FRAME_DIV_V',lwV)); } } }
      else { const upper=[lb.x,labTop,lb.w,splitY-labTop], lower=[lb.x,splitY,lb.w,labBottom-splitY]; const symBox=L.symTop?upper:lower; let nameBox=L.symTop?lower:upper;
        if(d.symbol) polys.push(...fitText(d.symbol, symH, ...symBox, L.pad,'TEXT_SYMBOL',L.fontSym||L.font,{tag:'symbol:'+d.id}));
        let nm=(d.name||'').replace(/\|/g,'/'); if(L.showRating&&d.rating) nm=(nm?nm+'/':'')+d.rating;
        if(ipos==='replace'){ polys.push(...iconPolys(d.icon,nameBox[0]+L.pad,nameBox[1]+L.pad,nameBox[2]-2*L.pad,nameBox[3]-2*L.pad,'ICON',isc)); }
        else { if(ipos==='left'||ipos==='right'){ const side=Math.min(nameBox[3], nameBox[2]*0.4); const ix= ipos==='left'? nameBox[0]+L.pad : nameBox[0]+nameBox[2]-side-L.pad; polys.push(...iconPolys(d.icon, ix, nameBox[1]+L.pad, side-L.pad, nameBox[3]-2*L.pad,'ICON',isc)); nameBox= ipos==='left'? [nameBox[0]+side, nameBox[1], nameBox[2]-side, nameBox[3]] : [nameBox[0], nameBox[1], nameBox[2]-side, nameBox[3]]; }
          if(nm) polys.push(...fitText(nm, nameH, ...nameBox, L.pad,'TEXT_NAME',L.font,{tag:'name:'+d.id})); } } }
    i=j+1; }
  for(const gi of groups){ const g=gi.grp; const lbs=gi.labels.filter(l=>!l.dev.blank); if(!lbs.length) continue; const xa=lbs[0].x, xb=lbs[lbs.length-1].x+lbs[lbs.length-1].w;
    GT._gid=g.id; GB._gid=g.id; if(g.name) polys.push(...grpTextGeom(GT,g.name,xa,xb,labTop-(GT.gap||0),'top','GRP_TOP_TEXT','GRP_TOP_LINE'));
    if(g.bot) polys.push(...grpTextGeom(GB,g.bot,xa,xb,nicheTop+r.nicheH+(GB.gap||0),'bot','GRP_BOT_TEXT','GRP_BOT_LINE')); }
  if(P.info&&P.info.on){ const ih=P.info.h||3; polys.push(...fitText(coverInfoText(cab,it), ih, box.x+3, box.y+2, box.w-6, ih*1.6, 0,'INFO',L.fontInfo||L.font,{raw:true,align:'left'})); }
  const Q=P.qr||{pos:0}; if(Q.pos>0){ const sz=Q.size||15; const qx= (Q.pos===2)? box.x+3 : box.x+box.w-3-sz; const qy= (Q.pos===1)? box.y+3 : box.y+box.h-3-sz; polys.push(...qrPolys(coverInfoText(cab,it), qx, qy, sz, 'QR')); }
  for(const lb of labels) polys.push(rect(lb.x+0.3,nicheTop+2,lb.w-0.6,r.nicheH-4,'DEVICES'));
  polys.push(line(nx,nicheTop+r.nicheH/2,nx+nicheW,nicheTop+r.nicheH/2,'RAIL')); for(let k=0;k<=r.mod;k++) polys.push(line(nx+k*px,nicheTop,nx+k*px,nicheTop+r.nicheH,'RAIL'));
  return {box, labels, groups, polys, nx, nicheW, nicheTop, labTop, labBottom, topSpace, botSpace};
}
function cabGeometry(c){ let polys=[]; const x=cabX(c); polys.push(rect(x,0,c.w,c.h,'CABINET')); if(c.plinth>0) polys.push(rect(x,c.h,c.w,c.plinth,'CABINET'));
  for(const it of c.items){ const b=itemBox(c,it); if(it.type==='cover') polys=polys.concat(coverGeometry(c,it).polys); else if(it.type==='blank') polys.push(rect(b.x,b.y,b.w,b.h,'CUT')); else if(it.type==='plate') polys.push(rect(b.x,b.y,b.w,b.h,'PLATE')); else polys.push(rect(b.x,b.y,b.w,b.h,'CABINET')); }
  if(P.info&&P.info.on){ const ih=Math.max((P.info.h||3)*1.3, c.w/45); polys.push(...fitText(`Szafa ${P.cabinets.indexOf(c)+1} - ${c.w}x${c.h}${c.plinth?' + cokol '+c.plinth:''}`, ih, x+2, -ih*1.8, c.w-4, ih*1.5, 0, 'INFO',P.label.fontInfo||P.label.font,{raw:true,align:'left'})); }
  return polys; }
function allGeometry(){ let polys=[]; for(const c of P.cabinets) polys=polys.concat(cabGeometry(c));
  if(P.info&&P.info.on){ const ih=Math.max((P.info.h||3)*1.6, totalW()/50); polys.push(...fitText(`${ORDER.number?ORDER.number+' - ':''}${P.name||''} ${P.tag||''} rev.${P.revision||'-'} - ${new Date().toISOString().slice(0,10)}`, ih, 0, -ih*3.6, totalW(), ih*1.5, 0, 'INFO',P.label.fontInfo||P.label.font,{raw:true,align:'left'})); }
  return polys; }

__DXF__
function toDxfCoords(polys, box){ const org=$('origin').value; const ox=box.x+(org==='center'?box.w/2:0), oy=box.y+(org==='center'?box.h/2:box.h);
  return polys.map(p=>({closed:p.closed, layer:p.layer, pts:p.pts.map(q=>[q[0]-ox, oy-q[1]])})); }
function activeLayers(){ return new Set([...document.querySelectorAll('.lay:checked')].map(c=>c.value)); }
function fname(s){ return (s||'').replace(/[^\w\-]+/g,'_'); }
function exportWhole(){ const lay=activeLayers(); const polys=allGeometry().filter(p=>lay.has(p.layer)); if(!polys.length){toast('Zaznacz warstwy do eksportu');return;}
  saveFile(`${fname(P.tag||P.name)}_calosc.dxf`, dxfFile(toDxfCoords(polys,{x:0,y:0,w:totalW(),h:totalH()}), $('dxfver').value)); }
function exportCab(c){ const lay=activeLayers(); const polys=cabGeometry(c).filter(p=>lay.has(p.layer)); if(!polys.length){toast('Brak warstw');return;} saveFile(`${fname(P.tag||P.name)}_szafa${P.cabinets.indexOf(c)+1}.dxf`, dxfFile(toDxfCoords(polys,{x:cabX(c),y:0,w:c.w,h:cabTotalH(c)}), $('dxfver').value)); }
function exportItem(cab,it){ const lay=activeLayers(); const g=coverGeometry(cab,it); const polys=g.polys.filter(p=>lay.has(p.layer)); if(!polys.length){toast('Brak warstw do eksportu');return Promise.resolve();}
  const ci=P.cabinets.indexOf(cab)+1, ii=cab.items.indexOf(it)+1; return saveFile(`${fname(P.tag||P.name)}_szafa${ci}_maskownica${ii}.dxf`, dxfFile(toDxfCoords(polys,g.box), $('dxfver').value)); }

/* ===================== PDF (minimal vector writer) ===================== */
function pdfDoc(){ const objs=[]; const add=s=>{ objs.push(s); return objs.length; }; return {objs, add}; }
function makePdf(pages){ // pages: [{w,h (pt), content:string}] – all strings are latin-1 safe
  const D=pdfDoc(); const pageIds=[]; const parentId=D.add(''); const fontId=D.add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  for(const pg of pages){ const cId=D.add(`<< /Length ${pg.content.length} >>\nstream\n`+pg.content+`\nendstream`); const pId=D.add(`<< /Type /Page /Parent ${parentId} 0 R /MediaBox [0 0 ${f(pg.w)} ${f(pg.h)}] /Contents ${cId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`); pageIds.push(pId); }
  D.objs[parentId-1]=`<< /Type /Pages /Kids [${pageIds.map(i=>i+' 0 R').join(' ')}] /Count ${pageIds.length} >>`;
  const catId=D.add(`<< /Type /Catalog /Pages ${parentId} 0 R >>`);
  let out='%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n'; const offs=[];
  D.objs.forEach((o,i)=>{ offs.push(out.length); out+=`${i+1} 0 obj\n${o}\nendobj\n`; });
  const xref=out.length; out+=`xref\n0 ${D.objs.length+1}\n0000000000 65535 f \n`+offs.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${D.objs.length+1} /Root ${catId} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return out; }
const PAPER={A4:[595.28,841.89], A3:[841.89,1190.55]};
function pdfPage(polys, box, title, sub, mode){ // box in mm (y-down), returns page object
  const size=$('pdfSize').value||'A4'; let [pw,ph]=PAPER[size]; const landscape = box.w/box.h > 1.05; if(landscape) [pw,ph]=[ph,pw];
  const m=28, tb=44; const availW=pw-2*m, availH=ph-2*m-tb; const mm=72/25.4; const scale=Math.min(availW/(box.w*mm), availH/(box.h*mm), 1); const k=mm*scale;
  const ox=m+(availW-box.w*k)/2, oy=m+(availH-box.h*k)/2; // drawing area is above the title block; y_pdf = ph - (oy + (y-box.y)*k)
  const X=x=>f(ox+(x-box.x)*k), Y=y=>f(ph-(oy+(y-box.y)*k));
  let c='0 0 0 RG 0 0 0 rg 1 J 1 j\n';
  const wmm={CUT:0.5,HOLES:0.3,CABINET:0.7,PLATE:0.5,DEVICES:0.25,RAIL:0.15,INFO:0.2}; const wpt=l=>Math.max(0.25, (wmm[l]||0.18)*k);
  const eo={}; const pp=p=>p.pts.map((q,i)=>`${X(q[0])} ${Y(q[1])} ${i?'l':'m'}`).join(' ')+' h';
  for(const p of polys){ if(p.pts.length<2) continue; if(p.closed&&(p.outline||p.icon||p.layer==='QR')){ (eo[p.layer]=eo[p.layer]||[]).push(pp(p)); continue; } const filled=p.closed&&p.band; c+=`${filled?'':f(wpt(p.layer))+' w '}`; c+=p.pts.map((q,i)=>`${X(q[0])} ${Y(q[1])} ${i?'l':'m'}`).join(' ')+(p.closed?' h':'')+(filled?' f':' S')+'\n'; }
  for(const k in eo) c+=eo[k].join(' ')+' f*\n';
  // dashed cabinet dividers etc. left out. title block
  const tx=m, ty=m+tb-8; const esc=s=>String(s).replace(/[()\\]/g,'\\$&').replace(/[^\x20-\x7e\xa0-\xff]/g,'?');
  c+=`0.8 w ${f(m)} ${f(m)} ${f(pw-2*m)} ${f(tb)} re S\n`;
  c+=`BT /F1 11 Tf ${f(tx+6)} ${f(m+tb-16)} Td (${esc(title)}) Tj ET\n`;
  c+=`BT /F1 8 Tf ${f(tx+6)} ${f(m+tb-30)} Td (${esc(sub)}) Tj ET\n`;
  c+=`BT /F1 8 Tf ${f(pw-m-170)} ${f(m+tb-16)} Td (Skala 1:${f(Math.round(100/scale)/100)}  ${size} ${landscape?'poziomo':'pionowo'}) Tj ET\n`;
  c+=`BT /F1 8 Tf ${f(pw-m-170)} ${f(m+tb-30)} Td (${esc(APP_NAME+' '+APP_VER+'  '+new Date().toISOString().slice(0,10))}) Tj ET\n`;
  return {w:pw,h:ph,content:c}; }
function pdfPolysFor(scope, mode){ const keep=new Set(['CUT','HOLES','ICON','FRAME_MAIN','FRAME_DIV_V','FRAME_DIV_H','TEXT_SYMBOL','TEXT_NAME','GRP_TOP_LINE','GRP_TOP_TEXT','GRP_BOT_LINE','GRP_BOT_TEXT','QR','CABINET','PLATE','DEVICES','INFO']);
  const filt=ps=>ps.filter(p=>keep.has(p.layer));
  const addRatings=(cab,it)=>{ if(mode!=='install') return []; const g=coverGeometry(cab,it); let out=[]; const nh=it.row.nicheH; for(const lb of g.labels){ const d=lb.dev; if(d.blank) continue; const t=[d.symbol||d.code, d.rating].filter(Boolean).join('/'); const narrow=lb.w<2.2*P.pitch; out=out.concat(narrow? fitTextV(t, 3, lb.x+0.6, g.nicheTop+3, lb.w-1.2, nh-6, 0.3,'DEVICES','h:simplex') : fitText(t, 3, lb.x, g.nicheTop+nh*0.55, lb.w, nh*0.4, 0.4,'DEVICES','h:simplex')); } return out; };
  const cabOverview=c=>{ let polys=filt(cabGeometry(c).filter(p=>!['FRAME_MAIN','FRAME_DIV_V','FRAME_DIV_H','TEXT_SYMBOL','TEXT_NAME','GRP_TOP_LINE','GRP_TOP_TEXT','GRP_BOT_LINE','GRP_BOT_TEXT','QR','ICON','HOLES','INFO'].includes(p.layer))); const th=Math.max(6,c.w/40); polys=polys.concat(fitText(`Szafa ${P.cabinets.indexOf(c)+1} - ${c.w}x${c.h}${c.plinth?' + cokol '+c.plinth:''}`, th*1.2, cabX(c), -th*2.2, c.w, th*1.8, 0,'INFO',P.label.fontInfo||P.label.font,{raw:true,align:'left'}));
    c.items.forEach((it,ii)=>{ const bx=itemBox(c,it); polys=polys.concat(fitText(`${ii+1}. ${ITEM_NAMES[it.type]} ${it.w}x${it.h}${it.type==='cover'?' - '+it.row.mod+' mod':''}`, th, bx.x+4, bx.y+4, bx.w-8, th*1.6, 0,'INFO',P.label.fontInfo||P.label.font,{raw:true,align:'left'})); }); return polys; };
  if(scope==='cabplus'){ const c=selCab||P.cabinets[0]; if(!c) return null; const pages=[{polys:cabOverview(c), box:{x:cabX(c),y:-14,w:c.w,h:cabTotalH(c)+14}, title:`${P.name} ${P.tag||''} - szafa ${P.cabinets.indexOf(c)+1} (${c.w}x${c.h}) - uklad`}];
    c.items.forEach((it,ii)=>{ if(it.type!=='cover') return; const g=coverGeometry(c,it); pages.push({polys:filt(g.polys).concat(addRatings(c,it)), box:g.box, title:`${P.name} ${P.tag||''} - szafa ${P.cabinets.indexOf(c)+1}, maskownica ${ii+1} (${it.w}x${it.h})`}); }); return pages; }
  if(scope==='item'){ if(!selItem||selItem.type!=='cover') return null; const cab=findItem(selItem.id).cab; const g=coverGeometry(cab,selItem); return [{polys:filt(g.polys).concat(addRatings(cab,selItem)), box:g.box, title:`${P.name} ${P.tag||''} - szafa ${P.cabinets.indexOf(cab)+1}, maskownica ${cab.items.indexOf(selItem)+1} (${selItem.w}×${selItem.h})`}]; }
  if(scope==='items'){ return coverItems().map(({cab,item})=>{ const g=coverGeometry(cab,item); return {polys:filt(g.polys).concat(addRatings(cab,item)), box:g.box, title:`${P.name} ${P.tag||''} - szafa ${P.cabinets.indexOf(cab)+1}, maskownica ${cab.items.indexOf(item)+1} (${item.w}×${item.h})`}; }); }
  if(scope==='cab'){ const c=selCab||P.cabinets[0]; if(!c) return null; let polys=filt(cabGeometry(c)); for(const it of c.items) if(it.type==='cover') polys=polys.concat(addRatings(c,it)); return [{polys, box:{x:cabX(c),y:-14,w:c.w,h:cabTotalH(c)+14}, title:`${P.name} ${P.tag||''} - szafa ${P.cabinets.indexOf(c)+1} (${c.w}×${c.h})`}]; }
  let polys=filt(allGeometry()); for(const {cab,item} of coverItems()) polys=polys.concat(addRatings(cab,item)); return [{polys, box:{x:0,y:-22,w:totalW(),h:totalH()+22}, title:`${P.name} ${P.tag||''} - rozdzielnica (${P.cabinets.length} szaf)`}]; }
function exportPdf(){ const scope=$('pdfScope').value, mode=$('pdfMode').value; const pages=pdfPolysFor(scope,mode); if(!pages||!pages.length){ toast('Zaznacz element do eksportu'); return; }
  const sub=`Zlecenie: ${ORDER.number||'-'} ${ORDER.client?'· '+ORDER.client:''} ${ORDER.object?'· '+ORDER.object:''}  |  Rewizja ${P.revision||'-'}`;
  const pdf=makePdf(pages.map(pg=>pdfPage(pg.polys,pg.box,pg.title,sub,mode)));
  const bytes=new Uint8Array(pdf.length); for(let i=0;i<pdf.length;i++) bytes[i]=pdf.charCodeAt(i)&255;
  saveFile(`${fname(P.tag||P.name)}_${scope}.pdf`, bytes, 'application/pdf'); }
function exportBom(){ const rows=[['Szafa','Maskownica','Grupa','Symbol','Kod','Model','Nazwa','Moduły']]; for(const {cab,item} of coverItems()){ const ci=P.cabinets.indexOf(cab)+1, ii=cab.items.indexOf(item)+1; for(const g of item.row.groups) for(const d of g.devices){ if(d.blank) continue; rows.push([ci,ii,g.name,d.symbol,d.code,d.rating||'',(d.name||'').replace(/\|/g,' / '),d.mod]); } }
  saveFile(`${fname(P.tag||P.name)}_zestawienie.csv`, '\uFEFF'+rows.map(r=>r.map(v=>String(v).replace(/;/g,',')).join(';')).join('\n')); }

/* ===================== Render ===================== */
const NS='http://www.w3.org/2000/svg';
function pathD(p){ return p.pts.map((q,i)=>(i?'L':'M')+f(q[0])+' '+f(q[1])).join('')+(p.closed?'Z':''); }
function esc(t){ return String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
let ZOOM={k:1, cx:null, cy:null, key:''}; let BASE={x:0,y:0,w:1,h:1};
function baseViewBox(){ const W=totalW(), H=totalH(); let pad=Math.max(10,W*0.03); let b={x:-pad,y:-pad-30,w:W+2*pad,h:H+2*pad+30,key:'all'};
  if(VIEW==='cab'&&selCab){ const x=cabX(selCab); b={x:x-pad,y:-pad-10,w:selCab.w+2*pad,h:cabTotalH(selCab)+2*pad+10,key:'cab'+selCab.id}; }
  if(VIEW==='item'&&selItem){ const fi=findItem(selItem.id); const bx=itemBox(fi.cab,selItem); const p2=6; b={x:bx.x-p2,y:bx.y-p2,w:bx.w+2*p2,h:bx.h+2*p2,key:'item'+selItem.id}; }
  return b; }
function currentViewBox(){ const b=baseViewBox(); if(ZOOM.key!==b.key){ ZOOM={k:1,cx:b.x+b.w/2,cy:b.y+b.h/2,key:b.key}; } BASE=b; const w=b.w/ZOOM.k, h=b.h/ZOOM.k; return {x:ZOOM.cx-w/2, y:ZOOM.cy-h/2, w, h}; }
function applyViewBox(){ const v=currentViewBox(); const svg=$('svg'); if(svg) svg.setAttribute('viewBox',`${v.x} ${v.y} ${v.w} ${v.h}`); }
function svgFrame(polys, on){ let s=''; const pairs={}; for(const p of polys){ if(!on.has(p.layer)) continue; if(p.pair){ (pairs[p.pair]=pairs[p.pair]||[]).push(p); continue; } if(p.layer==='QR') { s+=`<path d="${pathD(p)}" fill="var(--ink)"/>`; continue; }
    if(p.band) s+=`<path d="${pathD(p)}" fill="var(--ink)" stroke="none"/>`; else s+=`<path d="${pathD(p)}" fill="none" stroke="var(--ink)" stroke-width=".3"/>`; }
  for(const k in pairs) s+=`<path d="${pairs[k].map(pathD).join(' ')}" fill="var(--ink)" fill-rule="evenodd" stroke="none"/>`; return s; }
function svgText(polys, on){ let s=''; const fill={}; for(const p of polys){ if(!on.has(p.layer)) continue; const key=p.layer+(p.shrunk?'!':''); if(p.closed&&p.outline){ (fill[key]=fill[key]||[]).push(pathD(p)); continue; } s+=`<path d="${pathD(p)}" fill="none" stroke="${p.shrunk?'var(--danger)':'var(--ink)'}" stroke-width="0.3" stroke-linecap="round" stroke-linejoin="round"/>`; }
  for(const k in fill) s+=`<path d="${fill[k].join(' ')}" fill="${k.endsWith('!')?'var(--danger)':'var(--ink)'}" fill-rule="evenodd" stroke="none"/>`; return s; }
let FITMAP=new Map();
function render(){ renderCanvas(); renderCrumb(); renderCabs(); renderItems(); renderGroups(); renderEditor(); renderPalette(); renderMulti(); renderTplList(); renderTable(); }
function renderCanvas(){
  renumber(); scheduleSave(); FIT_LOG=[];
  const v=currentViewBox(); const W=totalW(); const tall = BASE.h<BASE.w;
  let s=`<svg xmlns="${NS}" viewBox="${v.x} ${v.y} ${v.w} ${v.h}" id="svg"${tall?' style="max-height:none;width:100%"':''}>`;
  s+=`<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="var(--cover-edge)" stroke-width=".5"/></pattern></defs>`;
  let nDev=0; const FR=new Set(['FRAME_MAIN','FRAME_DIV_V','FRAME_DIV_H','GRP_TOP_LINE','GRP_BOT_LINE','QR','HOLES']), TX=new Set(['TEXT_SYMBOL','TEXT_NAME','GRP_TOP_TEXT','GRP_BOT_TEXT','INFO']);
  if(VIEW==='all') s+=`<text x="${W/2}" y="-18" font-size="${Math.max(7,W/60)}" text-anchor="middle" font-weight="600" fill="var(--ink)">${esc((ORDER.number?ORDER.number+' · ':'')+P.name+(P.tag?' '+P.tag:''))}</text>`;
  P.cabinets.forEach((c,ci)=>{ const x0=cabX(c); const on=c===selCab; const e=Math.max(4,c.w*0.012);
    s+=`<g class="cab" data-cab="${c.id}">`;
    if(c.plinth>0) s+=`<rect x="${x0}" y="${c.h}" width="${c.w}" height="${c.plinth}" fill="var(--plinth)" stroke="var(--cab-edge)" stroke-width="1" vector-effect="non-scaling-stroke"/><circle cx="${x0+e*2}" cy="${c.h+c.plinth/2}" r="${e*0.4}" fill="var(--cab-edge)"/><circle cx="${x0+c.w-e*2}" cy="${c.h+c.plinth/2}" r="${e*0.4}" fill="var(--cab-edge)"/>`;
    s+=`<rect x="${x0}" y="0" width="${c.w}" height="${c.h}" fill="var(--cab)" stroke="${on&&VIEW!=='item'?'var(--sel)':'var(--cab-edge)'}" stroke-width="${on?2.2:1.4}" vector-effect="non-scaling-stroke"/>`;
    s+=`<rect x="${x0+e}" y="${e}" width="${c.w-2*e}" height="${c.h-2*e}" fill="var(--cab-inner)" stroke="var(--cab-edge)" stroke-width=".6" vector-effect="non-scaling-stroke"/>`;
    s+=`<text x="${x0+c.w/2}" y="${-3}" font-size="${Math.max(6,W/80)}" text-anchor="middle" fill="var(--ink-2)">Szafa ${ci+1} · ${c.w}×${c.h}${c.plinth?' + cokół '+c.plinth:''}</text>`;
    const used=c.items.reduce((a,i)=>a+i.h,0); if(used>c.h) s+=`<text x="${x0+c.w/2}" y="${cabTotalH(c)+12}" font-size="${Math.max(6,W/80)}" text-anchor="middle" fill="var(--danger)">Elementy wyższe niż szafa (${used} mm)</text>`;
    if(MODE==='door'||c.door){ s+=doorSvg(c,x0,e)+`</g>`; return; }
    c.items.forEach((it,ii)=>{ const b=itemBox(c,it); const sel=it===selItem;
      s+=`<g class="item${sel?' sel':''}" data-item="${it.id}">`;
      if(it.type==='empty') s+=`<rect class="box" x="${b.x+e}" y="${b.y+e*0.5}" width="${b.w-2*e}" height="${Math.max(0,b.h-e)}" fill="var(--empty)" stroke="var(--cab-edge)" stroke-width=".4" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`;
      else if(it.type==='plate') s+=`<rect class="box" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="var(--plate)" stroke="var(--cover-edge)" stroke-width="1" vector-effect="non-scaling-stroke"/><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="url(#hatch)" opacity=".5"/>`;
      else { s+=`<rect class="box" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="1.5" fill="var(--cover)" stroke="var(--cover-edge)" stroke-width="1" vector-effect="non-scaling-stroke"/><rect x="${b.x+1.5}" y="${b.y+1.5}" width="${b.w-3}" height="${b.h-3}" rx="1" fill="none" stroke="var(--cover-edge)" stroke-width=".4" opacity=".6" vector-effect="non-scaling-stroke"/>`;
        const sc=Math.min(2.2,b.h*0.08); for(const [px,py] of [[b.x+7,b.y+7],[b.x+b.w-7,b.y+7],[b.x+7,b.y+b.h-7],[b.x+b.w-7,b.y+b.h-7]]) s+=`<circle cx="${px}" cy="${py}" r="${sc}" fill="var(--cover)" stroke="var(--cover-edge)" stroke-width=".5" vector-effect="non-scaling-stroke"/><line x1="${px-sc*0.7}" y1="${py}" x2="${px+sc*0.7}" y2="${py}" stroke="var(--cover-edge)" stroke-width=".4" vector-effect="non-scaling-stroke"/>`; }
      const fs=Math.min(b.h*0.22, Math.max(4, b.w/28)); if(VIEW!=='item') s+=`<text x="${b.x+12}" y="${b.y+fs+3}" font-size="${fs}" fill="var(--ink-2)" opacity=".75">${esc(ITEM_NAMES[it.type])} ${it.w}×${it.h}</text>`;
      if(it.type==='cover'){ const g=coverGeometry(c,it); const r=it.row;
        s+=`<rect x="${g.nx}" y="${g.nicheTop}" width="${g.nicheW}" height="${r.nicheH}" fill="var(--niche)" stroke="var(--cover-edge)" stroke-width=".6" vector-effect="non-scaling-stroke"/>`;
        s+=`<line x1="${g.nx}" y1="${g.nicheTop+r.nicheH/2}" x2="${g.nx+g.nicheW}" y2="${g.nicheTop+r.nicheH/2}" stroke="var(--cover-edge)" stroke-width=".4" vector-effect="non-scaling-stroke" stroke-dasharray="3 2"/>`;
        const hh=Math.min(5, Math.max(3, P.label.h*0.3)); const hy=g.labTop-g.topSpace-hh-1.5;
        for(const gi of g.groups){ const on=gi.grp===selGrp; const ic= gi.grp.align==='left'?'⇤': gi.grp.align==='right'?'⇥':'↔';
          s+=`<g class="grp${on?' sel':''}" data-grp="${gi.grp.id}"><rect x="${gi.x}" y="${hy}" width="${gi.w}" height="${hh}" rx="1" fill="${on?'var(--sel)':'var(--cover-edge)'}" opacity="${on?.9:.45}"/>`;
          if(!gi.labels.length) s+=`<rect x="${gi.x}" y="${g.labTop}" width="${gi.w}" height="${P.label.h+P.label.gap+r.nicheH}" fill="none" stroke="var(--sel)" stroke-width=".6" stroke-dasharray="2 1.5" vector-effect="non-scaling-stroke"/>`;
          s+=`<text x="${gi.x+1}" y="${hy+hh*0.78}" font-size="${hh*0.7}" fill="#fff">${ic} ${esc(gi.grp.name||'grupa')}</text></g>`; }
        for(const lb of g.labels) if(!lb.dev.blank&&P.label.frame) s+=`<rect x="${lb.x}" y="${g.labTop}" width="${lb.w}" height="${P.label.h}" fill="var(--lab)"/>`;
        s+=svgFrame(g.polys, FR)+svgText(g.polys, TX); { const ic=g.polys.filter(p=>p.layer==='ICON'); if(ic.length) s+=`<path d="${ic.map(pathD).join(' ')}" fill="var(--ink)" fill-rule="evenodd"/>`; }
        for(const lb of g.labels){ const d=lb.dev; nDev++; const over=lb.m+d.mod>r.mod||lb.m<0; const sel=d===selDev||multi.has(d.id);
          s+=`<g class="dev${sel?' sel':''}${over?' overflow':''}" data-dev="${d.id}"><rect class="body" x="${lb.x+0.4}" y="${g.nicheTop+2}" width="${lb.w-0.8}" height="${r.nicheH-4}" fill="${d.blank?'var(--niche)':'var(--dev)'}" stroke="var(--dev-edge)" stroke-width=".5" vector-effect="non-scaling-stroke"/>`;
          if(!d.blank){ const narrow=lb.w<2.2*P.pitch; const cx=lb.x+lb.w/2, cy=g.nicheTop+r.nicheH*0.62; const txt=MODE==='install'? (d.symbol||d.code)+(d.rating?' · '+d.rating:'') : d.code; const rat=MODE==='install'&&!d.rating;
            s+=`<rect x="${lb.x+lb.w*0.25}" y="${g.nicheTop+r.nicheH*0.12}" width="${lb.w*0.5}" height="${r.nicheH*0.12}" rx=".6" fill="var(--dev-edge)" opacity=".55"/>`;
            if(narrow){ const fs2=Math.min(lb.w*0.55, 5, (r.nicheH*0.7)/Math.max(1,txt.length)*1.9); s+=`<text transform="translate(${cx} ${g.nicheTop+r.nicheH*0.66}) rotate(-90)" font-size="${fs2}" text-anchor="middle" dominant-baseline="middle" font-weight="${MODE==='install'?600:400}" fill="${rat?'var(--danger)':'var(--ink-2)'}">${esc(txt)}</text>`; }
            else { const fs2=Math.min(lb.w*0.42,6, lb.w*1.7/Math.max(1,txt.length)); s+=`<text x="${cx}" y="${cy}" font-size="${fs2}" text-anchor="middle" font-weight="${MODE==='install'?600:400}" fill="${rat?'var(--danger)':'var(--ink-2)'}">${esc(txt)}</text>`; } }
          s+=`</g>`; }
      }
      s+=`</g>`; });
    s+=`</g>`; });
  s+=`<g id="ghost"></g></svg>`;
  $('canvas').innerHTML=s; $('stats').textContent=`${P.cabinets.length} szaf · ${coverItems().length} maskownic · ${nDev} aparatów · ${Math.round(ZOOM.k*100)}%`;
  FITMAP=new Map(); for(const x of FIT_LOG) if(x.tag){ const prev=FITMAP.get(x.tag); if(!prev||x.k<prev.k) FITMAP.set(x.tag,x); } FIT_LOG=null;
}
function doorSvg(c,x0,e){ const leaves=c.leaves===2?2:1; const hinge=c.hinge==='right'?'right':'left'; const m=e*0.6; const H=c.h-2*m; let s='';
  const handle=(hx,hy)=>{ const W=26, H=140; // stała wielkość w mm – klamka uchylna (pill) z zamkiem u dołu
    return `<rect x="${hx-W/2}" y="${hy-H/2}" width="${W}" height="${H}" rx="${W/2}" fill="#dfe1df" stroke="var(--cab-edge)" stroke-width="1" vector-effect="non-scaling-stroke"/><rect x="${hx-W/2+5}" y="${hy-H/2+14}" width="${W-10}" height="${H-40}" rx="${(W-10)/2}" fill="#f2f3f2" stroke="var(--cab-edge)" stroke-width=".4" opacity=".9" vector-effect="non-scaling-stroke"/><circle cx="${hx}" cy="${hy+H/2-16}" r="6" fill="#2b2f33"/><rect x="${hx-1.2}" y="${hy+H/2-22}" width="2.4" height="12" fill="#8a8f93"/>`; };
  const hinges=(hx)=>[0.12,0.5,0.88].map(t=>`<rect x="${hx-e*0.35}" y="${m+H*t-e*1.2}" width="${e*0.7}" height="${e*2.4}" rx="${e*0.2}" fill="var(--cab-edge)" opacity=".7"/>`).join('');
  if(leaves===1){ s+=`<rect x="${x0+m}" y="${m}" width="${c.w-2*m}" height="${H}" rx="${e*0.4}" fill="var(--door)" stroke="var(--cab-edge)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>`; s+=`<rect x="${x0+m+e*1.2}" y="${m+e*1.2}" width="${c.w-2*m-e*2.4}" height="${H-e*2.4}" rx="${e*0.3}" fill="none" stroke="var(--cab-edge)" stroke-width=".4" opacity=".5" vector-effect="non-scaling-stroke"/>`;
    const hx= hinge==='left'? x0+c.w-m-42 : x0+m+42; s+=handle(hx, c.h*0.5); s+=hinges(hinge==='left'? x0+m : x0+c.w-m); }
  else { const lw=(c.w-2*m)/2; for(let i=0;i<2;i++){ const lx=x0+m+i*lw; s+=`<rect x="${lx}" y="${m}" width="${lw-(i===0?e*0.15:0)}" height="${H}" rx="${e*0.3}" fill="var(--door)" stroke="var(--cab-edge)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>`; }
    s+=handle(x0+m+lw-30, c.h*0.5); s+=`<rect x="${x0+m+lw+18}" y="${c.h*0.5-45}" width="14" height="90" rx="7" fill="#dfe1df" stroke="var(--cab-edge)" stroke-width="1" vector-effect="non-scaling-stroke"/>`; s+=hinges(x0+m)+hinges(x0+c.w-m); }
  return s; }
function renderCrumb(){ $('crumb').innerHTML=`<span>${esc(ORDER.number||'(bez numeru)')}${ORDER.client?' · '+esc(ORDER.client):''}</span><span>›</span><b>${esc(P.name)}${P.tag?' '+esc(P.tag):''}</b>`; }
function renderCabs(){ $('cabs').innerHTML=P.cabinets.map((c,i)=>`<div class="it${c===selCab?' on':''}" data-cab="${c.id}"><span class="grow"><b>Szafa ${i+1}</b> · ${c.w}×${c.h}${c.plinth?' +'+c.plinth:''} · ${c.items.length} el.</span><button class="small ghost icon" data-act="left" title="W lewo">◀</button><button class="small ghost icon" data-act="right" title="W prawo">▶</button><button class="small ghost icon" data-act="dup" title="Duplikuj">⧉</button><button class="small danger icon" data-act="del">×</button></div>`).join('')||'<div class="it">Brak szaf</div>';
  const c=selCab; $('cabEdit').innerHTML= c? `<div class="row three" style="margin-top:8px"><label class="f">Szerokość mm<input type="number" data-cf="w" value="${c.w}" step="10"></label><label class="f">Wysokość mm<input type="number" data-cf="h" value="${c.h}" step="10"></label><label class="f">Cokół / fundament mm<input type="number" data-cf="plinth" value="${c.plinth||0}" step="10" min="0"></label></div><div class="row three"><label class="f">Zawiasy<select data-cf="hinge"><option value="left" ${(c.hinge||'left')==='left'?'selected':''}>Po lewej (klamka po prawej)</option><option value="right" ${c.hinge==='right'?'selected':''}>Po prawej (klamka po lewej)</option></select></label><label class="f">Skrzydła<select data-cf="leaves"><option value="1" ${(c.leaves||1)===1?'selected':''}>Jedno</option><option value="2" ${c.leaves===2?'selected':''}>Dwa</option></select></label><label class="chk" style="align-self:end"><input type="checkbox" data-cf="door" ${c.door?'checked':''}> Zawsze z drzwiami</label></div>`:''; }
function renderItems(){ const c=selCab; if(!c){ $('items').innerHTML='<div class="it">Zaznacz szafę</div>'; $('itemEdit').innerHTML=''; return; }
  const used=c.items.reduce((a,i)=>a+i.h,0);
  $('items').innerHTML=c.items.map((it,i)=>`<div class="it${it===selItem?' on':''}" data-item="${it.id}"><span class="grow"><span class="tag">${i+1}</span> ${esc(ITEM_NAMES[it.type])} <b>${it.w}×${it.h}</b>${it.type==='cover'?` · ${rowDevices(it.row).reduce((a,d)=>a+d.mod,0)}/${it.row.mod} mod`:''}</span><button class="small ghost icon" data-act="up">▲</button><button class="small ghost icon" data-act="down">▼</button><button class="small danger icon" data-act="del">×</button></div>`).join('')+`<div class="it" style="cursor:default;color:${used>c.h?'var(--danger)':'var(--ink-2)'}">Razem ${used} / ${c.h} mm${used<c.h?` · wolne ${c.h-used} mm`:''}</div>`;
  const it=selItem; if(!it||!findItem(it.id)||findItem(it.id).cab!==c){ $('itemEdit').innerHTML=''; return; }
  let h=`<h3>${esc(ITEM_NAMES[it.type])}</h3><div class="row three"><label class="f">Typ<select data-if="type"><option value="cover" ${it.type==='cover'?'selected':''}>Maskownica z wycięciem</option><option value="blank" ${it.type==='blank'?'selected':''}>Maskownica zaślepka</option><option value="plate" ${it.type==='plate'?'selected':''}>Płyta montażowa</option><option value="empty" ${it.type==='empty'?'selected':''}>Puste pole</option></select></label>
    <label class="f">Szerokość mm<input type="number" data-if="w" value="${it.w}" step="10"></label><label class="f">Wysokość mm<input type="number" data-if="h" value="${it.h}" step="10"></label></div>`;
  if(it.type==='cover'){ const pos=it.row.pos||'block'; h+=`<div class="row four"><label class="f">Moduły<input type="number" data-if="mod" value="${it.row.mod}" step="1" min="1"></label><label class="f">Wys. wycięcia mm<input type="number" data-if="nicheH" value="${it.row.nicheH}" step="1"></label>
    <label class="f">Położenie w pionie<select data-if="pos"><option value="block" ${pos==='block'?'selected':''}>Blok na środku</option><option value="niche" ${pos==='niche'?'selected':''}>Wycięcie na środku</option><option value="top" ${pos==='top'?'selected':''}>Od góry (mm)</option></select></label>
    <label class="f">Wycięcie od góry mm<input type="number" data-if="nicheY" value="${it.row.nicheY==null?'':it.row.nicheY}" step="1" ${pos!=='top'?'disabled':''}></label></div><div class="btns"><button class="small" id="btnItemTable">Tabela opisów</button><button class="small ghost" id="btnItemTpl">Zapisz maskownicę jako wzorzec</button></div>`; }
  $('itemEdit').innerHTML=h; const bt=$('btnItemTable'); if(bt) bt.onclick=()=>{ TABLE_ON=true; if(VIEW!=='item'){ VIEW='item'; document.querySelectorAll('#view button').forEach(x=>x.classList.toggle('on',x.dataset.v===VIEW)); ZOOM.key=''; } render(); }; const bp=$('btnItemTpl'); if(bp) bp.onclick=()=>saveCoverTemplate(it); }
function renderGroups(){ const it=selItem&&selItem.type==='cover'?selItem:null; const box=$('groups'); if(!it){ box.innerHTML='<div class="it" style="cursor:default;color:var(--ink-2)">Zaznacz maskownicę z wycięciem</div>'; $('grpEdit').innerHTML=''; return; }
  const gx=groupX(it.row);
  box.innerHTML=it.row.groups.map((g,i)=>`<div class="it${g===selGrp?' on':''}" data-grp="${g.id}"><span class="grow"><span class="tag">${i+1}</span> ${esc(g.name||'(bez nazwy)')}${g.bot?' / '+esc(g.bot):''} · ${g.devices.length} ap. · ${ALIGN_NAMES[g.align]}${g.align==='free'?' od '+gx.get(g.id):''}</span><button class="small ghost icon" data-act="up">▲</button><button class="small ghost icon" data-act="down">▼</button><button class="small danger icon" data-act="del">×</button></div>`).join('')||'<div class="it" style="cursor:default;color:var(--ink-2)">Brak grup – dodaj grupę, potem aparaty</div>';
  const g=selGrp&&it.row.groups.includes(selGrp)?selGrp:null; if(!g){ $('grpEdit').innerHTML=''; return; }
  $('grpEdit').innerHTML=`<div class="row" style="margin-top:8px"><label class="f">Podpis górny (pusty = bez linii)<input data-gf="name" value="${esc(g.name)}"></label><label class="f">Podpis dolny<input data-gf="bot" value="${esc(g.bot||'')}"></label></div>
    <div class="row"><label class="f">Położenie<select data-gf="align"><option value="left" ${g.align==='left'?'selected':''}>Do lewej krawędzi</option><option value="right" ${g.align==='right'?'selected':''}>Do prawej krawędzi</option><option value="free" ${g.align==='free'?'selected':''}>Swobodne</option></select></label><label class="f">Moduł od lewej<input type="number" data-gf="x" value="${gx.get(g.id)}" step="1" min="0" ${g.align!=='free'?'disabled':''}></label></div>
    <div class="btns"><button class="small" data-gact="toLeft">⇤ Do lewej</button><button class="small" data-gact="toRight">⇥ Do prawej</button><button class="small" data-gact="dup">Duplikuj grupę</button><button class="small ghost" data-gact="tpl">Zapisz jako wzorzec</button></div>`; }
function renderPalette(){ $('pal').innerHTML=DB.map((d,i)=>`<button data-db="${i}"><b>${esc(d.code)}</b><span>${esc(d.name||'—')}</span><i>${d.mod} mod${d.prefix?' · '+esc(d.prefix):''}${d.rating?' · '+esc(d.rating):''}${(d.table||'std')!=='std'?' · '+d.table.slice(1)+' pola':''}</i></button>`).join('');
  const it=selItem&&selItem.type==='cover'?selItem:null; const fi=it&&findItem(it.id); const g=selGrp&&it&&it.row.groups.includes(selGrp)?selGrp:null;
  $('devTarget').textContent= it? `Cel: szafa ${P.cabinets.indexOf(fi.cab)+1}, element ${fi.cab.items.indexOf(it)+1} (${it.w}×${it.h}, ${it.row.mod} mod)` + (g? `, grupa „${g.name||'bez nazwy'}”` : (it.row.groups.length? ', ostatnia grupa' : ' – powstanie grupa do lewej')) : 'Zaznacz maskownicę z wycięciem (zakładka Rozdzielnica lub klik na rysunku).'; }
function renderMulti(){ const el=$('multi'); const ids=[...multi]; if(ids.length<2){ el.innerHTML='Kliknij aparat na rysunku. <b>Shift+klik</b> zaznacza kilka – wtedy tu ustawisz model, tabelkę lub grupę dla wszystkich naraz.'; return; }
  el.innerHTML=`<b>${ids.length} aparatów</b><div class="row three" style="margin-top:6px"><label class="f">Model dla wszystkich<input id="mRating" placeholder="np. B16"></label><label class="f">Tabelka<select id="mTable"><option value="">– bez zmian –</option>${Object.entries(TABLES).map(([k,n])=>`<option value="${k}">${n}</option>`).join('')}</select></label><label class="f">&nbsp;<button class="small" id="mApply">Zastosuj</button></label></div><div class="btns"><button class="small danger" id="mDel">Usuń zaznaczone</button><button class="small ghost" id="mClear">Odznacz</button></div>`; }
function renderGrpSettings(){ for(const side of ['Top','Bot']){ const G=P['grp'+side]; const el=$('grp'+side); const fo=fontSelectOptions();
    el.innerHTML=`<div class="row three"><label class="f">Rodzaj linii<select data-gs="lineType">${Object.entries(LINE_TYPES).map(([k,n])=>`<option value="${k}" ${G.lineType===k?'selected':''}>${n}</option>`).join('')}</select></label><label class="f">Kreska/przerwa mm<input data-gs="dash" value="${esc(G.dash)}"></label><label class="f">Grubość linii mm<input type="number" data-gs="lw" step="0.05" min="0" value="${G.lw}"></label></div>
    <div class="row three"><label class="f">Czcionka<select data-gs="font">${fo}</select></label><label class="f">Wys. tekstu mm<input type="number" data-gs="size" step="0.5" value="${G.size}"></label><label class="f">Tekst względem linii<select data-gs="textPos"><option value="inline" ${G.textPos==='inline'?'selected':''}>W linii (z przerwą)</option><option value="above" ${G.textPos==='above'?'selected':''}>Nad linią</option><option value="below" ${G.textPos==='below'?'selected':''}>Pod linią</option></select></label></div>
    <div class="row four"><label class="f">Wyrównanie<select data-gs="align"><option value="left" ${G.align==='left'?'selected':''}>Od lewej</option><option value="center" ${G.align==='center'?'selected':''}>Środek</option><option value="right" ${G.align==='right'?'selected':''}>Od prawej</option></select></label><label class="f">Odstęp tekstu mm<input type="number" data-gs="offset" step="0.5" value="${G.offset}"></label><label class="f">Linia od ramki mm<input type="number" data-gs="gap" step="0.5" value="${G.gap}"></label><label class="f">Skrócenie końców mm<input type="number" data-gs="inset" step="0.5" value="${G.inset}"></label></div>`;
    el.querySelector('[data-gs=font]').value=G.font||'h:simplex';
    el.querySelectorAll('[data-gs]').forEach(inp=>inp.addEventListener('change',()=>{ snapshot(); const k=inp.dataset.gs; G[k]= (k==='lw'||k==='size'||k==='offset'||k==='gap'||k==='inset')? (+inp.value||0) : inp.value; change(); })); } }
function renderLayers(){ $('layers').innerHTML=LAYERS.map(l=>`<label class="chk" style="margin:2px 0"><input type="checkbox" class="lay" value="${l[0]}" ${DEFAULT_ON.has(l[0])?'checked':''}> <code style="font-size:11px">${l[0]}</code>&nbsp;<span style="font-size:12px;color:var(--ink-2)">${l[1]}</span></label>`).join(''); }
function syncInputs(){ $('bname').value=P.name; $('btag').value=P.tag||''; $('brev').value=P.revision||''; $('pitch').value=P.pitch; $('cabGap').value=P.cabGap||0; const L=P.label;
  $('labH').value=L.h; $('labGap').value=L.gap; $('labPad').value=L.pad; $('symH').value=L.symH; $('nameH').value=L.nameH; $('split').value=L.split; $('symTop').checked=L.symTop; $('frameOn').checked=L.frame; $('divVOn').checked=L.divV; $('divHOn').checked=L.divH; $('lwMain').value=L.lwMain; $('lwDivV').value=L.lwDivV; $('lwDivH').value=L.lwDivH; $('frameR').value=L.frameR; $('showRating').checked=!!L.showRating;
  if(!L.font||L.font==='simplex'||L.font==='duplex') L.font='h:'+(L.font||'simplex'); if(!L.fontSym) L.fontSym=L.font; $('font').value=resolveFont(L.font); $('fontSym').value=resolveFont(L.fontSym); $('segs').value=L.segs; renderFontSamples();
  $('cellH').value=L.cellH||2.2; $('iconScale').value=L.iconScale||0.9; $('fontInfo').value=resolveFont(L.fontInfo||L.font); $('infoOn').checked=!!(P.info&&P.info.on); $('infoH').value=(P.info&&P.info.h)||3; $('qrOn').value=String((P.qr&&P.qr.pos)||0); $('qrSize').value=(P.qr&&P.qr.size)||15; $('holesOn').value=String((P.holes&&P.holes.n)||0); $('holeD').value=(P.holes&&P.holes.d)||5; $('holeOff').value=(P.holes&&P.holes.off)||10;
  renderGrpSettings(); }
function change(){ P.updated=Date.now(); render(); }

/* ===================== Storage (IndexedDB) ===================== */
const IDB={db:null, open(){ return new Promise((res,rej)=>{ if(!window.indexedDB){ res(null); return; } const r=indexedDB.open('eitlab-frontpanel',1); r.onupgradeneeded=()=>{ r.result.createObjectStore('kv'); }; r.onsuccess=()=>{ IDB.db=r.result; res(IDB.db); }; r.onerror=()=>res(null); }); },
  get(k){ return new Promise(res=>{ if(!IDB.db){ try{ res(JSON.parse(localStorage.getItem('fp:'+k)||'null')); }catch(e){ res(null);} return; } const t=IDB.db.transaction('kv','readonly').objectStore('kv').get(k); t.onsuccess=()=>res(t.result==null?null:t.result); t.onerror=()=>res(null); }); },
  set(k,v){ return new Promise(res=>{ if(!IDB.db){ try{ localStorage.setItem('fp:'+k,JSON.stringify(v)); }catch(e){} res(); return; } const t=IDB.db.transaction('kv','readwrite'); t.objectStore('kv').put(v,k); t.oncomplete=()=>res(); t.onerror=()=>res(); }); },
  del(k){ return new Promise(res=>{ if(!IDB.db){ localStorage.removeItem('fp:'+k); res(); return; } const t=IDB.db.transaction('kv','readwrite'); t.objectStore('kv').delete(k); t.oncomplete=()=>res(); t.onerror=()=>res(); }); },
  keys(prefix){ return new Promise(res=>{ if(!IDB.db){ res(Object.keys(localStorage).filter(k=>k.startsWith('fp:'+prefix)).map(k=>k.slice(3))); return; } const t=IDB.db.transaction('kv','readonly').objectStore('kv').getAllKeys(); t.onsuccess=()=>res(t.result.filter(k=>String(k).startsWith(prefix))); t.onerror=()=>res([]); }); } };
let saveTimer=null, dirty=false;
function scheduleSave(){ dirty=true; $('syncDot').style.background='var(--signal)'; clearTimeout(saveTimer); saveTimer=setTimeout(saveNow,600); }
async function saveNow(){ if(!dirty) return; dirty=false; P.orderId=ORDER.id; ORDER.updated=Math.max(ORDER.updated||0, P.updated||0); await IDB.set('board:'+P.id, P); await IDB.set('order:'+ORDER.id, ORDER); await IDB.set('settings', Object.assign(SETTINGS,{current:{orderId:ORDER.id, boardId:P.id}})); $('syncDot').style.background='var(--ok)'; if(SETTINGS.gAuto&&gToken) driveSyncDebounced(); }
async function saveLibrary(){ await IDB.set('devices', DB); await IDB.set('enclosures', ENC); if(SETTINGS.gAuto&&gToken) driveSyncDebounced(); }
async function listOrders(){ const keys=await IDB.keys('order:'); const out=[]; for(const k of keys){ const o=await IDB.get(k); if(o) out.push(o); } return out.sort((a,b)=>(b.updated||0)-(a.updated||0)); }
async function listBoards(orderId){ const keys=await IDB.keys('board:'); const out=[]; for(const k of keys){ const b=await IDB.get(k); if(b&&b.orderId===orderId) out.push(b); } return out.sort((a,b)=>(b.updated||0)-(a.updated||0)); }
async function openBoard(board, order){ await saveNow(); ORDER=order; loadBoard(board); toast(`Otwarto: ${P.name}`); }
function loadBoard(b){ P=migrateBoard(b); selCab=P.cabinets[0]||null; selItem=null; selGrp=null; selDev=null; multi.clear(); history.length=0; future.length=0; ZOOM.key=''; TABLE_SIG=''; syncInputs(); render(); }
function migrateBoard(b){ if(b.rows&&!b.cabinets){ const c=newCab(); c.w=(b.front&&b.front.w)||600; c.h=(b.front&&b.front.h)||800; const L=Object.assign(defaultLabel(),b.label||{}); let y=0;
    for(const r of b.rows){ const top=r.y-L.h-L.gap-20; if(top>y) c.items.push({id:uid(),type:'empty',w:c.w,h:Math.round(top-y)}); const h=Math.round(L.h+L.gap+20+r.nicheH+20); c.items.push({id:uid(),type:'cover',w:c.w,h,row:{mod:r.mod,nicheH:r.nicheH,nicheY:null,pos:'block',devices:r.devices||[]}}); y=Math.max(y,top)+h; }
    b={name:b.name,pitch:b.pitch,label:L,cabinets:[c]}; }
  const nb=newBoard(); nb.cabinets=[]; const B=Object.assign(nb,b); B.format=FORMAT; B.label=Object.assign(defaultLabel(),B.label||{}); B.grpTop=Object.assign(defaultGrp('top'),B.grpTop||{}); B.grpBot=Object.assign(defaultGrp('bot'),B.grpBot||{});
  const L=B.label; if(!L.cellH) L.cellH=2.2; if(L.lineW!=null&&L.lwMain==null){ L.lwMain=L.lineW; L.lwDivV=L.lineW; L.lwDivH=L.lineW; } if(L.div!=null&&L.divV==null){ L.divV=L.div; L.divH=L.div; }
  if(!B.cabinets.length) B.cabinets.push(newCab());
  for(const c of B.cabinets){ if(c.plinth==null) c.plinth=0; if(!c.hinge) c.hinge='left'; if(!c.leaves) c.leaves=1; for(const it of c.items) if(it.type==='cover'){ const r=it.row; if(!r.groups){ const groups=[]; let cur=null; for(const d of (r.devices||[])){ const gn=d.group||''; if(!cur||cur.name!==gn){ cur=newGroup(gn,'left'); groups.push(cur); } cur.devices.push(d); } r.groups=groups; delete r.devices; }
      for(const g of r.groups){ if(g.bot==null) g.bot=''; for(const d of g.devices){ if(!d.table) d.table = d.ncell>1 ? (d.layout==='cols'?'c':'r')+Math.min(4,d.ncell) : 'std'; if(d.rating==null) d.rating=''; } } if(!r.pos) r.pos='block'; } }
  if(B.db){ delete B.db; } return B; }

/* ===================== Google Drive sync ===================== */
let gToken=null, gTokenClient=null, driveTimer=null;
function gMsg(t,cls){ const e=$('gMsg'); e.style.display='block'; e.className='msg '+(cls||''); e.textContent=t; }
function loadGis(){ return new Promise((res,rej)=>{ if(window.google&&google.accounts){ res(); return; } const s=document.createElement('script'); s.src='https://accounts.google.com/gsi/client'; s.onload=()=>res(); s.onerror=()=>rej(new Error('Nie udało się załadować biblioteki Google (brak internetu, plik lokalny lub blokada CSP).')); document.head.appendChild(s); }); }
async function gSignIn(){ const cid=$('gClientId').value.trim(); if(!cid){ gMsg('Wpisz Client ID.','err'); return; } SETTINGS.gClientId=cid; await IDB.set('settings',SETTINGS);
  try{ await loadGis(); }catch(e){ gMsg(e.message,'err'); return; }
  gTokenClient=google.accounts.oauth2.initTokenClient({client_id:cid, scope:'https://www.googleapis.com/auth/drive.appdata', callback:async r=>{ if(r.error){ gMsg('Błąd logowania: '+r.error,'err'); return; } gToken=r.access_token; gMsg('Zalogowano. Synchronizuję…'); await driveSync(); } });
  gTokenClient.requestAccessToken({prompt:''}); }
async function gApi(url, opt){ opt=opt||{}; opt.headers=Object.assign({Authorization:'Bearer '+gToken}, opt.headers||{}); const r=await fetch(url,opt); if(r.status===401){ gToken=null; throw new Error('Sesja wygasła – zaloguj ponownie'); } if(!r.ok) throw new Error('Drive '+r.status+': '+(await r.text()).slice(0,200)); return r; }
async function driveList(){ const r=await gApi('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime,appProperties)&pageSize=1000'); return (await r.json()).files||[]; }
async function driveGet(id){ const r=await gApi(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`); return r.json(); }
async function drivePut(name, obj, existingId, updated){ const meta={name, appProperties:{updated:String(updated||Date.now())}}; if(!existingId) meta.parents=['appDataFolder']; const boundary='eitlab'+uid(); const body=`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(obj)}\r\n--${boundary}--`;
  const url= existingId? `https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=multipart` : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'; await gApi(url,{method:existingId?'PATCH':'POST', headers:{'Content-Type':'multipart/related; boundary='+boundary}, body}); }
function driveSyncDebounced(){ clearTimeout(driveTimer); driveTimer=setTimeout(()=>driveSync(true), 15000); }
async function driveSync(quiet){ if(!gToken){ if(!quiet) gMsg('Najpierw zaloguj.','err'); return; } await saveNow();
  try{ const files=await driveList(); const byName=Object.fromEntries(files.map(x=>[x.name,x])); let up=0, down=0;
    // orders (with boards)
    const orders=await listOrders(); const localNames=new Set();
    for(const o of orders){ const boards=await listBoards(o.id); const upd=Math.max(o.updated||0,...boards.map(b=>b.updated||0)); const name=`order_${o.id}.json`; localNames.add(name); const rf=byName[name]; const rupd=rf? +(rf.appProperties&&rf.appProperties.updated||0) : 0;
      if(!rf||upd>rupd){ await drivePut(name,{format:FORMAT,order:o,boards}, rf&&rf.id, upd); up++; } }
    for(const rf of files){ if(!rf.name.startsWith('order_')) continue; const id=rf.name.slice(6,-5); const local=await IDB.get('order:'+id); const boards= local? await listBoards(id):[]; const upd= local? Math.max(local.updated||0,...boards.map(b=>b.updated||0)) : -1; const rupd=+(rf.appProperties&&rf.appProperties.updated||0);
      if(rupd>upd){ const data=await driveGet(rf.id); if(data&&data.order){ await IDB.set('order:'+data.order.id,data.order); for(const b of (data.boards||[])){ b.orderId=data.order.id; await IDB.set('board:'+b.id,b); } down++; if(data.order.id===ORDER.id){ ORDER=data.order; const cur=(data.boards||[]).find(b=>b.id===P.id); if(cur) loadBoard(cur); } } } }
    // library
    const lib=byName['library.json']; const libLocal=SETTINGS.libUpdated||0; const libRemote=lib? +(lib.appProperties&&lib.appProperties.updated||0):0;
    if(!lib||libLocal>libRemote){ await drivePut('library.json',{format:FORMAT,devices:DB,enclosures:ENC,fonts:USERFONTS,icons:USERICONS,templates:TEMPLATES}, lib&&lib.id, libLocal||Date.now()); }
    else if(libRemote>libLocal){ const d=await driveGet(lib.id); if(d&&d.devices){ DB=d.devices; ENC=d.enclosures||ENC; USERFONTS=d.fonts||USERFONTS; USERICONS=d.icons||USERICONS; TEMPLATES=d.templates||TEMPLATES; await IDB.set('templates',TEMPLATES); renderTplList(); SETTINGS.libUpdated=libRemote; await IDB.set('devices',DB); await IDB.set('enclosures',ENC); await IDB.set('fonts',USERFONTS); await IDB.set('icons',USERICONS); renderPalette(); refreshFontSelects(); } }
    await IDB.set('settings',SETTINGS); gMsg(`Synchronizacja OK: wysłano ${up}, pobrano ${down} zleceń · ${new Date().toLocaleTimeString('pl-PL')}`,'ok'); if(!quiet) toast('Synchronizacja zakończona');
  }catch(e){ gMsg('Błąd synchronizacji: '+e.message,'err'); } }

/* ===================== Files / downloads ===================== */
const DL = (window.claude && typeof claude.use==='function') ? claude.use('downloads').catch(()=>null) : Promise.resolve(null);
async function saveFile(name, data, mime){
  const dl = await DL;
  if (dl){ const fn = /\.(dxf|csv)$/i.test(name) ? name+'.txt' : name;
    try{ await dl.save({filename:fn, data}); if(fn!==name) showDl(`Zapisano jako ${fn} – po pobraniu zmień nazwę na ${name} (ograniczenie podglądu Claude; wersja PWA/offline zapisuje od razu ${name.slice(name.lastIndexOf('.'))}).`); }
    catch(e){ if(e&&e.code!=='declined') showDl('Nie udało się zapisać: '+(e.message||e.code), true); }
    return; }
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([data],{type:mime||'application/octet-stream'})); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);
}
function showDl(t,err){ const e=$('dlMsg'); e.style.display='block'; e.textContent=t; e.className='msg'+(err?' err':''); }
function toast(t){ const e=$('toast'); e.textContent=t; e.classList.add('on'); clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove('on'),2600); }
function readFile(input, cb){ const file=input.files[0]; if(!file) return; const rd=new FileReader(); rd.onload=()=>{ try{ cb(rd.result, file); }catch(err){ toast('Błąd: '+err.message); } input.value=''; }; rd.readAsText(file,'UTF-8'); }

/* ===================== Label table (horizontal) ===================== */
let TABLE_ON=false, TABLE_SIG='', tblRange=null, tblAnchor=null, focusSnap=null;
function tableCols(it){ const cab=findItem(it.id).cab; const g=coverGeometry(cab,it); return {cab,g,cols:g.labels.slice().sort((a,b)=>a.x-b.x)}; }
function tblFieldRows(){ return ['symbol','name','rating']; }
function renderTable(){ const wrap=$('tableWrap'); const it=selItem&&selItem.type==='cover'?selItem:null; $('stage').classList.toggle('tbl',TABLE_ON&&!!it); if(!TABLE_ON||!it){ wrap.style.display='none'; TABLE_SIG=''; return; } wrap.style.display='block';
  const {cab,g,cols}=tableCols(it); const sig=it.id+'|'+cols.map(l=>l.dev.id+':'+(l.dev.table||'std')+':'+(l.dev.blank?1:0)).join(',')+'|'+it.row.groups.map(x=>x.id+':'+x.devices.length).join(',');
  if(sig!==TABLE_SIG){ TABLE_SIG=sig; buildTable(cab,it,cols); }
  updateTableState(cols); }
function buildTable(cab,it,cols){ const wrap=$('tableWrap'); const ci=P.cabinets.indexOf(cab)+1, ii=cab.items.indexOf(it)+1; const used=rowDevices(it.row).reduce((a,d)=>a+d.mod,0); const free=it.row.mod-used;
  const icons=[...ICONS,...USERICONS]; const W=120;
  let h=`<div class="tb"><b>Tabela opisów</b><span style="font-size:12px;color:var(--ink-2)">szafa ${ci} · maskownica ${ii} · ${it.row.mod} mod</span><span style="flex:1"></span>
    <button class="small ghost" data-ta="prev">◀ Poprzednia</button><button class="small ghost" data-ta="next">Następna ▶</button><button class="small ghost" data-ta="csvout">Eksport rzędu</button><button class="small ghost" data-ta="csvin">Import rzędu</button><button class="small ghost" data-ta="csvnames">Importuj tylko opisy</button><button class="small ghost icon" data-ta="close" title="Zamknij">×</button>
    <input type="file" id="rowCsvFile" accept=".csv,.txt,.tsv" style="display:none"></div>
    <div style="overflow:auto"><table><colgroup><col style="width:96px">${cols.map(()=>`<col style="width:${W}px">`).join('')}<col style="width:90px"></colgroup>`;
  h+=`<tr><th class="lab">Poz. · kod</th>${cols.map((l,i)=>`<th class="dev" data-d="${l.dev.id}" title="Zaznacz aparat">${i+1} · ${esc(l.dev.code)}${l.dev.blank?' (zaślepka)':''}${tableCells(l.dev)?' · '+tableCells(l.dev).n+' pola':''}</th>`).join('')}<th style="color:${free<0?'var(--danger)':'var(--ink-2)'}">${free<0?'za dużo o '+(-free):'wolne '+free} mod</th></tr>`;
  const cell=(l,i,f,idx)=>{ const d=l.dev; if(d.blank) return `<td class="blank" data-d="${d.id}">—</td>`; if(f==='symbol'){ if(tableCells(d)) return `<td class="blank" data-d="${d.id}" title="Tabelka wielopolowa – bez symbolu">bez symbolu</td>`; return `<td data-d="${d.id}"><input data-d="${d.id}" data-f="symbol" data-r="0" data-c="${i}" value="${esc(d.symbol)}" placeholder="auto"></td>`; }
    if(f==='name'){ const tc=tableCells(d); if(!tc) return `<td data-d="${d.id}"><input data-d="${d.id}" data-f="name" data-r="1" data-c="${i}" value="${esc(d.name)}" placeholder="nazwa"></td>`; const cells=(d.name||'').split('|'); return `<td data-d="${d.id}"><div class="stack">${Array.from({length:tc.n},(_,k)=>`<input data-d="${d.id}" data-f="cell:${k}" data-r="1" data-c="${i}" data-k="${k}" value="${esc(cells[k]||'')}" placeholder="pole ${k+1}">`).join('')}</div></td>`; }
    if(f==='rating') return `<td data-d="${d.id}"><input data-d="${d.id}" data-f="rating" data-r="2" data-c="${i}" value="${esc(d.rating||'')}" placeholder="model" list="ratings"></td>`;
    if(f==='icon') return `<td data-d="${d.id}"><select data-d="${d.id}" data-f="icon"><option value="">– ikona –</option>${icons.map(x=>`<option value="${x.id}" ${d.icon===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></td>`; };
  h+=`<tr><th class="lab">Symbol</th>${cols.map((l,i)=>cell(l,i,'symbol')).join('')}<td rowspan="5" style="background:var(--panel)"></td></tr>`;
  h+=`<tr><th class="lab">Nazwa / pola</th>${cols.map((l,i)=>cell(l,i,'name')).join('')}</tr>`;
  h+=`<tr><th class="lab">Model</th>${cols.map((l,i)=>cell(l,i,'rating')).join('')}</tr>`;
  // group row: consecutive columns of same group merged
  let gcells=''; let i=0; while(i<cols.length){ const gr=cols[i].grp; let j=i; while(j+1<cols.length&&cols[j+1].grp===gr) j++; gcells+=`<td colspan="${j-i+1}" data-g="${gr.id}"><div class="pair"><input data-g="${gr.id}" data-f="gname" value="${esc(gr.name)}" placeholder="podpis górny"><input data-g="${gr.id}" data-f="gbot" value="${esc(gr.bot||'')}" placeholder="podpis dolny"></div></td>`; i=j+1; }
  h+=`<tr><th class="lab">Grupa</th>${gcells}</tr>`;
  h+=`<tr><th class="lab">Ikona</th>${cols.map((l,i)=>cell(l,i,'icon')).join('')}</tr>`;
  h+=`</table></div><div style="padding:4px 8px;font-size:11px;color:var(--ink-2)">Tab / Enter – następny aparat, ↓ ↑ – wiersz niżej/wyżej, Ctrl+V – wklej blok z arkusza (w prawo), Shift+klik – zaznacz zakres, Ctrl+C – kopiuj zakres</div>`;
  wrap.innerHTML=h; }
function updateTableState(cols){ const wrap=$('tableWrap'); wrap.querySelectorAll('th.dev').forEach(th=>th.classList.toggle('sel', !!(selDev&&th.dataset.d===selDev.id)));
  wrap.querySelectorAll('td[data-d]').forEach(td=>td.classList.toggle('sel', !!(selDev&&td.dataset.d===selDev.id)));
  wrap.querySelectorAll('input[data-f]').forEach(inp=>{ const d=inp.dataset.d, f=inp.dataset.f; let tag=null; if(f==='symbol') tag='symbol:'+d; else if(f==='name') tag='name:'+d; else if(f.startsWith('cell:')) tag='cell:'+d+':'+inp.dataset.k; else if(f==='gname') tag='grp:name:'+inp.dataset.g; else if(f==='gbot') tag='grp:bot:'+inp.dataset.g;
    const x=tag&&FITMAP.get(tag); if(x){ inp.classList.add('bad'); inp.title=`Nie mieści się: zmniejszony do ${Math.round(x.k*100)}% (${(x.capH*x.k).toFixed(1)} mm)`; } else { inp.classList.remove('bad'); inp.title=''; } }); }
function tblApply(inp, val, silent){ const f=inp.dataset.f; if(inp.dataset.g){ const fg=findGrp(inp.dataset.g); if(!fg) return; if(f==='gname') fg.grp.name=val; else fg.grp.bot=val; }
  else { const fd=findDev(inp.dataset.d); if(!fd) return; const d=fd.dev; if(f==='symbol'){ if(val.trim()===''){ d.auto=true; } else { d.symbol=val.trim(); d.auto=false; } } else if(f==='name') d.name=val; else if(f==='rating') d.rating=val.trim(); else if(f==='icon'){ d.icon=val; if(val&&!d.iconPos) d.iconPos='left'; } else if(f.startsWith('cell:')){ const tc=tableCells(d); const n=tc?tc.n:1; const cells=(d.name||'').split('|'); while(cells.length<n) cells.push(''); cells.length=n; cells[+inp.dataset.k]=val; d.name=cells.join('|'); } }
  P.updated=Date.now(); if(!silent){ renderCanvas(); const it=selItem; if(it){ const {cols}=tableCols(it); updateTableState(cols); } } }
function tblInputAt(r,c){ return $('tableWrap').querySelector(`input[data-r="${r}"][data-c="${c}"]`); }
$('tableWrap').addEventListener('focusin',e=>{ const inp=e.target; if(!inp.matches('input,select')) return; focusSnap=JSON.stringify(P); if(inp.dataset.d&&!(inp.dataset.f||'').startsWith('g')){ const fd=findDev(inp.dataset.d); if(fd&&selDev!==fd.dev){ selDev=fd.dev; selGrp=fd.grp; multi.clear(); renderCanvas(); updateTableState(tableCols(selItem).cols); renderEditor(); } } if(inp.matches('input')&&!tblRange) tblAnchor=inp; });
$('tableWrap').addEventListener('input',e=>{ const inp=e.target; if(!inp.matches('input[data-f]')) return; tblApply(inp, inp.value); });
$('tableWrap').addEventListener('change',e=>{ const inp=e.target; if(!inp.matches('input[data-f],select[data-f]')) return; if(inp.matches('select')) tblApply(inp, inp.value); if(focusSnap&&focusSnap!==JSON.stringify(P)){ history.push(focusSnap); future.length=0; focusSnap=JSON.stringify(P); } if(inp.dataset.f==='symbol'){ renderCanvas(); inp.value=findDev(inp.dataset.d).dev.symbol; } renderEditor(); renderGroups(); });
$('tableWrap').addEventListener('click',e=>{ const b=e.target.closest('button[data-ta]'); if(b){ tblAction(b.dataset.ta); return; } const th=e.target.closest('th.dev'); if(th){ const fd=findDev(th.dataset.d); if(fd){ selDev=fd.dev; selGrp=fd.grp; multi.clear(); renderCanvas(); updateTableState(tableCols(selItem).cols); renderEditor(); } return; }
  const inp=e.target.closest('input[data-r]'); if(inp&&e.shiftKey&&tblAnchor&&tblAnchor.dataset.r!=null){ e.preventDefault(); const r1=Math.min(+tblAnchor.dataset.r,+inp.dataset.r), r2=Math.max(+tblAnchor.dataset.r,+inp.dataset.r), c1=Math.min(+tblAnchor.dataset.c,+inp.dataset.c), c2=Math.max(+tblAnchor.dataset.c,+inp.dataset.c); tblRange={r1,r2,c1,c2}; $('tableWrap').querySelectorAll('input.rng').forEach(x=>x.classList.remove('rng')); $('tableWrap').querySelectorAll('input[data-r]').forEach(x=>{ const r=+x.dataset.r,c=+x.dataset.c; if(r>=r1&&r<=r2&&c>=c1&&c<=c2) x.classList.add('rng'); }); }
  else if(inp){ tblRange=null; $('tableWrap').querySelectorAll('input.rng').forEach(x=>x.classList.remove('rng')); tblAnchor=inp; } });
$('tableWrap').addEventListener('keydown',e=>{ const inp=e.target; if(!inp.matches('input[data-r]')) return; const r=+inp.dataset.r, c=+inp.dataset.c;
  if(e.key==='Enter'){ e.preventDefault(); let n=null, cc=c; while(!n&&cc<200){ cc++; n=tblInputAt(r,cc); } if(n){ n.focus(); n.select(); } }
  else if(e.key==='ArrowDown'||e.key==='ArrowUp'){ const dr=e.key==='ArrowDown'?1:-1; let n=null; if(inp.dataset.k!=null){ const sib=inp.parentElement.querySelectorAll('input'); const k=+inp.dataset.k; if(sib[k+dr]) n=sib[k+dr]; } if(!n){ let rr=r; while(!n&&rr+dr>=0&&rr+dr<=2){ rr+=dr; n=tblInputAt(rr,c); } } if(n){ e.preventDefault(); n.focus(); n.select(); } }
  else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='c'&&tblRange){ e.preventDefault(); const rows=[]; for(let rr=tblRange.r1;rr<=tblRange.r2;rr++){ const cells=[]; for(let cc=tblRange.c1;cc<=tblRange.c2;cc++){ const x=tblInputAt(rr,cc); const td=x&&x.closest('td'); cells.push(td? [...td.querySelectorAll('input')].map(y=>y.value).join('|') : ''); } rows.push(cells.join('\t')); } navigator.clipboard.writeText(rows.join('\n')).then(()=>toast('Skopiowano '+rows.length+' × '+(tblRange.c2-tblRange.c1+1)+' komórek')); } });
$('tableWrap').addEventListener('paste',e=>{ const inp=e.target; if(!inp.matches('input[data-r]')) return; const txt=(e.clipboardData||window.clipboardData).getData('text'); if(!txt||(!txt.includes('\t')&&!txt.includes('\n'))) return; e.preventDefault();
  let lines=txt.replace(/\r/g,'').split('\n'); if(lines.length&&lines[lines.length-1]==='') lines.pop(); let grid=lines.map(l=>l.split('\t')); if(grid.every(g=>g.length===1)) grid=[grid.map(g=>g[0])];
  snapshot(); const r0=+inp.dataset.r, c0=+inp.dataset.c; let n=0;
  grid.forEach((row,i)=>{ const rr=r0+i; if(rr>2) return; row.forEach((val,j)=>{ const cc=c0+j; const x=tblInputAt(rr,cc); if(!x) return; const td=x.closest('td'); const ins=[...td.querySelectorAll('input')]; if(ins.length>1&&val.includes('|')){ val.split('|').forEach((v,k)=>{ if(ins[k]){ ins[k].value=v.trim(); tblApply(ins[k],v.trim(),true); } }); } else { x.value=val.trim(); tblApply(x,val.trim(),true); } n++; }); });
  renderCanvas(); updateTableState(tableCols(selItem).cols); renderEditor(); renderGroups(); toast(`Wklejono ${n} komórek`); });
function tblAction(a){ const it=selItem; const cab=findItem(it.id).cab;
  if(a==='close'){ TABLE_ON=false; renderTable(); return; }
  if(a==='prev'||a==='next'){ const list=coverItems(); const i=list.findIndex(x=>x.item===it); const t=list[i+(a==='next'?1:-1)]; if(!t){ toast('Brak kolejnej maskownicy'); return; } selItem=t.item; selCab=t.cab; selDev=null; selGrp=null; ZOOM.key=''; render(); return; }
  if(a==='csvout'){ saveFile(`${fname(P.tag||P.name)}_szafa${P.cabinets.indexOf(cab)+1}_maskownica${cab.items.indexOf(it)+1}.csv`, '\uFEFF'+exportCsv(it)); return; }
  if(a==='csvin'||a==='csvnames'){ const f=$('rowCsvFile'); f.onchange=()=>readFile(f,txt=>{ const parsed=parseCsv(txt); const src=parsed.cabinets.flatMap(c=>c.items).find(x=>x.type==='cover'); if(!src) throw new Error('w pliku nie ma wiersza MASKOWNICA');
      snapshot(); if(a==='csvin'){ const mode=confirm('OK = zastąp zawartość maskownicy, Anuluj = dopisz grupy'); const groups=src.row.groups.map(g=>{ g.devices=g.devices.map(d=>csvDevToDev(d)); return g; }); if(mode) it.row.groups=groups; else it.row.groups.push(...groups); }
      else { const incoming=src.row.groups.flatMap(g=>g.devices).filter(d=>{ const b=DB.find(x=>norm(x.code)===norm(d.code)); return !(b&&b.blank); }); const targets=tableCols(it).cols.map(l=>l.dev).filter(d=>!d.blank); let n=0; targets.forEach((d,i)=>{ const s=incoming[i]; if(!s) return; if(s.name) d.name=s.name; if(s.rating) d.rating=s.rating; if(s.symbol){ d.symbol=s.symbol; d.auto=false; } if(s.icon&&iconById(s.icon)){ d.icon=s.icon; d.iconPos=s.iconPos||'left'; } n++; }); toast(`Nadpisano opisy ${n} aparatów`); }
      selDev=null; selGrp=null; TABLE_SIG=''; render(); }); f.click(); } }
function csvDevToDev(d){ let b=DB.find(x=>norm(x.code)===norm(d.code)); if(!b){ b={code:d.code,name:'',mod:d.modCsv||1,prefix:'F',table:d.tableCsv||'std',rating:''}; DB.push(b); saveLibrary(); } return {id:uid(),code:b.code,name:b.blank?'':d.name,mod:d.modCsv||b.mod,prefix:b.prefix,blank:!!b.blank,auto:d.auto,symbol:d.symbol,table:d.tableCsv||b.table||'std',rating:d.rating||b.rating||'',symH:d.symH,nameH:d.nameH,icon:d.icon&&iconById(d.icon)?d.icon:'',iconPos:d.iconPos||'left'}; }
$('btnTable').onclick=()=>{ if(!selItem||selItem.type!=='cover'){ const ci=coverItems()[0]; if(!ci){ toast('Dodaj maskownicę z wycięciem'); return; } selItem=ci.item; selCab=ci.cab; } TABLE_ON=!TABLE_ON; if(TABLE_ON&&VIEW!=='item'){ VIEW='item'; document.querySelectorAll('#view button').forEach(x=>x.classList.toggle('on',x.dataset.v===VIEW)); ZOOM.key=''; } render(); };

/* ===================== Templates (wzorce) ===================== */
let TEMPLATES=[];
async function saveTemplates(){ await IDB.set('templates',TEMPLATES); SETTINGS.libUpdated=Date.now(); await IDB.set('settings',SETTINGS); if(SETTINGS.gAuto&&gToken) driveSyncDebounced(); }
function tplMod(t){ return t.kind==='group'? groupMod(t.data) : rowDevices(t.data.row).reduce((a,d)=>a+d.mod,0); }
function renderTplList(){ const el=$('tplList'); if(!el) return; el.innerHTML=TEMPLATES.map(t=>`<div class="it" style="cursor:default"><span class="grow"><b>${esc(t.name)}</b> <span class="tag">${t.kind==='group'?'grupa':'maskownica'}</span> · ${tplMod(t)} mod${t.kind==='group'?' · '+t.data.devices.length+' ap.':''}</span>${t.kind==='group'?`<button class="small" data-tpl="${t.id}" data-al="left" title="Wstaw do lewej">⇤</button><button class="small" data-tpl="${t.id}" data-al="right" title="Wstaw do prawej">⇥</button>`:`<button class="small" data-tpl="${t.id}" data-al="cover">Wstaw</button>`}</div>`).join('')||'<div class="it" style="cursor:default;color:var(--ink-2)">Brak wzorców</div>'; }
$('tplList').addEventListener('click',e=>{ const b=e.target.closest('button[data-tpl]'); if(!b) return; const t=TEMPLATES.find(x=>x.id===b.dataset.tpl); if(!t) return; snapshot();
  if(t.kind==='group'){ const it=selItem&&selItem.type==='cover'?selItem:null; if(!it){ toast('Zaznacz maskownicę z wycięciem'); history.pop(); return; } const g=reidKeep(JSON.parse(JSON.stringify(t.data)),t.keepSymbols); g.align=b.dataset.al; if(g.align==='left'){ const li=it.row.groups.filter(x=>x.align==='left').length; it.row.groups.splice(li,0,g); } else it.row.groups.push(g); selGrp=g; selDev=null; toast(`Wstawiono grupę „${t.name}”`); }
  else { if(!selCab){ toast('Zaznacz szafę'); history.pop(); return; } const it=reidKeep(JSON.parse(JSON.stringify(t.data)),t.keepSymbols); it.type='cover'; const i=selItem? selCab.items.indexOf(selItem)+1 : selCab.items.length; selCab.items.splice(i,0,it); selItem=it; selGrp=null; selDev=null; toast(`Wstawiono maskownicę „${t.name}”`); }
  TABLE_SIG=''; change(); });
function reidKeep(obj, keep){ if(Array.isArray(obj)) obj.forEach(o=>reidKeep(o,keep)); else if(obj&&typeof obj==='object'){ if(obj.id) obj.id=uid(); if(!keep&&obj.auto!==false&&obj.symbol!=null&&obj.code) obj.symbol=''; for(const k in obj) reidKeep(obj[k],keep); } return obj; }
function saveGroupTemplate(g){ const name=prompt('Nazwa wzorca grupy', g.name||''); if(!name) return; const keep=confirm('Zachować symbole na stałe (OK), czy numerować na nowo po wstawieniu (Anuluj)?'); TEMPLATES.push({id:uid(),name:name.trim(),kind:'group',keepSymbols:keep,data:JSON.parse(JSON.stringify(g)),created:Date.now()}); saveTemplates(); renderTplList(); toast('Zapisano wzorzec'); }
function saveCoverTemplate(it){ const name=prompt('Nazwa wzorca maskownicy',''); if(!name) return; const keep=confirm('Zachować symbole na stałe (OK), czy numerować na nowo po wstawieniu (Anuluj)?'); TEMPLATES.push({id:uid(),name:name.trim(),kind:'cover',keepSymbols:keep,data:JSON.parse(JSON.stringify({type:'cover',w:it.w,h:it.h,row:it.row})),created:Date.now()}); saveTemplates(); renderTplList(); toast('Zapisano wzorzec'); }
function renderTpl(){ $('tplt').innerHTML=`<tr><th>Nazwa</th><th>Rodzaj</th><th>Zawartość</th><th>Symbole</th><th></th></tr>`+TEMPLATES.map((t,i)=>{ const devs=t.kind==='group'?t.data.devices:rowDevices(t.data.row); return `<tr data-i="${i}"><td><input data-k="name" value="${esc(t.name)}"></td><td style="font-size:12px">${t.kind==='group'?'grupa':'maskownica'}</td><td style="font-size:11px;color:var(--ink-2)">${devs.filter(d=>!d.blank).map(d=>esc(d.code+(d.rating?' '+d.rating:''))).join(', ')} (${tplMod(t)} mod)</td><td><label class="chk" style="margin:0"><input type="checkbox" data-k="keepSymbols" ${t.keepSymbols?'checked':''}> stałe</label></td><td><button class="small ghost icon" data-del="${i}">×</button></td></tr>`; }).join('')||'<tr><td colspan="5" style="color:var(--ink-2)">Brak wzorców – zapisz grupę lub maskownicę przyciskiem „Zapisz jako wzorzec”.</td></tr>'; }
$('tplt').addEventListener('change',e=>{ const tr=e.target.closest('tr'); const k=e.target.dataset.k; if(!tr||!k) return; const t=TEMPLATES[+tr.dataset.i]; t[k]= k==='keepSymbols'? e.target.checked : e.target.value.trim(); saveTemplates(); renderTplList(); });
$('tplt').addEventListener('click',e=>{ const b=e.target.closest('button[data-del]'); if(!b) return; if(!confirm('Usunąć wzorzec „'+TEMPLATES[+b.dataset.del].name+'”?')) return; TEMPLATES.splice(+b.dataset.del,1); saveTemplates(); renderTpl(); renderTplList(); });
$('btnTplOut').onclick=()=>saveFile('wzorce.json', JSON.stringify({format:FORMAT,kind:'templates',templates:TEMPLATES},null,1)); $('btnTplIn').onclick=()=>$('tplFile').click();
$('tplFile').addEventListener('change',e=>readFile(e.target,txt=>{ const p=JSON.parse(txt); if(!p.templates) throw new Error('brak wzorców w pliku'); let n=0; for(const t of p.templates){ if(!TEMPLATES.find(x=>x.id===t.id)){ TEMPLATES.push(t); n++; } } saveTemplates(); renderTpl(); renderTplList(); toast('Dodano wzorce: '+n); }));

/* ===================== Interaction ===================== */
document.querySelectorAll('.tabs button[data-t]').forEach(b=>b.onclick=()=>{ document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===b)); document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.id==='tab-'+b.dataset.t)); $('side').classList.remove('collapsed'); });
$('btnDrawer').onclick=()=>{ $('side').classList.toggle('collapsed'); $('btnDrawer').textContent=$('side').classList.contains('collapsed')?'▴':'▾'; };
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).classList.remove('on'));
const bind=(id,fn)=>$(id).addEventListener('change',e=>{snapshot(); fn(e.target); change();});
bind('bname',t=>P.name=t.value.trim()||'Rozdzielnica'); bind('btag',t=>P.tag=t.value.trim()); bind('brev',t=>P.revision=t.value.trim());
bind('pitch',t=>P.pitch=+t.value||17.5); bind('cabGap',t=>P.cabGap=Math.max(0,+t.value||0));
bind('labH',t=>P.label.h=+t.value); bind('labGap',t=>P.label.gap=+t.value); bind('labPad',t=>P.label.pad=+t.value); bind('symH',t=>P.label.symH=+t.value); bind('nameH',t=>P.label.nameH=+t.value); bind('split',t=>P.label.split=+t.value);
bind('cellH',t=>P.label.cellH=+t.value||2.2); bind('iconScale',t=>P.label.iconScale=+t.value||0.9); bind('fontInfo',t=>P.label.fontInfo=t.value); bind('symTop',t=>P.label.symTop=t.checked); bind('frameOn',t=>P.label.frame=t.checked); bind('divVOn',t=>P.label.divV=t.checked); bind('divHOn',t=>P.label.divH=t.checked); bind('showRating',t=>P.label.showRating=t.checked);
bind('lwMain',t=>P.label.lwMain=Math.max(0,+t.value||0)); bind('lwDivV',t=>P.label.lwDivV=Math.max(0,+t.value||0)); bind('lwDivH',t=>P.label.lwDivH=Math.max(0,+t.value||0)); bind('frameR',t=>P.label.frameR=Math.max(0,+t.value||0));
bind('font',t=>{P.label.font=t.value; $('fontMsg').style.display='none'; if(t.value==='ttf'&&!ttfFont) showFontMsg('Wgraj plik czcionki TTF/OTF.',false);}); bind('fontSym',t=>{P.label.fontSym=t.value;}); bind('segs',t=>P.label.segs=+t.value);
bind('infoOn',t=>{P.info=P.info||{}; P.info.on=t.checked;}); bind('infoH',t=>{P.info=P.info||{}; P.info.h=+t.value||3;}); bind('qrOn',t=>{P.qr=P.qr||{}; P.qr.pos=+t.value;}); bind('qrSize',t=>{P.qr=P.qr||{}; P.qr.size=+t.value||15;});
bind('holesOn',t=>{P.holes=P.holes||{}; P.holes.n=+t.value;}); bind('holeD',t=>{P.holes=P.holes||{}; P.holes.d=+t.value||5;}); bind('holeOff',t=>{P.holes=P.holes||{}; P.holes.off=+t.value||10;});
function showFontMsg(t,err){ const e=$('fontMsg'); e.style.display='block'; e.textContent=t; e.className='msg'+(err?' err':''); }
$('ttfFile').addEventListener('change',e=>{ const file=e.target.files[0]; if(!file) return; const rd=new FileReader(); rd.onload=()=>{ try{ ttfFont=opentype.parse(rd.result); showFontMsg(`Czcionka: ${(ttfFont.names.fullName&&ttfFont.names.fullName.en)||file.name} – wybierz „Własny plik” w liście czcionek.`,false); change(); }catch(err){ ttfFont=null; showFontMsg('Nie udało się odczytać czcionki: '+err.message,true);} }; rd.readAsArrayBuffer(file); });
// cabinets
$('btnAddCab').onclick=()=>{ snapshot(); const c=newCab(); const last=P.cabinets[P.cabinets.length-1]; if(last){ c.w=last.w; c.h=last.h; c.plinth=last.plinth; } P.cabinets.push(c); selCab=c; selItem=null; selGrp=null; selDev=null; change(); };
$('btnAddCabLib').onclick=()=>{ if(!ENC.length){ toast('Biblioteka obudów jest pusta'); return; } const names=ENC.map((e,i)=>`${i+1}. ${e.name}`).join('\n'); const n=parseInt(prompt('Wybierz obudowę (numer):\n'+names,'1'),10); const e=ENC[n-1]; if(!e) return; snapshot(); const c=newCab(); c.w=e.w; c.h=e.h; c.plinth=e.plinth||0; const cw=+(String(e.coverW).split(',')[0])||c.w; const ch=+(String(e.coverH).split(',')[0])||150; c.items.push({id:uid(),type:'empty',w:c.w,h:Math.round(c.h*0.12)}); const it=newItem('cover',c); it.w=cw; it.h=ch; c.items.push(it); c.items.push({id:uid(),type:'blank',w:cw,h:ch}); P.cabinets.push(c); selCab=c; selItem=it; selGrp=null; selDev=null; change(); };
$('cabs').addEventListener('click',e=>{ const it=e.target.closest('.it'); if(!it) return; const c=P.cabinets.find(x=>x.id===it.dataset.cab); if(!c) return; const b=e.target.closest('button'); const i=P.cabinets.indexOf(c);
  if(!b){ selCab=c; selItem=null; selGrp=null; selDev=null; change(); return; } snapshot();
  if(b.dataset.act==='del'){ if(c.items.length&&!confirm('Usunąć szafę razem z elementami?')){history.pop();return;} P.cabinets.splice(i,1); if(selCab===c){ selCab=P.cabinets[0]||null; selItem=null; selGrp=null; selDev=null; } }
  if(b.dataset.act==='left'&&i>0) P.cabinets.splice(i-1,0,P.cabinets.splice(i,1)[0]);
  if(b.dataset.act==='right'&&i<P.cabinets.length-1) P.cabinets.splice(i+1,0,P.cabinets.splice(i,1)[0]);
  if(b.dataset.act==='dup'){ const n=reid(JSON.parse(JSON.stringify(c))); P.cabinets.splice(i+1,0,n); selCab=n; selItem=null; selGrp=null; selDev=null; }
  change(); });
function reid(obj){ if(Array.isArray(obj)) obj.forEach(reid); else if(obj&&typeof obj==='object'){ if(obj.id) obj.id=uid(); if(obj.auto!==false&&obj.symbol!=null&&obj.code) obj.symbol=''; for(const k in obj) reid(obj[k]); } return obj; }
$('cabEdit').addEventListener('change',e=>{ const k=e.target.dataset.cf; if(!k||!selCab) return; snapshot(); if(k==='door') selCab.door=e.target.checked; else if(k==='hinge') selCab.hinge=e.target.value; else if(k==='leaves') selCab.leaves=+e.target.value; else if(k==='plinth') selCab.plinth=Math.max(0,+e.target.value||0); else selCab[k]=Math.max(10,+e.target.value||10); change(); });
// items
document.querySelectorAll('button[data-add]').forEach(b=>b.onclick=()=>{ if(!selCab){ toast('Najpierw zaznacz szafę'); return; } snapshot(); const it=newItem(b.dataset.add, selCab); selCab.items.push(it); selItem=it; selGrp=null; selDev=null; change(); });
$('items').addEventListener('click',e=>{ const el=e.target.closest('.it'); if(!el||!el.dataset.item) return; const it=selCab.items.find(x=>x.id===el.dataset.item); if(!it) return; const b=e.target.closest('button'); const i=selCab.items.indexOf(it);
  if(!b){ selItem=it; selGrp=null; selDev=null; change(); return; } snapshot();
  if(b.dataset.act==='del'){ if(it.type==='cover'&&rowDevices(it.row).length&&!confirm('Usunąć maskownicę razem z aparatami?')){history.pop();return;} selCab.items.splice(i,1); if(selItem===it){ selItem=null; selGrp=null; selDev=null; } }
  if(b.dataset.act==='up'&&i>0) selCab.items.splice(i-1,0,selCab.items.splice(i,1)[0]);
  if(b.dataset.act==='down'&&i<selCab.items.length-1) selCab.items.splice(i+1,0,selCab.items.splice(i,1)[0]);
  change(); });
$('itemEdit').addEventListener('change',e=>{ const k=e.target.dataset.if; if(!k||!selItem) return; snapshot(); const it=selItem;
  if(k==='type'){ const t=e.target.value; if(t==='cover'&&!it.row) it.row=newRow(); if(it.type==='cover'&&t!=='cover'&&rowDevices(it.row).length&&!confirm('Zmiana typu usunie aparaty z tej maskownicy. Kontynuować?')){history.pop(); renderItems(); return;} if(t!=='cover') delete it.row; it.type=t; }
  else if(k==='w'||k==='h') it[k]=Math.max(10,+e.target.value||10);
  else if(k==='nicheY') it.row.nicheY= e.target.value===''?null:+e.target.value;
  else if(k==='pos') it.row.pos=e.target.value;
  else it.row[k]=Math.max(1,+e.target.value||1);
  change(); });
// clipboard (item / device)
async function copySel(){ if(selDev&&!multi.size){ await IDB.set('clip',{kind:'dev',data:selDev}); toast('Skopiowano aparat'); } else if(multi.size){ const list=[...multi].map(id=>findDev(id)).filter(Boolean).map(f=>f.dev); await IDB.set('clip',{kind:'devs',data:list}); toast(`Skopiowano ${list.length} aparatów`); } else if(selItem){ await IDB.set('clip',{kind:'item',data:selItem}); toast('Skopiowano element: '+ITEM_NAMES[selItem.type]); } }
async function pasteSel(){ const c=await IDB.get('clip'); if(!c){ toast('Schowek pusty'); return; } snapshot();
  if(c.kind==='item'){ if(!selCab){ toast('Zaznacz szafę'); return; } const it=reid(JSON.parse(JSON.stringify(c.data))); const i=selItem? selCab.items.indexOf(selItem)+1 : selCab.items.length; selCab.items.splice(i,0,it); selItem=it; selGrp=null; selDev=null; }
  else { const it=selItem&&selItem.type==='cover'?selItem:null; if(!it){ toast('Zaznacz maskownicę'); return; } let g=selGrp&&it.row.groups.includes(selGrp)?selGrp:it.row.groups[it.row.groups.length-1]; if(!g){ g=newGroup('','left'); it.row.groups.push(g); } const list=c.kind==='dev'?[c.data]:c.data; for(const d of list){ const n=reid(JSON.parse(JSON.stringify(d))); g.devices.push(n); selDev=n; } selGrp=g; }
  change(); }
$('btnCopyItem').onclick=copySel; $('btnPasteItem').onclick=pasteSel;
// groups
document.querySelectorAll('button[data-addgrp]').forEach(b=>b.onclick=()=>addGroup(b.dataset.addgrp));
$('groups').addEventListener('click',e=>{ const el=e.target.closest('.it'); if(!el||!el.dataset.grp) return; const it=selItem; const g=it.row.groups.find(x=>x.id===el.dataset.grp); if(!g) return; const b=e.target.closest('button'); const i=it.row.groups.indexOf(g);
  if(!b){ selGrp=g; selDev=null; change(); return; } snapshot();
  if(b.dataset.act==='del'){ if(g.devices.length&&!confirm('Usunąć grupę razem z aparatami?')){history.pop();return;} it.row.groups.splice(i,1); if(selGrp===g){ selGrp=null; selDev=null; } }
  if(b.dataset.act==='up'&&i>0) it.row.groups.splice(i-1,0,it.row.groups.splice(i,1)[0]);
  if(b.dataset.act==='down'&&i<it.row.groups.length-1) it.row.groups.splice(i+1,0,it.row.groups.splice(i,1)[0]);
  change(); });
$('grpEdit').addEventListener('change',e=>{ const k=e.target.dataset.gf; if(!k||!selGrp) return; snapshot(); if(k==='x') selGrp.x=Math.max(0,Math.round(+e.target.value||0)); else if(k==='align'){ if(e.target.value==='free') selGrp.x=groupX(selItem.row).get(selGrp.id); selGrp.align=e.target.value; } else selGrp[k]=e.target.value; change(); });
$('grpEdit').addEventListener('click',e=>{ const b=e.target.closest('button[data-gact]'); if(!b||!selGrp) return; snapshot(); const gs=selItem.row.groups; const i=gs.indexOf(selGrp);
  if(b.dataset.gact==='toLeft'){ selGrp.align='left'; gs.splice(i,1); gs.unshift(selGrp); }
  if(b.dataset.gact==='toRight'){ selGrp.align='right'; gs.splice(i,1); gs.push(selGrp); }
  if(b.dataset.gact==='dup'){ const n=reid(JSON.parse(JSON.stringify(selGrp))); gs.splice(i+1,0,n); selGrp=n; selDev=null; }
  if(b.dataset.gact==='tpl'){ history.pop(); saveGroupTemplate(selGrp); return; }
  change(); });
// palette
$('pal').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; addDevice(DB[+b.dataset.db]); });
// multi
$('multi').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const list=[...multi].map(id=>findDev(id)).filter(Boolean);
  if(b.id==='mClear'){ multi.clear(); selDev=null; change(); return; } snapshot();
  if(b.id==='mDel'){ for(const fd of list) fd.grp.devices.splice(fd.grp.devices.indexOf(fd.dev),1); multi.clear(); selDev=null; }
  if(b.id==='mApply'){ const r=$('mRating').value.trim(), t=$('mTable').value; for(const fd of list){ if(r) fd.dev.rating=r; if(t) fd.dev.table=t; } }
  change(); });
// device editor
function renderEditor(){
  const e=$('editor'); const fd=selDev&&findDev(selDev.id); if(!fd){ e.classList.remove('on'); e.innerHTML=''; return; }
  const d=fd.dev; e.classList.add('on'); const tc=tableCells(d); const cells=(d.name||'').split('|');
  const opt=Object.entries(TABLES).map(([k,n])=>`<option value="${k}" ${(d.table||'std')===k?'selected':''}>${n}</option>`).join('');
  const gopt=fd.row.groups.map((g,i)=>`<option value="${g.id}" ${g===fd.grp?'selected':''}>${i+1}. ${esc(g.name||'(bez nazwy)')}</option>`).join('');
  let h=`<div class="row four"><label class="f">Symbol${tc?' (wył. w tabelce)':''}<input data-df="symbol" value="${esc(d.symbol)}" ${d.blank||tc?'disabled':''}></label><label class="f">Model / prąd (np. C32)<input data-df="rating" value="${esc(d.rating||'')}" ${d.blank?'disabled':''} list="ratings"></label><label class="f">Grupa<select data-df="grp">${gopt}</select></label><label class="f">Moduły<input data-df="mod" type="number" step="0.5" value="${d.mod}"></label></div>`;
  if(!d.blank){ const n=tc?tc.n:1; h+=`<div class="row" style="grid-template-columns:${tc?'':'2fr '}repeat(${n},1fr)">`; if(!tc) h+=`<label class="f">Nazwa (/ = nowa linia)<input data-cell="0" value="${esc(cells[0]||'')}"></label>`; else for(let k=0;k<n;k++) h+=`<label class="f">Pole ${k+1}<input data-cell="${k}" value="${esc(cells[k]||'')}"></label>`; h+=`<label class="f">Tabelka<select data-df="table">${opt}</select></label></div>`; }
  if(!d.blank){ const allIcons=[...ICONS,...USERICONS]; const posOpts=[['left','po lewej od nazwy'],['right','po prawej od nazwy'],['replace','zamiast nazwy']].concat(tc? Array.from({length:tc.n},(_,k)=>['cell'+(k+1),'w polu '+(k+1)]):[]);
    h+=`<div class="row four" style="grid-template-columns:auto 1.4fr 1.2fr .8fr;align-items:end"><span id="icPrev" style="color:var(--ink);height:34px">${d.icon?iconSvgPreview(d.icon,34):''}</span><label class="f">Symbol graficzny<select data-df="icon"><option value="">– brak –</option>${allIcons.map(i=>`<option value="${i.id}" ${d.icon===i.id?'selected':''}>${esc(i.name)}</option>`).join('')}</select></label><label class="f">Położenie<select data-df="iconPos">${posOpts.map(([v,n])=>`<option value="${v}" ${(d.iconPos||'left')===v?'selected':''}>${n}</option>`).join('')}</select></label><label class="f">Skala<input data-df="iconScale" type="number" step="0.1" min="0.3" max="1.5" value="${d.iconScale||''}" placeholder="${P.label.iconScale||0.9}"></label></div>`; }
  h+=`<div class="btns"><span style="font-size:12px;color:var(--ink-2);align-self:center">${esc(d.code)} · szafa ${P.cabinets.indexOf(fd.cab)+1} / el. ${fd.cab.items.indexOf(fd.item)+1}</span>
    <label class="chk" style="margin:0"><input type="checkbox" id="autoSym" ${d.auto!==false?'checked':''} ${d.blank||tc?'disabled':''}> numeracja auto</label>
    <label class="f" style="flex-direction:row;align-items:center;gap:4px">symbol mm<input data-df="symH" type="number" step="0.5" value="${d.symH||''}" placeholder="${P.label.symH}" style="width:60px"></label>
    <label class="f" style="flex-direction:row;align-items:center;gap:4px">nazwa mm<input data-df="nameH" type="number" step="0.5" value="${d.nameH||''}" placeholder="${P.label.nameH}" style="width:60px"></label>
    ${tc?`<label class="f" style="flex-direction:row;align-items:center;gap:4px">pola mm<input data-df="cellH" type="number" step="0.5" value="${d.cellH||''}" placeholder="${P.label.cellH}" style="width:60px"></label>`:''}
    <span style="flex:1"></span><button class="small icon" data-act="left">◀</button><button class="small icon" data-act="right">▶</button><button class="small" data-act="dup">Duplikuj</button><button class="small danger" data-act="del">Usuń</button></div>
    <datalist id="ratings">${['B6','B10','B13','B16','B20','B25','B32','C6','C10','C16','C20','C25','C32','C40','C63','D16','D32','25A 30mA','40A 30mA','63A 30mA','40A 300mA'].map(r=>`<option value="${r}">`).join('')}</datalist>`;
  e.innerHTML=h; }
$('editor').addEventListener('change',e=>{ const fd=selDev&&findDev(selDev.id); if(!fd) return; const d=fd.dev; snapshot(); const t=e.target;
  if(t.id==='autoSym') d.auto=t.checked;
  else if(t.dataset.cell!=null){ const tc=tableCells(d); const n=tc?tc.n:1; const cells=(d.name||'').split('|'); while(cells.length<n) cells.push(''); cells.length=n; cells[+t.dataset.cell]=t.value; d.name=cells.join('|'); }
  else { const k=t.dataset.df; if(k==='mod') d.mod=+t.value||1; else if(k==='symH'||k==='nameH'||k==='cellH'||k==='iconScale') d[k]=t.value===''?null:+t.value;
    else if(k==='table') d.table=t.value; else if(k==='icon'||k==='iconPos') d[k]=t.value;
    else if(k==='grp'){ const g=fd.row.groups.find(x=>x.id===t.value); if(g&&g!==fd.grp){ fd.grp.devices.splice(fd.idx,1); g.devices.push(d); selGrp=g; } }
    else if(k){ d[k]=t.value; if(k==='symbol') d.auto=false; } }
  change(); });
$('editor').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const fd=selDev&&findDev(selDev.id); if(!fd) return; snapshot(); const {grp,idx,dev}=fd; const arr=grp.devices;
  if(b.dataset.act==='del'){ arr.splice(idx,1); selDev=null; }
  if(b.dataset.act==='left'&&idx>0) arr.splice(idx-1,0,arr.splice(idx,1)[0]);
  if(b.dataset.act==='right'&&idx<arr.length-1) arr.splice(idx+1,0,arr.splice(idx,1)[0]);
  if(b.dataset.act==='dup'){ const c=reid(JSON.parse(JSON.stringify(dev))); arr.splice(idx+1,0,c); selDev=c; }
  change(); });
document.addEventListener('keydown',e=>{ if(e.target.matches('input,textarea,select')) return; const fd=selDev&&findDev(selDev.id);
  if(e.key==='Delete'||e.key==='Backspace'){ if(multi.size){ snapshot(); for(const id of multi){ const f2=findDev(id); if(f2) f2.grp.devices.splice(f2.grp.devices.indexOf(f2.dev),1); } multi.clear(); selDev=null; change(); } else if(fd){ snapshot(); fd.grp.devices.splice(fd.idx,1); selDev=null; change(); } }
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){ e.preventDefault(); undo(); } if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){ e.preventDefault(); redo(); }
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='c'){ copySel(); } if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='v'){ pasteSel(); }
  if(fd&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){ const arr=fd.grp.devices; const i=fd.idx; if(e.key==='ArrowLeft'&&i>0){ snapshot(); arr.splice(i-1,0,arr.splice(i,1)[0]); change(); } if(e.key==='ArrowRight'&&i<arr.length-1){ snapshot(); arr.splice(i+1,0,arr.splice(i,1)[0]); change(); } e.preventDefault(); } });
function reselect(){ selCab=P.cabinets.find(c=>selCab&&c.id===selCab.id)||P.cabinets[0]||null; const fi=selItem&&findItem(selItem.id); selItem=fi?fi.item:null; if(fi) selCab=fi.cab; const fg=selGrp&&findGrp(selGrp.id); selGrp=fg?fg.grp:null; const fd=selDev&&findDev(selDev.id); selDev=fd?fd.dev:null; multi=new Set([...multi].filter(id=>findDev(id))); }
function undo(){ const s=history.pop(); if(!s){toast('Nic do cofnięcia');return;} future.push(JSON.stringify(P)); P=JSON.parse(s); reselect(); syncInputs(); change(); }
function redo(){ const s=future.pop(); if(!s){toast('Nic do ponowienia');return;} history.push(JSON.stringify(P)); P=JSON.parse(s); reselect(); syncInputs(); change(); }
$('btnUndo').onclick=undo; $('btnRedo').onclick=redo;
$('view').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; VIEW=b.dataset.v; if(VIEW==='cab'&&!selCab) selCab=P.cabinets[0]; if(VIEW==='item'&&!selItem){ const ci=coverItems()[0]; if(ci){ selItem=ci.item; selCab=ci.cab; } else VIEW='cab'; } document.querySelectorAll('#view button').forEach(x=>x.classList.toggle('on',x.dataset.v===VIEW)); ZOOM.key=''; render(); });
$('mode').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; MODE=b.dataset.m; document.querySelectorAll('#mode button').forEach(x=>x.classList.toggle('on',x===b)); render(); });
// zoom / pan
function zoomAt(factor, px, py){ const v=currentViewBox(); const nk=Math.min(60,Math.max(1,ZOOM.k*factor)); const f2=ZOOM.k/nk; if(px==null){ px=v.x+v.w/2; py=v.y+v.h/2; } ZOOM.cx = px + (ZOOM.cx-px)*f2; ZOOM.cy = py + (ZOOM.cy-py)*f2; ZOOM.k=nk; clampZoom(); applyViewBox(); $('stats').textContent=$('stats').textContent.replace(/\d+%$/,`${Math.round(ZOOM.k*100)}%`); }
function clampZoom(){ const w=BASE.w/ZOOM.k, h=BASE.h/ZOOM.k; ZOOM.cx=Math.min(BASE.x+BASE.w-w/2, Math.max(BASE.x+w/2, ZOOM.cx)); ZOOM.cy=Math.min(BASE.y+BASE.h-h/2, Math.max(BASE.y+h/2, ZOOM.cy)); }
$('zoomIn').onclick=()=>zoomAt(1.5); $('zoomOut').onclick=()=>zoomAt(1/1.5); $('zoomReset').onclick=()=>{ ZOOM.key=''; render(); };
$('stage').addEventListener('wheel',e=>{ if(!e.target.closest('#svg')) return; e.preventDefault(); const [x,y]=svgPoint(e); zoomAt(e.deltaY<0?1.25:1/1.25, x, y); },{passive:false});
let drag=null; const pointers=new Map(); let pinch=null;
function svgPoint(ev){ const svg=$('svg'); const pt=svg.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY; const p=pt.matrixTransform(svg.getScreenCTM().inverse()); return [p.x,p.y]; }
$('stage').addEventListener('pointerdown',ev=>{
  if(!ev.target.closest('#svg')) return; pointers.set(ev.pointerId,[ev.clientX,ev.clientY]);
  if(pointers.size===2){ drag=null; $('ghost').innerHTML=''; const [a,b]=[...pointers.values()]; pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]), k:ZOOM.k}; return; }
  const dg=ev.target.closest('.dev'), gg=ev.target.closest('.grp');
  const base={start:[ev.clientX,ev.clientY], moved:false, target:null, shift:ev.shiftKey};
  if(dg){ const fd=findDev(dg.dataset.dev); if(fd) drag=Object.assign(base,{kind:'dev',dev:fd.dev}); }
  else if(gg){ const fg=findGrp(gg.dataset.grp); if(fg){ const g=coverGeometry(fg.cab,fg.item); const gi=g.groups.find(x=>x.grp===fg.grp); const [x]=svgPoint(ev); drag=Object.assign(base,{kind:'grp',grp:fg.grp,item:fg.item,cab:fg.cab,g,gi,offM:(x-gi.x)/P.pitch}); } }
  else drag=Object.assign(base,{kind:'pan', el:ev.target, cx:ZOOM.cx, cy:ZOOM.cy});
  $('svg').setPointerCapture(ev.pointerId); ev.preventDefault();
});
$('stage').addEventListener('pointermove',ev=>{
  if(pointers.has(ev.pointerId)) pointers.set(ev.pointerId,[ev.clientX,ev.clientY]);
  if(pinch&&pointers.size>=2){ const [a,b]=[...pointers.values()]; const d=Math.hypot(a[0]-b[0],a[1]-b[1]); ZOOM.k=Math.min(60,Math.max(1,pinch.k*d/pinch.d)); clampZoom(); applyViewBox(); return; }
  if(!drag) return; if(!drag.moved&&Math.hypot(ev.clientX-drag.start[0],ev.clientY-drag.start[1])<4) return; drag.moved=true;
  if(drag.kind==='pan'){ const svg=$('svg'); const r=svg.getBoundingClientRect(); const v=currentViewBox(); ZOOM.cx=drag.cx-(ev.clientX-drag.start[0])*v.w/r.width; ZOOM.cy=drag.cy-(ev.clientY-drag.start[1])*v.h/r.height; clampZoom(); applyViewBox(); return; }
  const [x,y]=svgPoint(ev);
  if(drag.kind==='grp'){ const r=drag.item.row; const gm=groupMod(drag.grp); let m=Math.round((x-drag.g.nx)/P.pitch-drag.offM); const [lo,hi]=freeRange(r,drag.grp); const snap= m<=lo+0.5?'left': m>=hi-0.5?'right':null; m=Math.max(lo,Math.min(hi,m)); drag.target={m, snap};
    $('ghost').innerHTML=`<rect class="ghost" x="${drag.g.nx+m*P.pitch}" y="${drag.g.labTop}" width="${gm*P.pitch}" height="${P.label.h+P.label.gap+r.nicheH}"/>`; return; }
  let best=null;
  for(const {cab,item} of coverItems()){ const g=coverGeometry(cab,item); if(y<g.labTop-10||y>g.nicheTop+item.row.nicheH+10||x<g.box.x-10||x>g.box.x+g.box.w+10) continue;
    let gi=g.groups.find(q=>x>=q.x&&x<=q.x+q.w); if(!gi) gi=g.groups.slice().sort((a,b)=>Math.min(Math.abs(x-a.x),Math.abs(x-a.x-a.w))-Math.min(Math.abs(x-b.x),Math.abs(x-b.x-b.w)))[0]; if(!gi) break;
    const others=gi.grp.devices.filter(d=>d!==drag.dev); let m=0, idx=others.length, ix=gi.x;
    for(let i=0;i<others.length;i++){ const cx=gi.x+(m+others[i].mod/2)*P.pitch; if(x<cx){ idx=i; ix=gi.x+m*P.pitch; break; } m+=others[i].mod; if(i===others.length-1) ix=gi.x+m*P.pitch; }
    best={item,cab,grp:gi.grp,idx,ix,g}; break; }
  drag.target=best; $('ghost').innerHTML= best? `<rect class="ghost" x="${best.ix}" y="${best.g.nicheTop}" width="${drag.dev.mod*P.pitch}" height="${best.item.row.nicheH}"/>`:'';
});
function endPointer(ev){
  pointers.delete(ev.pointerId); if(pinch){ if(pointers.size<2) pinch=null; drag=null; return; }
  if(!drag) return; const d=drag; drag=null; $('ghost').innerHTML='';
  if(d.kind==='pan'){ if(!d.moved){ const t=d.el; const ig=t.closest('.item'), cg=t.closest('.cab');
      if(ig){ const fi=findItem(ig.dataset.item); if(fi){ selItem=fi.item; selCab=fi.cab; selGrp=null; selDev=null; multi.clear(); change(); } }
      else if(cg){ const c=P.cabinets.find(x=>x.id===cg.dataset.cab); if(c){ selCab=c; selItem=null; selGrp=null; selDev=null; multi.clear(); change(); } } }
    return; }
  if(d.kind==='grp'){ if(!d.moved){ selGrp=d.grp; selItem=d.item; selCab=d.cab; selDev=null; change(); return; } if(d.target){ snapshot(); const gs=d.item.row.groups; const i=gs.indexOf(d.grp);
      if(d.target.snap==='left'){ d.grp.align='left'; gs.splice(i,1); gs.unshift(d.grp); } else if(d.target.snap==='right'){ d.grp.align='right'; gs.splice(i,1); gs.push(d.grp); } else { d.grp.align='free'; d.grp.x=d.target.m; }
      selGrp=d.grp; selItem=d.item; selCab=d.cab; change(); } return; }
  if(!d.moved){ const fd=findDev(d.dev.id); if(d.shift){ if(selDev&&!multi.size) multi.add(selDev.id); if(multi.has(d.dev.id)) multi.delete(d.dev.id); else multi.add(d.dev.id); } else multi.clear(); selDev=d.dev; if(fd){ selItem=fd.item; selCab=fd.cab; selGrp=fd.grp; } change(); return; }
  if(d.target){ snapshot(); const fd=findDev(d.dev.id); fd.grp.devices.splice(fd.idx,1); d.target.grp.devices.splice(d.target.idx,0,d.dev); selDev=d.dev; selGrp=d.target.grp; selItem=d.target.item; selCab=d.target.cab; change(); }
}
$('stage').addEventListener('pointerup',endPointer); $('stage').addEventListener('pointercancel',endPointer);
// export
$('btnExportAll').onclick=exportWhole; $('btnExportCab').onclick=()=>{ if(!selCab){toast('Zaznacz szafę');return;} exportCab(selCab); };
$('btnExportItem').onclick=()=>{ if(!selItem||selItem.type!=='cover'){ toast('Zaznacz maskownicę z wycięciem'); return; } exportItem(findItem(selItem.id).cab, selItem); };
$('btnExportItems').onclick=async()=>{ for(const {cab,item} of coverItems()){ await exportItem(cab,item); await new Promise(r=>setTimeout(r,500)); } };
$('btnPdf').onclick=exportPdf; $('btnBom').onclick=exportBom;
$('btnOffline').onclick=()=>saveFile('eitlab-frontpanel.html', SOURCE, 'text/html');
$('btnJsonOut').onclick=()=>saveFile(`${fname(P.tag||P.name)}.json`, JSON.stringify({format:FORMAT,app:APP_NAME,version:APP_VER,kind:'board',order:ORDER,board:P},null,1));
$('btnOrderOut').onclick=async()=>{ await saveNow(); const boards=await listBoards(ORDER.id); saveFile(`zlecenie_${fname(ORDER.number||ORDER.id)}.json`, JSON.stringify({format:FORMAT,app:APP_NAME,version:APP_VER,kind:'order',order:ORDER,boards},null,1)); };
$('btnJsonIn').onclick=()=>$('jsonFile').click();
$('jsonFile').addEventListener('change',e=>readFile(e.target, async (txt,file)=>{ const p=JSON.parse(txt);
  if(p.kind==='order'&&p.order){ await IDB.set('order:'+p.order.id,p.order); for(const b of (p.boards||[])){ b.orderId=p.order.id; await IDB.set('board:'+b.id,b); } toast(`Wczytano zlecenie ${p.order.number||''} (${(p.boards||[]).length} rozdzielnic)`); const first=(p.boards||[])[0]; if(first) openBoard(first,p.order); return; }
  const board = p.kind==='board'? p.board : (p.cabinets||p.rows? p : null); if(!board) throw new Error('to nie jest plik projektu');
  if(p.order&&p.order.id!==ORDER.id&&confirm('Plik zawiera dane zlecenia. Otworzyć w tym zleceniu (OK) czy w bieżącym (Anuluj)?')){ ORDER=p.order; await IDB.set('order:'+ORDER.id,ORDER); }
  board.id=board.id||uid(); board.orderId=ORDER.id; await saveNow(); loadBoard(board); toast('Wczytano '+file.name); }));
// orders modal
$('btnOrders').onclick=()=>{ $('mOrders').classList.add('on'); renderOrders(); };
$('btnNewOrder').onclick=async()=>{ await saveNow(); const o=newOrder(); o.number=prompt('Numer zlecenia','')||''; await IDB.set('order:'+o.id,o); const b=newBoard(); b.orderId=o.id; await IDB.set('board:'+b.id,b); await openBoard(b,o); renderOrders(); };
$('orderSearch').addEventListener('input',()=>renderOrders());
async function renderOrders(){ const q=($('orderSearch').value||'').toLowerCase(); const orders=(await listOrders()).filter(o=>!q||[o.number,o.client,o.object,o.address].join(' ').toLowerCase().includes(q));
  $('orderList').innerHTML=orders.map(o=>`<div class="it${o.id===ORDER.id?' on':''}" data-o="${o.id}"><span class="grow"><b>${esc(o.number||'(bez numeru)')}</b> · ${esc(o.client||'')} ${o.object?'· '+esc(o.object):''}<br><span style="font-size:11px;color:var(--ink-2)">${esc(o.status||'')} · ${new Date(o.updated||o.created).toLocaleDateString('pl-PL')}</span></span></div>`).join('')||'<div class="it" style="cursor:default">Brak zleceń – dodaj nowe.</div>';
  renderOrderDetail(); }
async function renderOrderDetail(){ const o=ORDER; const boards=await listBoards(o.id); const el=$('orderDetail');
  el.innerHTML=`<h3>Zlecenie</h3><div class="row"><label class="f">Numer<input data-of="number" value="${esc(o.number)}"></label><label class="f">Status<select data-of="status">${['nowe','w trakcie','do produkcji','wykonane','archiwum'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></label></div>
    <div class="row"><label class="f">Klient<input data-of="client" value="${esc(o.client)}"></label><label class="f">Obiekt<input data-of="object" value="${esc(o.object)}"></label></div>
    <label class="f">Adres<input data-of="address" value="${esc(o.address)}"></label>
    <div class="row three" style="margin-top:8px"><label class="f">Kontakt<input data-of="contact" value="${esc(o.contact)}"></label><label class="f">Telefon<input data-of="phone" value="${esc(o.phone)}"></label><label class="f">E-mail<input data-of="email" value="${esc(o.email)}"></label></div>
    <div class="row"><label class="f">Data przyjęcia<input type="date" data-of="dateStart" value="${esc(o.dateStart)}"></label><label class="f">Termin<input type="date" data-of="dateDue" value="${esc(o.dateDue)}"></label></div>
    <label class="f">Uwagi<textarea data-of="notes">${esc(o.notes)}</textarea></label>
    <h3>Rozdzielnice w zleceniu</h3><div class="list">${boards.map(b=>`<div class="it${b.id===P.id?' on':''}" data-b="${b.id}"><span class="grow"><b>${esc(b.name)}</b> ${b.tag?esc(b.tag):''} · rev. ${esc(b.revision||'-')} · ${(b.cabinets||[]).length} szaf</span><button class="small ghost icon" data-bact="dup" title="Duplikuj">⧉</button><button class="small danger icon" data-bact="del">×</button></div>`).join('')}</div>
    <div class="btns"><button class="small" id="btnNewBoard">+ Rozdzielnica</button><button class="small danger" id="btnDelOrder">Usuń zlecenie</button></div>`;
  el.querySelectorAll('[data-of]').forEach(inp=>inp.addEventListener('change',async()=>{ o[inp.dataset.of]=inp.value; o.updated=Date.now(); await IDB.set('order:'+o.id,o); renderCrumb(); renderOrders(); }));
  $('btnNewBoard').onclick=async()=>{ await saveNow(); const b=newBoard(); b.orderId=o.id; b.name=prompt('Nazwa rozdzielnicy','Rozdzielnica')||'Rozdzielnica'; await IDB.set('board:'+b.id,b); await openBoard(b,o); renderOrders(); };
  $('btnDelOrder').onclick=async()=>{ if(!confirm(`Usunąć zlecenie ${o.number||''} razem z ${boards.length} rozdzielnicami?`)) return; for(const b of boards) await IDB.del('board:'+b.id); await IDB.del('order:'+o.id); const rest=await listOrders(); if(rest.length){ const bs=await listBoards(rest[0].id); await openBoard(bs[0]||Object.assign(newBoard(),{orderId:rest[0].id}), rest[0]); } else { const no=newOrder(); await IDB.set('order:'+no.id,no); const nb=newBoard(); nb.orderId=no.id; await openBoard(nb,no); } renderOrders(); }; }
$('orderList').addEventListener('click',async e=>{ const el=e.target.closest('.it[data-o]'); if(!el) return; const o=await IDB.get('order:'+el.dataset.o); if(!o) return; await saveNow(); ORDER=o; const bs=await listBoards(o.id); if(bs.length) loadBoard(bs[0]); else { const b=newBoard(); b.orderId=o.id; loadBoard(b); } renderOrders(); });
$('orderDetail').addEventListener('click',async e=>{ const el=e.target.closest('.it[data-b]'); if(!el) return; const b=await IDB.get('board:'+el.dataset.b); if(!b) return; const act=e.target.closest('button[data-bact]');
  if(!act){ await saveNow(); loadBoard(b); renderOrders(); return; }
  if(act.dataset.bact==='dup'){ const n=reid(JSON.parse(JSON.stringify(b))); n.name=b.name+' (kopia)'; n.orderId=ORDER.id; n.updated=Date.now(); await IDB.set('board:'+n.id,n); renderOrders(); }
  if(act.dataset.bact==='del'){ if(!confirm('Usunąć rozdzielnicę '+b.name+'?')) return; await IDB.del('board:'+b.id); if(b.id===P.id){ const bs=await listBoards(ORDER.id); if(bs.length) loadBoard(bs[0]); else { const nb=newBoard(); nb.orderId=ORDER.id; loadBoard(nb); } } renderOrders(); } });
// library modal
$('btnLib').onclick=()=>{ $('mLib').classList.add('on'); renderDb(); renderEnc(); renderFonts(); renderIconsLib(); renderTpl(); };
$('libTabs').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; document.querySelectorAll('#libTabs button').forEach(x=>x.classList.toggle('on',x===b)); for(const k of ['dev','enc','fonts','icons','tpl']) $('lib'+k.charAt(0).toUpperCase()+k.slice(1)).style.display=b.dataset.l===k?'block':'none'; });
function renderDb(){ const opt=v=>Object.entries(TABLES).map(([k,n])=>`<option value="${k}" ${(v||'std')===k?'selected':''}>${n}</option>`).join('');
  $('dbt').innerHTML=`<tr><th>Kod</th><th>Nazwa</th><th>Mod.</th><th>Pref.</th><th>Model</th><th>Tabelka</th><th></th></tr>`+DB.map((d,i)=>`<tr data-i="${i}"><td><input data-k="code" value="${esc(d.code)}" style="width:80px"></td><td><input data-k="name" value="${esc(d.name)}"></td><td class="n"><input data-k="mod" type="number" step="0.5" value="${d.mod}"></td><td class="n"><input data-k="prefix" value="${esc(d.prefix)}"></td><td><input data-k="rating" value="${esc(d.rating||'')}" style="width:90px"></td><td><select data-k="table" style="width:130px">${opt(d.table)}</select></td><td><button class="small ghost icon" data-del="${i}">×</button></td></tr>`).join(''); }
$('dbt').addEventListener('change',e=>{ const tr=e.target.closest('tr'); const k=e.target.dataset.k; if(!tr||!k) return; const d=DB[+tr.dataset.i]; d[k]= k==='mod'? +e.target.value : e.target.value.trim(); SETTINGS.libUpdated=Date.now(); renderPalette(); saveLibrary(); });
$('dbt').addEventListener('click',e=>{ const b=e.target.closest('button[data-del]'); if(!b) return; DB.splice(+b.dataset.del,1); SETTINGS.libUpdated=Date.now(); renderDb(); renderPalette(); saveLibrary(); });
$('btnAddDb').onclick=()=>{ DB.push({code:'NOWY',name:'Nazwa',mod:1,prefix:'F',table:'std',rating:''}); SETTINGS.libUpdated=Date.now(); renderDb(); renderPalette(); saveLibrary(); };
$('btnResetDb').onclick=()=>{ if(!confirm('Przywrócić domyślną bazę aparatów?')) return; DB=JSON.parse(JSON.stringify(DEFAULT_DB)); SETTINGS.libUpdated=Date.now(); renderDb(); renderPalette(); saveLibrary(); };
$('btnDbOut').onclick=()=>saveFile('baza-aparatow.json', JSON.stringify({format:FORMAT,kind:'library',devices:DB,enclosures:ENC},null,1)); $('btnDbIn').onclick=()=>$('dbFile').click();
$('dbFile').addEventListener('change',e=>readFile(e.target,txt=>{ const p=JSON.parse(txt); if(!p.devices) throw new Error('brak bazy w pliku'); DB=p.devices; if(p.enclosures) ENC=p.enclosures; SETTINGS.libUpdated=Date.now(); renderDb(); renderEnc(); renderPalette(); saveLibrary(); toast('Wczytano bazę'); }));
function renderEnc(){ $('enct').innerHTML=`<tr><th>Nazwa</th><th>Szer.</th><th>Wys.</th><th>Cokół</th><th>Szer. maskownic</th><th>Wys. maskownic</th><th></th></tr>`+ENC.map((d,i)=>`<tr data-i="${i}"><td><input data-k="name" value="${esc(d.name)}"></td><td class="n"><input data-k="w" type="number" value="${d.w}"></td><td class="n"><input data-k="h" type="number" value="${d.h}"></td><td class="n"><input data-k="plinth" type="number" value="${d.plinth||0}"></td><td><input data-k="coverW" value="${esc(d.coverW)}"></td><td><input data-k="coverH" value="${esc(d.coverH)}"></td><td><button class="small ghost icon" data-del="${i}">×</button></td></tr>`).join(''); }
$('enct').addEventListener('change',e=>{ const tr=e.target.closest('tr'); const k=e.target.dataset.k; if(!tr||!k) return; const d=ENC[+tr.dataset.i]; d[k]= ['w','h','plinth'].includes(k)? +e.target.value : e.target.value.trim(); SETTINGS.libUpdated=Date.now(); saveLibrary(); });
$('enct').addEventListener('click',e=>{ const b=e.target.closest('button[data-del]'); if(!b) return; ENC.splice(+b.dataset.del,1); SETTINGS.libUpdated=Date.now(); renderEnc(); saveLibrary(); });
$('btnAddEnc').onclick=()=>{ ENC.push({name:'Nowa obudowa',w:600,h:2000,plinth:100,coverW:'500',coverH:'150,200'}); SETTINGS.libUpdated=Date.now(); renderEnc(); saveLibrary(); };
// fonts & icons library
function renderFontSamples(){ const sample='Ąę Gn. 400V C32'; for(const [sel,box] of [['font','fontSample'],['fontSym','fontSymSample'],['fontInfo','fontInfoSample']]){ const el=$(box); if(!el) continue; try{ const r=textPolys(sample, 6, $(sel).value); const d=r.polys.map(p=>p.pts.map((q,i)=>(i?'L':'M')+f(q[0])+' '+f(q[1]+7)).join('')+(p.closed?'Z':'')).join(' '); const out=isOutlineFont(resolveFont($(sel).value)); el.innerHTML=`<svg viewBox="0 0 ${Math.max(60,r.width+2)} 10" height="22" style="max-width:100%"><path d="${d}" fill="${out?'currentColor':'none'}" stroke="currentColor" stroke-width="${out?0:0.5}" fill-rule="evenodd"/></svg>`; }catch(e){ el.innerHTML=''; } } }
['font','fontSym','fontInfo'].forEach(id=>$(id).addEventListener('change',renderFontSamples));
function refreshFontSelects(){ const keep=['font','fontSym','fontInfo'].map(id=>[id,$(id).value]); for(const [id] of keep){ $(id).innerHTML=fontSelectOptions(); } for(const [id,v] of keep) $(id).value=resolveFont(v); renderGrpSettings(); renderFontSamples(); }
async function saveFonts(){ await IDB.set('fonts', USERFONTS); SETTINGS.libUpdated=Date.now(); await IDB.set('settings',SETTINGS); if(SETTINGS.gAuto&&gToken) driveSyncDebounced(); }
function renderFonts(){ $('fontt').innerHTML=`<tr><th>Nazwa</th><th>Plik</th><th>Próbka</th><th></th></tr>`+USERFONTS.map((fo,i)=>{ let sample=''; try{ const r=textPolys('Ąę Gn. 400V C32',6,'u:'+fo.id); sample=`<svg viewBox="0 0 ${Math.max(60,r.width+2)} 10" height="22"><path d="${r.polys.map(p=>p.pts.map((q,j)=>(j?'L':'M')+f(q[0])+' '+f(q[1]+7)).join('')+'Z').join(' ')}" fill="currentColor" fill-rule="evenodd"/></svg>`; }catch(e){ sample='<span style="color:var(--danger)">błąd</span>'; }
    return `<tr data-i="${i}"><td><input data-k="name" value="${esc(fo.name)}"></td><td style="font-size:11px;color:var(--ink-2)">${esc(fo.file||'')} · ${Math.round((fo.b64||'').length*0.75/1024)} kB</td><td>${sample}</td><td><button class="small ghost icon" data-del="${i}">×</button></td></tr>`; }).join('')||'<tr><td colspan="4" style="color:var(--ink-2)">Brak własnych czcionek – wgraj np. C:\\Windows\\Fonts\\arial.ttf, arialbd.ttf, ARIALN.TTF</td></tr>'; }
$('fontt').addEventListener('change',e=>{ const tr=e.target.closest('tr'); if(!tr||!e.target.dataset.k) return; USERFONTS[+tr.dataset.i][e.target.dataset.k]=e.target.value.trim(); saveFonts(); refreshFontSelects(); });
$('fontt').addEventListener('click',e=>{ const b=e.target.closest('button[data-del]'); if(!b) return; const fo=USERFONTS[+b.dataset.del]; if(!confirm('Usunąć czcionkę '+fo.name+'?')) return; USERFONTS.splice(+b.dataset.del,1); delete userFontCache[fo.id]; saveFonts(); renderFonts(); refreshFontSelects(); });
$('btnAddFont').onclick=()=>$('fontFiles').click();
$('fontFiles').addEventListener('change',async e=>{ for(const file of e.target.files){ const buf=await file.arrayBuffer(); try{ const fnt=opentype.parse(buf); const name=(fnt.names.fullName&&(fnt.names.fullName.pl||fnt.names.fullName.en))||file.name.replace(/\.[^.]+$/,''); let bin=''; const u=new Uint8Array(buf); for(let i=0;i<u.length;i+=0x8000) bin+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000)); USERFONTS.push({id:uid(),name,file:file.name,b64:btoa(bin)}); }catch(err){ toast('Nie udało się odczytać '+file.name+': '+err.message); } } e.target.value=''; await saveFonts(); renderFonts(); refreshFontSelects(); toast('Dodano czcionki: '+USERFONTS.length); });
$('ttfFile').addEventListener('change',()=>{ /* legacy single upload also lands in the library */ });
function renderIconsLib(){ $('iconGrid').innerHTML=[...ICONS.map(i=>`<div style="text-align:center;font-size:11px;color:var(--ink)">${iconSvgPreview(i.id,44)}<br>${esc(i.name)}</div>`), ...USERICONS.map((i,k)=>`<div style="text-align:center;font-size:11px;color:var(--ink)">${iconSvgPreview(i.id,44)}<br><input data-icn="${k}" value="${esc(i.name)}" style="width:90px;font-size:11px;padding:2px 4px;border:1px solid var(--line);border-radius:3px"> <button class="small ghost icon" data-icdel="${k}" style="min-height:24px;padding:0 6px">×</button></div>`)].join(''); }
async function saveIcons(){ await IDB.set('icons', USERICONS); SETTINGS.libUpdated=Date.now(); await IDB.set('settings',SETTINGS); if(SETTINGS.gAuto&&gToken) driveSyncDebounced(); }
$('iconGrid').addEventListener('change',e=>{ const k=e.target.dataset.icn; if(k==null) return; USERICONS[+k].name=e.target.value.trim()||'Symbol'; saveIcons(); });
$('iconGrid').addEventListener('click',e=>{ const b=e.target.closest('button[data-icdel]'); if(!b) return; USERICONS.splice(+b.dataset.icdel,1); saveIcons(); renderIconsLib(); });
$('btnAddIcon').onclick=()=>$('iconFiles').click();
$('iconFiles').addEventListener('change',async e=>{ for(const file of e.target.files){ try{ const txt=await file.text(); const cs=svgToContours(txt); if(!cs.length) throw new Error('brak ścieżek w SVG'); USERICONS.push({id:'u_'+uid(), name:file.name.replace(/\.svg$/i,''), contours:cs}); }catch(err){ toast('Nie udało się wczytać '+file.name+': '+err.message); } } e.target.value=''; await saveIcons(); renderIconsLib(); toast('Dodano symbole: '+USERICONS.length); });
// settings modal
$('btnSettings').onclick=async()=>{ $('mSet').classList.add('on'); $('gClientId').value=SETTINGS.gClientId||''; $('gAuto').checked=!!SETTINGS.gAuto; const orders=await listOrders(); const keys=await IDB.keys('board:'); let est=''; try{ if(navigator.storage&&navigator.storage.estimate){ const e=await navigator.storage.estimate(); est=` · zajęte ${(e.usage/1024/1024).toFixed(1)} MB z ${(e.quota/1024/1024/1024).toFixed(1)} GB`; } }catch(e){}
  $('storInfo').textContent=`Dane trzymane w ${IDB.db?'IndexedDB':'localStorage'} tej przeglądarki: ${orders.length} zleceń, ${keys.length} rozdzielnic${est}. Kopia zapasowa poniżej zapisuje wszystko do jednego pliku JSON.`; };
$('btnTheme').onclick=async()=>{ SETTINGS.theme=SETTINGS.theme==='dark'?'light':'dark'; document.documentElement.dataset.theme=SETTINGS.theme; await IDB.set('settings',SETTINGS); };
$('btnBackup').onclick=async()=>{ await saveNow(); const keys=await IDB.keys(''); const data={}; for(const k of keys) data[k]=await IDB.get(k); saveFile(`eitlab-kopia-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify({format:FORMAT,kind:'backup',app:APP_NAME,version:APP_VER,data},null,0)); };
$('btnRestore').onclick=()=>$('restoreFile').click();
$('restoreFile').addEventListener('change',e=>readFile(e.target, async txt=>{ const p=JSON.parse(txt); if(p.kind!=='backup'||!p.data) throw new Error('to nie jest kopia bazy'); if(!confirm('Wczytać kopię? Istniejące zlecenia o tych samych identyfikatorach zostaną nadpisane.')) return; for(const [k,v] of Object.entries(p.data)) if(k!=='settings') await IDB.set(k,v); if(p.data.devices) DB=p.data.devices; if(p.data.enclosures) ENC=p.data.enclosures; if(p.data.fonts) USERFONTS=p.data.fonts; if(p.data.icons) USERICONS=p.data.icons; if(p.data.templates) TEMPLATES=p.data.templates; renderPalette(); refreshFontSelects(); renderTplList(); toast('Kopia wczytana'); renderOrders(); }));
$('btnGSignIn').onclick=gSignIn; $('btnGSync').onclick=()=>driveSync(false); $('btnGSignOut').onclick=()=>{ gToken=null; gMsg('Wylogowano.'); };
$('gAuto').addEventListener('change',async e=>{ SETTINGS.gAuto=e.target.checked; await IDB.set('settings',SETTINGS); });
$('gClientId').addEventListener('change',async e=>{ SETTINGS.gClientId=e.target.value.trim(); await IDB.set('settings',SETTINGS); });
// check
$('btnCheck').onclick=()=>{ const iss=[]; FIT_LOG=[]; for(const {cab,item} of coverItems()) coverGeometry(cab,item); const shr=FIT_LOG.filter(x=>x.k<0.85); FIT_LOG=null; for(const x of shr.slice(0,40)) iss.push(['warn',`Tekst „${x.text}” zmniejszony do ${Math.round(x.k*100)}% (${(x.capH*x.k).toFixed(1)} mm zamiast ${x.capH} mm) – skróć nazwę lub powiększ ramkę`]); P.cabinets.forEach((c,ci)=>{ const used=c.items.reduce((a,i)=>a+i.h,0); if(used>c.h) iss.push(['err',`Szafa ${ci+1}: elementy ${used} mm > wysokość szafy ${c.h} mm`]); if(used<c.h) iss.push(['info',`Szafa ${ci+1}: ${c.h-used} mm wolnego miejsca`]);
    c.items.forEach((it,ii)=>{ if(it.w>c.w) iss.push(['err',`Szafa ${ci+1}, element ${ii+1}: szerszy (${it.w}) niż szafa (${c.w})`]); if(it.type!=='cover') return; const r=it.row; const nw=r.mod*P.pitch; if(nw>it.w) iss.push(['err',`Szafa ${ci+1}, maskownica ${ii+1}: wycięcie ${nw} mm szersze niż maskownica ${it.w} mm`]);
      const g=coverGeometry(c,it); if(g.labTop-g.topSpace<g.box.y||g.nicheTop+r.nicheH+g.botSpace>g.box.y+g.box.h) iss.push(['err',`Szafa ${ci+1}, maskownica ${ii+1}: opisy/wycięcie wychodzą poza maskownicę (za mała wysokość)`]);
      const used=rowDevices(r).reduce((a,d)=>a+d.mod,0); if(used>r.mod) iss.push(['err',`Szafa ${ci+1}, maskownica ${ii+1}: ${used} modułów > ${r.mod} w wycięciu`]); const gx=groupX(r); for(const gr of r.groups){ if(!gr.devices.length) iss.push(['warn',`Szafa ${ci+1}, maskownica ${ii+1}: pusta grupa „${gr.name||'bez nazwy'}”`]); for(const d of gr.devices){ if(d.blank) continue; if(!d.name&&(d.table||'std')==='std') iss.push(['warn',`${d.symbol||d.code}: brak nazwy`]); if(!d.rating) iss.push(['warn',`${d.symbol||d.code} (${d.name||''}): brak modelu/prądu`]); } } }); });
  const syms={}; for(const {item} of coverItems()) for(const d of rowDevices(item.row)) if(d.symbol){ (syms[d.symbol]=syms[d.symbol]||[]).push(d); } for(const [s,l] of Object.entries(syms)) if(l.length>1) iss.push(['err',`Symbol ${s} użyty ${l.length} razy`]);
  $('issues').innerHTML= iss.length? iss.map(([t,m])=>`<div class="it"><span class="tag" style="background:${t==='err'?'#f8d7d7':t==='warn'?'#fff1c2':'var(--panel)'}">${t==='err'?'błąd':t==='warn'?'uwaga':'info'}</span><span class="grow" style="white-space:normal">${esc(m)}</span></div>`).join('') : '<div class="it">Brak uwag – projekt wygląda poprawnie.</div>'; $('mCheck').classList.add('on'); };

/* ===================== CSV import / export (v3) ===================== */
const CSV_SPEC = `FORMAT IMPORTU ROZDZIELNICY (CSV) – wersja 3 (${APP_NAME})
==========================================================
Plik tekstowy UTF-8. Separator pól: średnik (;) lub tabulator. Wiersze puste i zaczynające się od # są pomijane.
Pierwsze pole = typ wiersza (wielkość liter i polskie znaki bez znaczenia). Kolejność wierszy = kolejność na froncie:
szafy od lewej, elementy w szafie od góry do dołu, grupy w kolejności układania, aparaty w grupie od lewej.
Wersja 3 dodaje kolumny (na końcu wierszy) – pliki w wersji 1 i 2 wczytują się bez zmian.

PROJEKT; nazwa; oznaczenie; rewizja
ZLECENIE; numer; klient; obiekt; adres            – (opcjonalnie) dane zlecenia
MODUL; 17.5                                       – podziałka modułu mm
ODSTEP; 0                                         – odstęp między szafami mm
SZAFA; szerokość; wysokość; cokół; zawiasy; skrzydła   – cokół w mm (0 = brak); zawiasy: lewa | prawa; skrzydła: 1 | 2 (opcjonalne)
PUSTE; wysokość [; szerokość]
PLYTA; szerokość; wysokość
ZASLEPKA; szerokość; wysokość
MASKOWNICA; szerokość; wysokość; moduły; wys. wycięcia [; położenie]     położenie: blok | srodek | liczba mm od góry
GRUPA; podpis górny; położenie; podpis dolny      położenie: lewa | prawa | liczba (moduł od lewej)
APARAT; kod; symbol; nazwa; grupa; tabelka; moduły; wys.symbolu; wys.nazwy; model; symbol graficzny; położenie symbolu
      kod – z bazy (nieznany jest dodawany); symbol pusty = automat; nazwa: / nowa linia, | kolejne pole tabelki
      tabelka: std | 2 | 3 | 4 | 2obok | 3obok; model np. B16, C32, 40A 30mA
      symbol graficzny: id z biblioteki (gniazdo, gniazdo3f, zarowka, lodowka, piekarnik, plyta, zmywarka, pralka, bojler, pompaciepla, pv,
      wentylator, pompa, silnik, grzejnik, klima, brama, ev, dzwonek, pc, kociol, kuchenka); położenie: left | right | replace | cell1..cell4
BAZA; kod; nazwa; moduły; prefiks; tabelka; model [; zaslepka]
RAMKA; wys.ramki; odstęp; wys.symbolu; wys.nazwy; grubość obrysu; zaokrąglenie; podział %; grubość pion; grubość poziom

PRZYKŁAD
--------
PROJEKT; RG hala; RG; A
ZLECENIE; 2026/09/017; Firma XYZ; Hala produkcyjna; Piła
SZAFA; 750; 2000; 100
PUSTE; 250
MASKOWNICA; 600; 200; 24; 45; blok
GRUPA; ; lewa
APARAT; FR304; ; Rozłącznik główny; ; ; ; ; ; 63A
APARAT; SPD; ; Ochronnik/przepięć; ; ; ; ; ; T1+T2
GRUPA; Zas. gwarantowane PC + Sterowanie; lewa; Pomiar A
APARAT; P304; ; Zas. gwarantowane; ; ; ; ; ; 40A 30mA
APARAT; PRZ; ; UPS|0|Sieć; ; 3
APARAT; PRZ; ; UPS|WYJ >|Sieć; ; 3
APARAT; S301; ; PC; ; ; ; ; ; B10
GRUPA; Rezerwa; prawa
APARAT; S301; ; Rezerwa; ; ; ; ; ; B16
APARAT; Z; ; ; ; ; 1
MASKOWNICA; 600; 200; 24; 45
GRUPA; Kuchnia; lewa
APARAT; P302; ; Gniazda kuchnia; ; ; ; ; ; 25A 30mA
APARAT; S301; ; Gn. kuchnia; ; ; ; ; ; B16; gniazdo; left
GRUPA; PV; 12
APARAT; S303; F20; Falownik PV; ; ; ; ; ; C20; pv; left
ZASLEPKA; 600; 200
PLYTA; 600; 600
SZAFA; 500; 2000; 100
PUSTE; 250
MASKOWNICA; 400; 200; 18; 45
GRUPA; Wentylacja; lewa; Wentylacja hali
APARAT; S303; ; Wentylacja; ; ; ; ; ; C16
ZASLEPKA; 400; 800
`;
function norm(s){ return String(s||'').trim().toUpperCase().replace(/Ą/g,'A').replace(/Ć/g,'C').replace(/Ę/g,'E').replace(/Ł/g,'L').replace(/Ń/g,'N').replace(/Ó/g,'O').replace(/Ś/g,'S').replace(/[ŹŻ]/g,'Z'); }
function num(v,def){ if(v==null||String(v).trim()==='') return def; const n=parseFloat(String(v).replace(',','.')); return isNaN(n)?def:n; }
function tableCode(v){ const t=norm(v); if(!t||t==='STD'||t==='STANDARD') return null; const m=t.match(/^([234])\s*(OBOK|COLS?)?$/); if(m) return (m[2]?'c':'r')+m[1]; if(/^[RC][234]$/.test(t)) return t.toLowerCase(); return null; }
function parseCsv(text){
  const out={name:null,tag:null,rev:null,order:null,pitch:null,cabGap:null,cabinets:[],db:[],label:null,warn:[]}; let cab=null, cover=null, grp=null;
  text.replace(/^\uFEFF/,'').split(/\r?\n/).forEach((raw,ln)=>{ const l=raw.trim(); if(!l||l.startsWith('#')) return; const cells=(l.includes(';')?l.split(';'):l.split('\t')).map(c=>c.trim()); const k=norm(cells[0]); const a=cells.slice(1);
    const needCab=()=>{ if(!cab){ cab=newCab(); out.cabinets.push(cab); out.autoCab=true; } };
    const parseAlign=v=>{ const t=norm(v); if(!t||t==='LEWA'||t==='LEFT'||t==='L') return {align:'left'}; if(t==='PRAWA'||t==='RIGHT'||t==='P'||t==='R') return {align:'right'}; const n=num(v,null); return n!=null?{align:'free',x:Math.max(0,Math.round(n))}:{align:'left'}; };
    switch(k){
      case 'PROJEKT': case 'PROJECT': out.name=a[0]||null; out.tag=a[1]||null; out.rev=a[2]||null; break;
      case 'ZLECENIE': case 'ORDER': out.order={number:a[0]||'',client:a[1]||'',object:a[2]||'',address:a[3]||''}; break;
      case 'MODUL': case 'PITCH': out.pitch=num(a[0],null); break;
      case 'ODSTEP': case 'GAP': out.cabGap=num(a[0],null); break;
      case 'SZAFA': case 'CABINET': cab=newCab(); cab.w=num(a[0],750); cab.h=num(a[1],2000); cab.plinth=num(a[2],0); cab.hinge=(norm(a[3])==='PRAWA'||norm(a[3])==='RIGHT'||norm(a[3])==='P')?'right':'left'; cab.leaves=num(a[4],1)===2?2:1; out.cabinets.push(cab); cover=null; grp=null; break;
      case 'PUSTE': case 'EMPTY': needCab(); cab.items.push({id:uid(),type:'empty',w:num(a[1],cab.w),h:num(a[0],100)}); cover=null; grp=null; break;
      case 'PLYTA': case 'PLATE': needCab(); cab.items.push({id:uid(),type:'plate',w:num(a[0],cab.w),h:num(a[1],400)}); cover=null; grp=null; break;
      case 'ZASLEPKA': case 'BLANK': needCab(); cab.items.push({id:uid(),type:'blank',w:num(a[0],cab.w),h:num(a[1],150)}); cover=null; grp=null; break;
      case 'MASKOWNICA': case 'COVER': { needCab(); const posRaw=norm(a[4]); let pos='block', nicheY=null; if(posRaw==='SRODEK'||posRaw==='CENTER') pos='niche'; else if(posRaw&&posRaw!=='BLOK'&&posRaw!=='BLOCK'){ const n=num(a[4],null); if(n!=null){ pos='top'; nicheY=n; } }
        cover={id:uid(),type:'cover',w:num(a[0],cab.w),h:num(a[1],150),row:{mod:Math.max(1,Math.round(num(a[2],24))),nicheH:num(a[3],45),nicheY,pos,groups:[]}}; cab.items.push(cover); grp=null; break; }
      case 'GRUPA': case 'GROUP': { if(!cover){ out.warn.push(`wiersz ${ln+1}: GRUPA bez MASKOWNICA – pominięto`); return; } grp=Object.assign(newGroup(a[0]||'','left'),parseAlign(a[1])); grp.bot=a[2]||''; cover.row.groups.push(grp); break; }
      case 'APARAT': case 'DEVICE': { if(!cover){ out.warn.push(`wiersz ${ln+1}: APARAT bez MASKOWNICA – pominięto`); return; }
        const gname=a[3]||''; if(!grp || (gname && grp.name!==gname)){ grp=newGroup(gname,'left'); cover.row.groups.push(grp); }
        const code=a[0]||'?'; out.db.push({code}); grp.devices.push({id:uid(),code,symbol:a[1]||'',auto:!(a[1]||'').trim(),name:a[2]||'',tableCsv:tableCode(a[4]),modCsv:num(a[5],null),symH:num(a[6],null),nameH:num(a[7],null),rating:a[8]||'',icon:a[9]||'',iconPos:a[10]||''}); break; }
      case 'BAZA': case 'DB': out.db.push({code:a[0]||'?',name:a[1]||'',mod:num(a[2],1),prefix:a[3]||'',table:tableCode(a[4])||'std',rating:a[5]||'',blank:/^(1|TAK|YES|TRUE|ZASLEPKA)$/.test(norm(a[6]))||norm(a[4])==='ZASLEPKA',def:true}); break;
      case 'RAMKA': case 'FRAME': out.label={h:num(a[0],null),gap:num(a[1],null),symH:num(a[2],null),nameH:num(a[3],null),lwMain:num(a[4],null),frameR:num(a[5],null),split:num(a[6],null),lwDivV:num(a[7],null),lwDivH:num(a[8],null)}; break;
      default: out.warn.push(`wiersz ${ln+1}: nieznany typ „${cells[0]}” – pominięto`);
    } });
  return out; }
function applyCsv(parsed, replace){
  snapshot(); if(replace){ const nb=newBoard(); nb.cabinets=[]; nb.id=P.id; nb.label=P.label; nb.grpTop=P.grpTop; nb.grpBot=P.grpBot; P=nb; }
  if(parsed.name) P.name=parsed.name; if(parsed.tag) P.tag=parsed.tag; if(parsed.rev) P.revision=parsed.rev; if(parsed.pitch!=null) P.pitch=parsed.pitch; if(parsed.cabGap!=null) P.cabGap=parsed.cabGap;
  if(parsed.order){ Object.assign(ORDER,parsed.order); ORDER.updated=Date.now(); }
  if(parsed.label) for(const [k,v] of Object.entries(parsed.label)) if(v!=null) P.label[k]=v;
  for(const e of parsed.db.filter(x=>x.def)){ const ex=DB.find(d=>norm(d.code)===norm(e.code)); if(ex) Object.assign(ex,{name:e.name||ex.name,mod:e.mod,prefix:e.prefix,table:e.table,rating:e.rating||ex.rating,blank:e.blank}); else DB.push({code:e.code,name:e.name,mod:e.mod,prefix:e.prefix,table:e.table,rating:e.rating,blank:e.blank}); SETTINGS.libUpdated=Date.now(); }
  const added=[];
  for(const cab of parsed.cabinets){ for(const it of cab.items){ if(it.type!=='cover') continue; for(const g of it.row.groups) g.devices=g.devices.map(d=>{ let b=DB.find(x=>norm(x.code)===norm(d.code));
      if(!b){ b={code:d.code,name:'',mod:d.modCsv||1,prefix:'F',table:d.tableCsv||'std',rating:''}; DB.push(b); added.push(d.code); SETTINGS.libUpdated=Date.now(); }
      return {id:d.id,code:b.code,name:b.blank?'':d.name,mod:d.modCsv||b.mod,prefix:b.prefix,blank:!!b.blank,auto:d.auto,symbol:d.symbol,table:d.tableCsv||b.table||'std',rating:d.rating||b.rating||'',symH:d.symH,nameH:d.nameH,icon:d.icon&&iconById(d.icon)?d.icon:'',iconPos:d.iconPos||'left'}; }); } P.cabinets.push(cab); }
  if(!P.cabinets.length) P.cabinets.push(newCab()); saveLibrary();
  selCab=parsed.cabinets[0]||P.cabinets[0]; selItem=null; selGrp=null; selDev=null; ZOOM.key=''; syncInputs(); change(); renderPalette();
  const w=[...parsed.warn]; if(added.length) w.push('Dodano do bazy nieznane kody: '+[...new Set(added)].join(', ')+' (uzupełnij w Bibliotece)');
  const m=$('csvMsg'); m.style.display='block'; m.className='msg'+(parsed.warn.length?' err':' ok'); m.textContent=`Wczytano ${parsed.cabinets.length} szaf, ${parsed.cabinets.reduce((a,c)=>a+c.items.length,0)} elementów.`+(w.length?' '+w.join(' · '):''); }
function tableOut(t){ if(!t||t==='std') return ''; return t[1]+(t[0]==='c'?'obok':''); }
function exportCsv(only){ const q=v=>String(v==null?'':v).replace(/;/g,','); const L=P.label; if(only){ const r=only.row; const pos=r.pos==='niche'?'srodek': r.pos==='top'?(r.nicheY==null?'blok':r.nicheY):'blok'; let o=[`# ${APP_NAME} – opisy rzędu`,`MASKOWNICA; ${only.w}; ${only.h}; ${r.mod}; ${r.nicheH}; ${pos}`]; const gx=groupX(r); for(const g of r.groups){ o.push(`GRUPA; ${q(g.name)}; ${g.align==='left'?'lewa':g.align==='right'?'prawa':gx.get(g.id)}; ${q(g.bot)}`); for(const d of g.devices) o.push(`APARAT; ${q(d.code)}; ${d.auto===false?q(d.symbol):''}; ${q(d.name)}; ; ${tableOut(d.table)}; ${d.mod}; ${d.symH||''}; ${d.nameH||''}; ${q(d.rating)}; ${q(d.icon||'')}; ${d.icon?(d.iconPos||'left'):''}`); } return o.join('\n')+'\n'; }
  let o=[`# ${APP_NAME} ${APP_VER} – eksport ${new Date().toLocaleString('pl-PL')} (format CSV v3)`,`PROJEKT; ${q(P.name)}; ${q(P.tag)}; ${q(P.revision)}`,`ZLECENIE; ${q(ORDER.number)}; ${q(ORDER.client)}; ${q(ORDER.object)}; ${q(ORDER.address)}`,`MODUL; ${P.pitch}`,`ODSTEP; ${P.cabGap||0}`,`RAMKA; ${L.h}; ${L.gap}; ${L.symH}; ${L.nameH}; ${L.lwMain}; ${L.frameR}; ${L.split}; ${L.lwDivV}; ${L.lwDivH}`];
  for(const d of DB) o.push(`BAZA; ${q(d.code)}; ${q(d.name)}; ${d.mod}; ${q(d.prefix)}; ${tableOut(d.table)||'std'}; ${q(d.rating)}${d.blank?'; zaslepka':''}`);
  for(const c of P.cabinets){ o.push(`SZAFA; ${c.w}; ${c.h}; ${c.plinth||0}; ${c.hinge==='right'?'prawa':'lewa'}; ${c.leaves===2?2:1}`); for(const it of c.items){
    if(it.type==='empty') o.push(`PUSTE; ${it.h}; ${it.w}`); else if(it.type==='plate') o.push(`PLYTA; ${it.w}; ${it.h}`); else if(it.type==='blank') o.push(`ZASLEPKA; ${it.w}; ${it.h}`);
    else { const r=it.row; const pos=r.pos==='niche'?'srodek': r.pos==='top'?(r.nicheY==null?'blok':r.nicheY):'blok'; o.push(`MASKOWNICA; ${it.w}; ${it.h}; ${r.mod}; ${r.nicheH}; ${pos}`); const gx=groupX(r);
      for(const g of r.groups){ o.push(`GRUPA; ${q(g.name)}; ${g.align==='left'?'lewa':g.align==='right'?'prawa':gx.get(g.id)}; ${q(g.bot)}`);
        for(const d of g.devices) o.push(`APARAT; ${q(d.code)}; ${d.auto===false?q(d.symbol):''}; ${q(d.name)}; ; ${tableOut(d.table)}; ${d.mod}; ${d.symH||''}; ${d.nameH||''}; ${q(d.rating)}; ${q(d.icon||'')}; ${d.icon?(d.iconPos||'left'):''}`); } } } }
  return o.join('\n')+'\n'; }
let csvMode='new';
$('btnCsvNew').onclick=()=>{ csvMode='new'; $('csvFile').click(); }; $('btnCsvAdd').onclick=()=>{ csvMode='add'; $('csvFile').click(); };
$('csvFile').addEventListener('change',e=>readFile(e.target,(txt,file)=>{ const parsed=parseCsv(txt); if(!parsed.cabinets.length&&!parsed.db.length) throw new Error('nie znaleziono wierszy SZAFA/MASKOWNICA'); if(csvMode==='new'&&!confirm('Zastąpić bieżącą rozdzielnicę danymi z pliku '+file.name+'?')) return; applyCsv(parsed, csvMode==='new'); }));
$('btnCsvOut').onclick=()=>saveFile(`${fname(P.tag||P.name)}.csv`, '\uFEFF'+exportCsv());
$('btnCsvSpec').onclick=()=>saveFile('eitlab-format-csv.txt', CSV_SPEC);

/* ===================== Boot ===================== */
(async function boot(){
  renderLayers();
  await IDB.open();
  const uf=await IDB.get('fonts'); if(uf&&uf.length) USERFONTS=uf; const ui=await IDB.get('icons'); if(ui&&ui.length) USERICONS=ui; const ut=await IDB.get('templates'); if(ut&&ut.length) TEMPLATES=ut;
  $('font').innerHTML=fontSelectOptions(); $('fontSym').innerHTML=fontSelectOptions(); $('fontInfo').innerHTML=fontSelectOptions();
  const st=await IDB.get('settings'); if(st) SETTINGS=Object.assign(SETTINGS,st); document.documentElement.dataset.theme=SETTINGS.theme||'light';
  const dbs=await IDB.get('devices'); if(dbs&&dbs.length) DB=dbs; for(const d of DB){ if(!d.table) d.table='std'; if(d.rating==null) d.rating=''; }
  const enc=await IDB.get('enclosures'); if(enc&&enc.length) ENC=enc;
  let order=null, board=null;
  if(SETTINGS.current){ order=await IDB.get('order:'+SETTINGS.current.orderId); board=await IDB.get('board:'+SETTINGS.current.boardId); }
  if(!order){ const orders=await listOrders(); order=orders[0]||null; if(order){ const bs=await listBoards(order.id); board=bs[0]||null; } }
  if(!order){ // migrate legacy single-project storage or create demo
    order=newOrder(); order.number='DEMO'; order.client='Przykład'; let legacy=null; try{ legacy=JSON.parse(localStorage.getItem('rg4-current')||localStorage.getItem('rg3-current')||'null'); }catch(e){}
    if(legacy&&(legacy.cabinets||legacy.rows)){ board=migrateBoard(legacy); board.name=legacy.name||'Rozdzielnica'; if(legacy.db) { for(const d of legacy.db){ if(!DB.find(x=>x.code===d.code)) DB.push(Object.assign({table:'std',rating:''},d)); } } }
    else { board=newBoard(); board.cabinets=[]; P=board; ORDER=order; applyCsv(parseCsv(CSV_SPEC.slice(CSV_SPEC.indexOf('PROJEKT; RG hala'))), true); $('csvMsg').style.display='none'; board=P; }
    board.orderId=order.id; ORDER=order; await IDB.set('order:'+order.id,order); await IDB.set('board:'+board.id,board); }
  ORDER=order; if(!board){ board=newBoard(); board.orderId=order.id; }
  loadBoard(board); renderPalette();
  if(SETTINGS.gClientId&&SETTINGS.gAuto&&location.protocol==='https:'){ /* silent sign-in attempt */ try{ await loadGis(); gTokenClient=google.accounts.oauth2.initTokenClient({client_id:SETTINGS.gClientId, scope:'https://www.googleapis.com/auth/drive.appdata', callback:r=>{ if(!r.error){ gToken=r.access_token; driveSync(true); } }}); gTokenClient.requestAccessToken({prompt:''}); }catch(e){} }
  if('serviceWorker' in navigator && location.protocol==='https:'){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
  DL.then(dl=>{ if(dl) showDl('Pobieranie działa przez okno Claude: pliki DXF/CSV zapisują się z końcówką .txt – po pobraniu usuń ją. Wersja PWA/offline zapisuje bez tego ograniczenia.'); });
})();
