/* ===================== Icon library (closed contours, 100×100 box, y down) ===================== */
const IC={
  circ(cx,cy,r,n){ n=n||32; const p=[]; for(let i=0;i<n;i++){ const a=i/n*2*Math.PI; p.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]); } return p; },
  ring(cx,cy,r,t){ return [IC.circ(cx,cy,r), IC.circ(cx,cy,r-t)]; },
  rect(x,y,w,h){ return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]]; },
  rrect(x,y,w,h,r){ r=Math.min(r,w/2,h/2); const p=[]; const c=(cx,cy,a0)=>{ for(let i=0;i<=6;i++){ const a=a0+i/6*Math.PI/2; p.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]); } }; c(x+w-r,y+r,-Math.PI/2); c(x+w-r,y+h-r,0); c(x+r,y+h-r,Math.PI/2); c(x+r,y+r,Math.PI); return p; },
  frame(x,y,w,h,t,r){ return [IC.rrect(x,y,w,h,r||0), IC.rrect(x+t,y+t,w-2*t,h-2*t,Math.max(0,(r||0)-t))]; },
  band(x1,y1,x2,y2,t){ const L=Math.hypot(x2-x1,y2-y1)||1; const nx=-(y2-y1)/L*t/2, ny=(x2-x1)/L*t/2; return [[x1+nx,y1+ny],[x2+nx,y2+ny],[x2-nx,y2-ny],[x1-nx,y1-ny]]; },
  arc(cx,cy,r,a0,a1,n){ const p=[]; for(let i=0;i<=n;i++){ const a=(a0+(a1-a0)*i/n)*Math.PI/180; p.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]); } return p; },
  rot(pts,cx,cy,deg){ const a=deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a); return pts.map(([x,y])=>[cx+(x-cx)*c-(y-cy)*s, cy+(x-cx)*s+(y-cy)*c]); }
};
const ICONS=[
 {id:'gniazdo', name:'Gniazdo 230V', c:()=>[...IC.ring(50,50,42,6), IC.circ(36,50,6), IC.circ(64,50,6), IC.band(50,10,50,24,6), IC.band(50,76,50,90,6)]},
 {id:'gniazdo3f', name:'Gniazdo 400V', c:()=>{ const pent=[]; for(let i=0;i<5;i++){ const a=(-90+i*72)*Math.PI/180; pent.push([50+42*Math.cos(a),52+42*Math.sin(a)]); } const inner=pent.map(([x,y])=>[50+(x-50)*0.82,52+(y-52)*0.82]); const pins=[]; for(let i=0;i<5;i++){ const a=(-90+i*72)*Math.PI/180; pins.push(IC.circ(50+22*Math.cos(a),52+22*Math.sin(a),5)); } return [pent,inner,...pins]; }},
 {id:'zarowka', name:'Oświetlenie', c:()=>{ const outer=[...IC.arc(50,40,30,50,490,40).slice(0,-1),[62,72],[38,72]]; const inner=outer.map(([x,y])=>[50+(x-50)*0.78, 40+(y-40)*0.78+2]); return [outer, inner, ...IC.frame(38,75,24,10,3), IC.rect(42,87,16,5), IC.rot(IC.band(50,-8,50,2,4),50,40,-45), IC.rot(IC.band(50,-8,50,2,4),50,40,45), IC.band(50,-10,50,0,4)]; }},
 {id:'lodowka', name:'Lodówka', c:()=>[...IC.frame(30,6,40,88,4,3), IC.band(34,38,66,38,3), IC.band(38,18,38,30,3), IC.band(38,46,38,64,3)]},
 {id:'piekarnik', name:'Piekarnik', c:()=>[...IC.frame(12,12,76,76,4,3), IC.band(16,32,84,32,3), ...IC.frame(24,40,52,40,3,2), IC.circ(24,22,4), IC.circ(38,22,4), IC.circ(62,22,4), IC.circ(76,22,4)]},
 {id:'plyta', name:'Płyta grzewcza', c:()=>[...IC.frame(12,12,76,76,4,3), ...IC.ring(33,33,12,3), ...IC.ring(67,33,12,3), ...IC.ring(33,67,12,3), ...IC.ring(67,67,12,3)]},
 {id:'zmywarka', name:'Zmywarka', c:()=>[...IC.frame(12,12,76,76,4,3), IC.band(16,28,84,28,3), IC.circ(24,20,3.5), IC.circ(76,20,3.5), ...IC.ring(50,58,16,3), IC.band(50,42,50,74,3), IC.band(34,58,66,58,3)]},
 {id:'pralka', name:'Pralka', c:()=>[...IC.frame(12,12,76,76,4,3), IC.band(16,28,84,28,3), IC.rect(20,17,14,6), IC.circ(72,21,4), ...IC.ring(50,58,20,4), ...IC.ring(50,58,10,3)]},
 {id:'bojler', name:'Bojler', c:()=>[...IC.frame(28,6,44,88,4,14), IC.band(36,40,64,40,3), IC.band(36,52,64,52,3), IC.band(36,64,64,64,3), IC.rect(40,94,4,6), IC.rect(56,94,4,6)]},
 {id:'pompaciepla', name:'Pompa ciepła', c:()=>[...IC.frame(10,18,80,64,4,3), ...IC.ring(38,50,22,3), ...[0,120,240].map(a=>IC.rot([[38,50],[30,34],[46,34]],38,50,a)), IC.band(70,30,70,70,3), IC.band(78,30,78,70,3)]},
 {id:'pv', name:'Fotowoltaika', c:()=>[...IC.frame(8,18,84,54,4,2), IC.band(36,22,36,68,2.5), IC.band(64,22,64,68,2.5), IC.band(12,45,88,45,2.5), IC.band(50,72,50,90,4), IC.rect(36,88,28,5)]},
 {id:'wentylator', name:'Wentylator', c:()=>[...IC.ring(50,50,44,4), IC.circ(50,50,8), ...[0,120,240].map(a=>IC.rot([[50,42],[62,22],[74,26],[70,40],[58,50]],50,50,a))]},
 {id:'pompa', name:'Pompa', c:()=>[...IC.ring(50,52,34,4), [[36,36],[66,52],[36,68]], IC.rect(4,46,14,12), IC.rect(82,46,14,12)]},
 {id:'silnik', name:'Silnik', c:()=>[...IC.ring(50,50,42,4), IC.band(30,68,30,32,5), IC.band(30,32,50,58,5), IC.band(50,58,70,32,5), IC.band(70,32,70,68,5)]},
 {id:'grzejnik', name:'Grzejnik', c:()=>[...[14,30,46,62,78].map(x=>IC.rrect(x,14,10,72,4)), IC.band(8,24,92,24,3), IC.band(8,76,92,76,3)]},
 {id:'klima', name:'Klimatyzacja', c:()=>[...IC.frame(6,16,88,40,4,6), IC.band(14,44,86,44,2.5), IC.band(20,72,20,90,4), IC.band(40,72,40,90,4), IC.band(60,72,60,90,4), IC.band(80,72,80,90,4)]},
 {id:'brama', name:'Brama', c:()=>[...IC.frame(6,10,88,84,4,2), IC.band(10,34,90,34,3), IC.band(10,54,90,54,3), IC.band(10,74,90,74,3)]},
 {id:'ev', name:'Ładowarka EV', c:()=>[...IC.frame(16,8,56,80,4,4), IC.rect(20,88,48,6), [[48,20],[36,50],[46,50],[40,72],[58,42],[48,42],[54,20]], IC.band(72,30,84,30,4), IC.band(84,30,84,56,4), IC.circ(84,60,6)]},
 {id:'dzwonek', name:'Dzwonek', c:()=>[[...IC.arc(50,48,30,180,360,24),[80,70],[92,80],[8,80],[20,70]], IC.circ(50,86,7), IC.rect(46,10,8,10)]},
 {id:'pc', name:'PC / router', c:()=>[...IC.frame(8,14,84,56,4,3), IC.band(50,70,50,82,6), IC.rect(28,82,44,6)]},
 {id:'kociol', name:'Kocioł CO', c:()=>[...IC.frame(20,8,60,84,4,4), ...IC.ring(50,40,14,3), [[50,58],[40,76],[50,70],[60,76]], IC.rect(30,92,6,6), IC.rect(64,92,6,6)]},
 {id:'kuchenka', name:'Mikrofalówka', c:()=>[...IC.frame(6,20,88,60,4,3), ...IC.frame(14,28,54,44,3,2), IC.circ(80,36,5), IC.circ(80,52,5), IC.rect(74,62,12,4)]},
];
let USERICONS=[];
function iconById(id){ return ICONS.find(i=>i.id===id)||USERICONS.find(i=>i.id===id)||null; }
function iconContours(ic){ if(ic.contours) return ic.contours; const c=ic.c(); return c; }
// place icon into box (x,y,w,h) keeping aspect, centered; returns polys on layer
function iconPolys(id, x, y, w, h, layer, scale){ const ic=iconById(id); if(!ic) return []; const cs=iconContours(ic); let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9; cs.forEach(c=>c.forEach(([px,py])=>{minx=Math.min(minx,px);miny=Math.min(miny,py);maxx=Math.max(maxx,px);maxy=Math.max(maxy,py);})); const bw=maxx-minx||1,bh=maxy-miny||1; const k=Math.min(w/bw,h/bh)*(scale||1); const ox=x+w/2-bw*k/2-minx*k, oy=y+h/2-bh*k/2-miny*k; return cs.map(c=>({closed:true, layer, icon:true, pts:c.map(([px,py])=>[ox+px*k, oy+py*k])})); }
// parse simple SVG path data → contours (closed), normalized to 100 box
function svgPathToContours(d, segs){ segs=segs||8; const toks=d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g)||[]; const cs=[]; let cur=null, x=0,y=0, sx=0,sy=0, cmd='', i=0, lastC=null;
  const num=()=>parseFloat(toks[i++]); const start=(px,py)=>{ cur=[[px,py]]; cs.push(cur); x=px;y=py;sx=px;sy=py; };
  const cub=(x1,y1,x2,y2,x3,y3)=>{ const x0=x,y0=y; for(let t=1;t<=segs;t++){ const u=t/segs,v=1-u; cur.push([v*v*v*x0+3*v*v*u*x1+3*v*u*u*x2+u*u*u*x3, v*v*v*y0+3*v*v*u*y1+3*v*u*u*y2+u*u*u*y3]); } x=x3;y=y3; lastC=[x2,y2]; };
  const quad=(x1,y1,x2,y2)=>{ const x0=x,y0=y; for(let t=1;t<=segs;t++){ const u=t/segs,v=1-u; cur.push([v*v*x0+2*v*u*x1+u*u*x2, v*v*y0+2*v*u*y1+u*u*y2]); } x=x2;y=y2; lastC=[x1,y1]; };
  while(i<toks.length){ const t=toks[i]; if(/[a-zA-Z]/.test(t)){ cmd=t; i++; if(cmd==='Z'||cmd==='z'){ x=sx;y=sy; cur=null; continue; } }
    const rel=cmd===cmd.toLowerCase(); const C=cmd.toUpperCase();
    if(C==='M'){ let px=num(),py=num(); if(rel){px+=x;py+=y;} start(px,py); cmd=rel?'l':'L'; }
    else if(C==='L'){ let px=num(),py=num(); if(rel){px+=x;py+=y;} if(!cur) start(x,y); cur.push([px,py]); x=px;y=py; }
    else if(C==='H'){ let px=num(); if(rel) px+=x; if(!cur) start(x,y); cur.push([px,y]); x=px; }
    else if(C==='V'){ let py=num(); if(rel) py+=y; if(!cur) start(x,y); cur.push([x,py]); y=py; }
    else if(C==='C'){ let a=[num(),num(),num(),num(),num(),num()]; if(rel){ a=[a[0]+x,a[1]+y,a[2]+x,a[3]+y,a[4]+x,a[5]+y]; } if(!cur) start(x,y); cub(...a); }
    else if(C==='S'){ let a=[num(),num(),num(),num()]; if(rel){ a=[a[0]+x,a[1]+y,a[2]+x,a[3]+y]; } const r=lastC?[2*x-lastC[0],2*y-lastC[1]]:[x,y]; if(!cur) start(x,y); cub(r[0],r[1],a[0],a[1],a[2],a[3]); }
    else if(C==='Q'){ let a=[num(),num(),num(),num()]; if(rel){ a=[a[0]+x,a[1]+y,a[2]+x,a[3]+y]; } if(!cur) start(x,y); quad(...a); }
    else if(C==='T'){ let a=[num(),num()]; if(rel){ a=[a[0]+x,a[1]+y]; } const r=lastC?[2*x-lastC[0],2*y-lastC[1]]:[x,y]; if(!cur) start(x,y); quad(r[0],r[1],a[0],a[1]); }
    else if(C==='A'){ const rx=num(),ry=num(); num(); num(); num(); let px=num(),py=num(); if(rel){px+=x;py+=y;} if(!cur) start(x,y); for(let t=1;t<=segs;t++){ const u=t/segs; cur.push([x+(px-x)*u, y+(py-y)*u]); } x=px;y=py; }
    else { i++; } if(C!=='C'&&C!=='S'&&C!=='Q'&&C!=='T') lastC=null; }
  const out=cs.filter(c=>c.length>2); let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9; out.forEach(c=>c.forEach(([px,py])=>{minx=Math.min(minx,px);miny=Math.min(miny,py);maxx=Math.max(maxx,px);maxy=Math.max(maxy,py);})); const k=100/Math.max(maxx-minx,maxy-miny,1e-6); return out.map(c=>c.map(([px,py])=>[(px-minx)*k,(py-miny)*k])); }
function svgToContours(svgText){ const doc=new DOMParser().parseFromString(svgText,'image/svg+xml'); let cs=[]; doc.querySelectorAll('path').forEach(p=>{ cs=cs.concat(svgPathToContours(p.getAttribute('d')||'')); }); doc.querySelectorAll('rect').forEach(r=>{ const x=+r.getAttribute('x')||0,y=+r.getAttribute('y')||0,w=+r.getAttribute('width')||0,h=+r.getAttribute('height')||0; cs.push(IC.rect(x,y,w,h)); }); doc.querySelectorAll('circle').forEach(c=>{ cs.push(IC.circ(+c.getAttribute('cx')||0,+c.getAttribute('cy')||0,+c.getAttribute('r')||1)); }); doc.querySelectorAll('polygon').forEach(p=>{ const n=(p.getAttribute('points')||'').trim().split(/[\s,]+/).map(Number); const c=[]; for(let i=0;i+1<n.length;i+=2) c.push([n[i],n[i+1]]); if(c.length>2) cs.push(c); });
  if(!cs.length) return []; let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9; cs.forEach(c=>c.forEach(([px,py])=>{minx=Math.min(minx,px);miny=Math.min(miny,py);maxx=Math.max(maxx,px);maxy=Math.max(maxy,py);})); const k=100/Math.max(maxx-minx,maxy-miny,1e-6); return cs.map(c=>c.map(([px,py])=>[(px-minx)*k,(py-miny)*k])); }
function iconSvgPreview(id, size){ const polys=iconPolys(id,2,2,(size||40)-4,(size||40)-4,'ICON'); return `<svg viewBox="0 0 ${size||40} ${size||40}" width="${size||40}" height="${size||40}"><path d="${polys.map(p=>p.pts.map((q,i)=>(i?'L':'M')+f(q[0])+' '+f(q[1])).join('')+'Z').join(' ')}" fill="currentColor" fill-rule="evenodd"/></svg>`; }
